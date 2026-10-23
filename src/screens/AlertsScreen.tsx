
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import {
  mockAlertsScenarios,
  MockScenario,
} from "../data/mockScenarios";
import type {
  RootStackParamList,
  NewOccurrence,
} from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Alerts"
>;

type RiskFilter = "Todos" | "Alto" | "Médio" | "Baixo";

type DisplayAlert = {
  id: number;
  region: string;
  km: string;
  height: number;
  growthTrend: string;
  isNewOccurrence?: boolean;
  occurrence?: NewOccurrence;
};

const OCCURRENCES_STORAGE_KEY = "@smarttrack/new-occurrences";

const scenarioLabels: Record<MockScenario, string> = {
  success: "Sucesso",
  empty: "Lista vazia",
  error: "Erro",
};

const riskPriority: Record<string, number> = {
  Alto: 1,
  Médio: 2,
  Baixo: 3,
};

export default function AlertsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [scenario, setScenario] =
    React.useState<MockScenario>("success");
  const [riskFilter, setRiskFilter] =
    React.useState<RiskFilter>("Todos");
  const [showScenarioControls, setShowScenarioControls] =
    React.useState(false);
  const [newOccurrences, setNewOccurrences] =
    React.useState<NewOccurrence[]>([]);

  const currentScenario = mockAlertsScenarios[scenario];
  const currentAlerts = currentScenario.data;

  const loadNewOccurrences = React.useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(
        OCCURRENCES_STORAGE_KEY
      );

      const parsed: unknown = stored ? JSON.parse(stored) : [];
      setNewOccurrences(
        Array.isArray(parsed) ? (parsed as NewOccurrence[]) : []
      );
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível carregar as novas ocorrências."
      );
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadNewOccurrences();
    }, [loadNewOccurrences])
  );

  const getRiskByHeight = (heightInMeters: number) => {
    const heightInCm = heightInMeters * 100;

    return heightInCm >= 30
      ? "Alto"
      : heightInCm >= 15
      ? "Médio"
      : "Baixo";
  };

  const getRiskConfig = (risk: string) => {
    switch (risk) {
      case "Alto":
        return {
          label: "ALTA PRIORIDADE",
          icon: "warning-outline" as const,
          iconColor: "#C0392B",
          iconBackground: "#FDEDEC",
          riskColor: "#C0392B",
          action: "Necessita poda",
        };

      case "Médio":
        return {
          label: "EM ALERTA",
          icon: "alert-circle-outline" as const,
          iconColor: "#B8860B",
          iconBackground: "#FEF9E7",
          riskColor: "#B8860B",
          action: "Necessita acompanhamento",
        };

      default:
        return {
          label: "MONITORADO",
          icon: "checkmark-circle-outline" as const,
          iconColor: "#176B43",
          iconBackground: "#EAF6EF",
          riskColor: "#176B43",
          action: "Vegetação controlada",
        };
    }
  };

  const filteredAlerts = React.useMemo<DisplayAlert[]>(() => {
    const existingAlerts: DisplayAlert[] =
      scenario === "success"
        ? currentAlerts.map((item) => ({
            id: item.id,
            region: item.region,
            km: item.km,
            height: item.height,
            growthTrend: item.growthTrend,
          }))
        : [];

    const registeredOccurrences: DisplayAlert[] =
      scenario === "success"
        ? newOccurrences.map((item) => ({
            id: item.id,
            region:
              item.placeName?.trim() ||
              item.location ||
              "Local não informado",
            km:
              item.km?.trim() ||
              item.location ||
              "Quilômetro não informado",
            height: item.height / 100,
            growthTrend:
              item.risk === "Alto"
                ? "Alta"
                : item.risk === "Médio"
                ? "Média"
                : "Baixa",
            isNewOccurrence: true,
            occurrence: item,
          }))
        : [];

    return [...existingAlerts, ...registeredOccurrences]
      .sort(
        (a, b) =>
          (riskPriority[getRiskByHeight(a.height)] ?? 4) -
          (riskPriority[getRiskByHeight(b.height)] ?? 4)
      )
      .filter(
        (item) =>
          riskFilter === "Todos" ||
          getRiskByHeight(item.height) === riskFilter
      );
  }, [currentAlerts, riskFilter, newOccurrences, scenario]);

  const handleScenarioChange = (nextScenario: MockScenario) => {
    setScenario(nextScenario);
    setRiskFilter("Todos");
    setShowScenarioControls(false);
  };

  const handleRetry = () => {
    setScenario("success");
    setRiskFilter("Todos");
    setShowScenarioControls(false);
  };

  const handleOpenDetails = (item: DisplayAlert) => {
    navigation.navigate("Details", {
      alertId: item.id,
      ...(item.occurrence
        ? { occurrence: item.occurrence }
        : {}),
    });
  };

  const handleDeleteOccurrence = (item: DisplayAlert) => {
    if (!item.isNewOccurrence || !item.occurrence) {
      return;
    }

    const occurrence = item.occurrence;
    const occurrenceName =
      occurrence.placeName?.trim() ||
      occurrence.location ||
      "esta ocorrência";

    Alert.alert(
      "Excluir ocorrência",
      `Deseja realmente excluir "${occurrenceName}"? Essa ação não poderá ser desfeita.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem(
                OCCURRENCES_STORAGE_KEY
              );

              const parsed: unknown = stored
                ? JSON.parse(stored)
                : [];

              const occurrences: NewOccurrence[] =
                Array.isArray(parsed) ? parsed : [];

              const updatedOccurrences = occurrences.filter(
                (savedOccurrence) =>
                  savedOccurrence.id !== occurrence.id
              );

              await AsyncStorage.setItem(
                OCCURRENCES_STORAGE_KEY,
                JSON.stringify(updatedOccurrences)
              );

              setNewOccurrences(updatedOccurrences);
            } catch (error) {
              console.error(
                "Erro ao excluir ocorrência:",
                error
              );

              Alert.alert(
                "Erro",
                "Não foi possível excluir a ocorrência. Tente novamente."
              );
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: DisplayAlert }) => {
    const heightInCm = Math.round(item.height * 100);
    const calculatedRisk = getRiskByHeight(item.height);
    const config = getRiskConfig(calculatedRisk);

    const trendColor =
      calculatedRisk === "Alto"
        ? "#C0392B"
        : calculatedRisk === "Médio"
        ? "#B8860B"
        : "#176B43";

    const trendBackground =
      calculatedRisk === "Alto"
        ? styles.redIndicator
        : calculatedRisk === "Médio"
        ? styles.yellowIndicator
        : styles.greenIndicator;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleOpenDetails(item)}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: config.iconBackground },
              ]}
            >
              <Ionicons
                name={config.icon}
                size={22}
                color={config.iconColor}
              />
            </View>

            <View style={styles.cardHeaderContent}>
              <Text
                style={[
                  styles.priorityLabel,
                  { color: config.riskColor },
                ]}
              >
                {config.label}
              </Text>

              <Text style={styles.region}>{item.region}</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={21}
              color="#A1AAA5"
            />
          </View>

          <View style={styles.locationRow}>
            <Ionicons
              name="navigate-outline"
              size={16}
              color="#607D6B"
            />

            <Text style={styles.km}>{item.km}</Text>
            <View style={styles.separator} />

            <Text style={styles.road}>
              BR-381 • Fernão Dias
            </Text>
          </View>

          <Text style={styles.status}>
            {item.isNewOccurrence
              ? `${config.action} • Nova ocorrência registrada`
              : config.action}
          </Text>

          <View style={styles.indicatorsRow}>
            <View style={styles.indicator}>
              <View
                style={[
                  styles.indicatorIcon,
                  styles.greenIndicator,
                ]}
              >
                <Ionicons
                  name="resize-outline"
                  size={17}
                  color="#176B43"
                />
              </View>

              <View>
                <Text style={styles.indicatorLabel}>Altura</Text>
                <Text style={styles.indicatorValue}>
                  {heightInCm} cm
                </Text>
              </View>
            </View>

            <View style={styles.indicator}>
              <View
                style={[styles.indicatorIcon, trendBackground]}
              >
                <Ionicons
                  name="trending-up-outline"
                  size={17}
                  color={trendColor}
                />
              </View>

              <View>
                <Text style={styles.indicatorLabel}>
                  Tendência
                </Text>
                <Text style={styles.indicatorValue}>
                  {item.growthTrend}
                </Text>
              </View>
            </View>

            <View style={styles.indicator}>
              <View
                style={[
                  styles.indicatorIcon,
                  { backgroundColor: config.iconBackground },
                ]}
              >
                <Ionicons
                  name="shield-outline"
                  size={17}
                  color={config.riskColor}
                />
              </View>

              <View>
                <Text style={styles.indicatorLabel}>Risco</Text>
                <Text
                  style={[
                    styles.indicatorValue,
                    { color: config.riskColor },
                  ]}
                >
                  {calculatedRisk}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailsText}>
              Ver detalhes da vegetação
            </Text>
            <Ionicons
              name="arrow-forward"
              size={17}
              color="#176B43"
            />
          </View>
        </TouchableOpacity>

        {item.isNewOccurrence && item.occurrence && (
          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.8}
            onPress={() => handleDeleteOccurrence(item)}
            accessibilityRole="button"
            accessibilityLabel="Excluir ocorrência"
          >
            <Ionicons
              name="trash-outline"
              size={17}
              color="#C0392B"
            />
            <Text style={styles.deleteButtonText}>
              Excluir ocorrência
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#193B2A"
          />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Alertas</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#176B43"
          />
        </View>
      </View>

      <View style={styles.listHeader}>
        <View style={styles.listTitleRow}>
          <Text style={styles.listTitle}>Pontos monitorados</Text>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {scenario === "success"
                ? filteredAlerts.length
                : currentAlerts.length}
            </Text>
          </View>
        </View>

        <Text style={styles.listSubtitle}>
          Áreas organizadas por nível de risco
        </Text>
      </View>

      {scenario === "success" && (
        <TouchableOpacity
          style={styles.newOccurrenceButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("NewOccurrence")}
        >
          <Ionicons
            name="add-circle-outline"
            size={21}
            color="#FFFFFF"
          />
          <Text style={styles.newOccurrenceButtonText}>
            Nova ocorrência
          </Text>
        </TouchableOpacity>
      )}

      {scenario === "success" && (
        <View style={styles.filterContainer}>
          <Text style={styles.controlTitle}>
            Filtrar por risco
          </Text>

          <View style={styles.optionsRow}>
            {(["Todos", "Alto", "Médio", "Baixo"] as const).map(
              (option) => {
                const selected = riskFilter === option;

                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.8}
                    style={[
                      styles.filterButton,
                      selected && styles.filterButtonSelected,
                      option === "Alto" &&
                        !selected &&
                        styles.highRiskFilter,
                      option === "Médio" &&
                        !selected &&
                        styles.mediumRiskFilter,
                      option === "Baixo" &&
                        !selected &&
                        styles.lowRiskFilter,
                    ]}
                    onPress={() => setRiskFilter(option)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selected && styles.filterTextSelected,
                        option === "Alto" &&
                          !selected &&
                          styles.highRiskText,
                        option === "Médio" &&
                          !selected &&
                          styles.mediumRiskText,
                        option === "Baixo" &&
                          !selected &&
                          styles.lowRiskText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>
      )}

      <View style={styles.demoContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.demoHeader}
          onPress={() =>
            setShowScenarioControls((previous) => !previous)
          }
        >
          <View style={styles.demoIconContainer}>
            <Ionicons
              name="options-outline"
              size={19}
              color="#176B43"
            />
          </View>

          <View style={styles.demoTextContainer}>
            <Text style={styles.demoTitle}>
              Modo de demonstração
            </Text>
            <Text style={styles.demoSubtitle}>
              Cenário atual: {scenarioLabels[scenario]}
            </Text>
          </View>

          <Ionicons
            name={
              showScenarioControls
                ? "chevron-up"
                : "chevron-down"
            }
            size={20}
            color="#718078"
          />
        </TouchableOpacity>

        {showScenarioControls && (
          <View style={styles.demoOptions}>
            <Text style={styles.demoDescription}>
              Selecione um cenário para testar os estados da aplicação.
            </Text>

            <View style={styles.optionsRow}>
              {(["success", "empty", "error"] as const).map(
                (option) => {
                  const selected = scenario === option;

                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.8}
                      style={[
                        styles.scenarioButton,
                        selected && styles.scenarioButtonSelected,
                      ]}
                      onPress={() => handleScenarioChange(option)}
                    >
                      <Text
                        style={[
                          styles.scenarioText,
                          selected && styles.scenarioTextSelected,
                        ]}
                      >
                        {scenarioLabels[option]}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </View>
        )}
      </View>

      {scenario === "error" ? (
        <ErrorState
          message={currentScenario.error?.message}
          onRetry={handleRetry}
        />
      ) : scenario === "empty" ? (
        <EmptyState onRetry={handleRetry} />
      ) : filteredAlerts.length === 0 ? (
        <View style={styles.noResults}>
          <Ionicons
            name="filter-outline"
            size={30}
            color="#718078"
          />

          <Text style={styles.noResultsTitle}>
            Nenhum ponto neste filtro
          </Text>

          <Text style={styles.noResultsMessage}>
            Selecione outro nível de risco para visualizar os pontos.
          </Text>

          <TouchableOpacity
            style={styles.clearFilterButton}
            onPress={() => setRiskFilter("Todos")}
            activeOpacity={0.85}
          >
            <Text style={styles.clearFilterText}>
              Limpar filtro
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredAlerts}
          keyExtractor={(item) =>
            `${item.isNewOccurrence ? "new" : "existing"}-${item.id}`
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EAF2ED",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#193B2A",
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EAF6EF",
    justifyContent: "center",
    alignItems: "center",
  },
  listHeader: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 14,
  },
  listTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#26352D",
  },
  listSubtitle: {
    fontSize: 12,
    color: "#8A958F",
    marginTop: 4,
  },
  countBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#EAF6EF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 9,
    marginLeft: 10,
  },
  countText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#176B43",
  },
  newOccurrenceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#176B43",
    marginHorizontal: 20,
    marginBottom: 14,
    paddingVertical: 13,
    borderRadius: 13,
  },
  newOccurrenceButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  controlTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#52615A",
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D9E0DC",
    backgroundColor: "#FFFFFF",
  },
  filterButtonSelected: {
    backgroundColor: "#176B43",
    borderColor: "#176B43",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#52615A",
  },
  filterTextSelected: {
    color: "#FFFFFF",
  },
  highRiskFilter: {
    borderColor: "#E5B8B3",
  },
  mediumRiskFilter: {
    borderColor: "#E7D49A",
  },
  lowRiskFilter: {
    borderColor: "#B8D8C4",
  },
  highRiskText: {
    color: "#C0392B",
  },
  mediumRiskText: {
    color: "#98700A",
  },
  lowRiskText: {
    color: "#176B43",
  },
  demoContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E5EBE7",
    overflow: "hidden",
  },
  demoHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  demoIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EAF6EF",
    alignItems: "center",
    justifyContent: "center",
  },
  demoTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#26352D",
  },
  demoSubtitle: {
    fontSize: 11,
    color: "#8A958F",
    marginTop: 3,
  },
  demoOptions: {
    borderTopWidth: 1,
    borderTopColor: "#EDF1EE",
    padding: 12,
  },
  demoDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: "#718078",
    marginBottom: 10,
  },
  scenarioButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#D9E0DC",
    backgroundColor: "#FFFFFF",
  },
  scenarioButtonSelected: {
    backgroundColor: "#176B43",
    borderColor: "#176B43",
  },
  scenarioText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#52615A",
  },
  scenarioTextSelected: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    marginBottom: 13,
    shadowColor: "#193B2A",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  cardHeaderContent: {
    flex: 1,
    marginLeft: 11,
  },
  priorityLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  region: {
    fontSize: 15,
    fontWeight: "700",
    color: "#26352D",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  km: {
    fontSize: 12,
    fontWeight: "700",
    color: "#52615A",
    marginLeft: 5,
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: "#D9E0DC",
    marginHorizontal: 8,
  },
  road: {
    fontSize: 11,
    color: "#9AA39E",
  },
  status: {
    fontSize: 11,
    color: "#718078",
    marginTop: 10,
  },
  indicatorsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#EDF1EE",
    marginTop: 13,
    paddingTop: 12,
    justifyContent: "space-between",
  },
  indicator: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  indicatorIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },
  greenIndicator: {
    backgroundColor: "#EAF6EF",
  },
  yellowIndicator: {
    backgroundColor: "#FEF9E7",
  },
  redIndicator: {
    backgroundColor: "#FDEDEC",
  },
  indicatorLabel: {
    fontSize: 8,
    color: "#9AA39E",
    marginBottom: 2,
  },
  indicatorValue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#435049",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 13,
  },
  detailsText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#176B43",
    marginRight: 6,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F0C9C6",
    backgroundColor: "#FFF7F6",
  },
  deleteButtonText: {
    color: "#C0392B",
    fontSize: 13,
    fontWeight: "700",
  },
  noResults: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#193B2A",
    marginTop: 12,
    textAlign: "center",
  },
  noResultsMessage: {
    fontSize: 13,
    color: "#718078",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
  clearFilterButton: {
    backgroundColor: "#176B43",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 18,
  },
  clearFilterText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});