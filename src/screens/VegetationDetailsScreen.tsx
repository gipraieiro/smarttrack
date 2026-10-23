import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { alerts } from "../data/mockData";
import type {
  NewOccurrence,
  RootStackParamList,
} from "../navigation/AppNavigator";

type DetailsRoute = RouteProp<RootStackParamList, "Details">;
type DetailsNavigation = NativeStackNavigationProp<RootStackParamList>;
type Risk = NewOccurrence["risk"];

type RiskColors = {
  background: string;
  icon: string;
  text: string;
};

const REQUEST_STORAGE_KEY = "@smarttrack/team-requests";

const getRiskByHeight = (height: number): Risk =>
  height >= 30 ? "Alto" : height >= 15 ? "Médio" : "Baixo";

const getRiskColors = (risk: Risk): RiskColors => {
  switch (risk) {
    case "Alto":
      return {
        background: "#FDEDEC",
        icon: "#C0392B",
        text: "#C0392B",
      };

    case "Médio":
      return {
        background: "#FEF9E7",
        icon: "#B8860B",
        text: "#B8860B",
      };

    default:
      return {
        background: "#EAF6EF",
        icon: "#176B43",
        text: "#176B43",
      };
  }
};

const getVegetationImage = (risk: Risk) => {
  switch (risk) {
    case "Alto":
      return require("../../assets/images/vegetacao-alta.png");
    case "Médio":
      return require("../../assets/images/vegetacao-media.png");
    default:
      return require("../../assets/images/vegetacao-baixa.png");
  }
};

const getRiskTitle = (risk: Risk): string => {
  switch (risk) {
    case "Alto":
      return "Vegetação necessita poda";
    case "Médio":
      return "Vegetação em nível de alerta";
    default:
      return "Vegetação controlada";
  }
};

const getRiskDescription = (risk: Risk): string => {
  switch (risk) {
    case "Alto":
      return "A altura da vegetação indica necessidade de intervenção.";
    case "Médio":
      return "A vegetação requer acompanhamento e manutenção preventiva.";
    default:
      return "A vegetação está dentro do nível considerado controlado.";
  }
};

const getTrendColor = (trend: string): string => {
  switch (trend) {
    case "Alta":
      return "#C0392B";
    case "Média":
      return "#B8860B";
    default:
      return "#176B43";
  }
};

export default function VegetationDetailsScreen() {
  const route = useRoute<DetailsRoute>();
  const navigation = useNavigation<DetailsNavigation>();

  const { alertId, occurrence } = route.params;

  const [teamRequested, setTeamRequested] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [requestStatusLoaded, setRequestStatusLoaded] = useState(false);
  const [savingRequest, setSavingRequest] = useState(false);

  // Localiza os dados dos alertas fixos.
  const alertData = alerts.find((item) => item.id === alertId);

  // Novas ocorrências recebem os dados pela navegação.
  const isNewOccurrence = Boolean(occurrence);

  // Novas ocorrências têm altura em centímetros.
  // Os alertas fixos têm altura em metros.
  const heightInCm = occurrence
    ? Number(occurrence.height)
    : Number(alertData?.height ?? 0) * 100;

  const region = occurrence
    ? occurrence.placeName?.trim() || occurrence.location
    : alertData?.region ?? "";

  const locationKm = occurrence
    ? occurrence.km?.trim() || occurrence.location
    : alertData?.km ?? "";

  const temperature = occurrence
    ? Number(occurrence.temperature)
    : Number(alertData?.temperature ?? 0);

  const humidity = occurrence
    ? Number(occurrence.humidity)
    : Number(alertData?.humidity ?? 0);

  const growthTrend = occurrence
    ? occurrence.risk === "Alto"
      ? "Alta"
      : occurrence.risk === "Médio"
        ? "Média"
        : "Baixa"
    : alertData?.growthTrend ?? "Baixa";

  const description = occurrence?.description?.trim() ?? "";

  // Classificação baseada na altura, sempre em centímetros.
  const heightRisk = getRiskByHeight(heightInCm);
  const riskColors = getRiskColors(heightRisk);
  const trendColor = getTrendColor(growthTrend);

  // A identificação separa alertas fixos de novas ocorrências.
  const requestId = occurrence
    ? `occurrence-${occurrence.id}`
    : `alert-${alertId}`;

  // Recupera o status da solicitação salva no dispositivo.
  useEffect(() => {
    let isMounted = true;

    const loadRequestStatus = async () => {
      try {
        const storedRequests = await AsyncStorage.getItem(
          REQUEST_STORAGE_KEY
        );

        const parsed: unknown = storedRequests
          ? JSON.parse(storedRequests)
          : [];

        const requestedIds = Array.isArray(parsed)
          ? parsed.map(String)
          : [];

        if (isMounted) {
          setTeamRequested(requestedIds.includes(requestId));
        }
      } catch {
        if (isMounted) {
          Alert.alert(
            "Aviso",
            "Não foi possível recuperar o status da solicitação salva."
          );
        }
      } finally {
        if (isMounted) {
          setRequestStatusLoaded(true);
        }
      }
    };

    setRequestStatusLoaded(false);
    loadRequestStatus();

    return () => {
      isMounted = false;
    };
  }, [requestId]);

  const handleRequestTeam = () => {
    setShowConfirmation(true);
  };

  const handleCancelRequest = () => {
    setShowConfirmation(false);
  };

  const handleConfirmRequest = async () => {
    if (savingRequest) {
      return;
    }

    setSavingRequest(true);

    try {
      const storedRequests = await AsyncStorage.getItem(
        REQUEST_STORAGE_KEY
      );

      const parsed: unknown = storedRequests
        ? JSON.parse(storedRequests)
        : [];

      const requestedIds = Array.isArray(parsed)
        ? parsed.map(String)
        : [];

      if (!requestedIds.includes(requestId)) {
        requestedIds.push(requestId);

        await AsyncStorage.setItem(
          REQUEST_STORAGE_KEY,
          JSON.stringify(requestedIds)
        );
      }

      setShowConfirmation(false);
      setTeamRequested(true);

      Alert.alert(
        "Solicitação registrada",
        "A solicitação de manutenção foi salva neste dispositivo."
      );
    } catch {
      Alert.alert(
        "Não foi possível salvar",
        "A solicitação não foi registrada no dispositivo. Tente novamente."
      );
    } finally {
      setSavingRequest(false);
    }
  };

  // Exibe uma alternativa segura caso a área não seja encontrada.
  if (!occurrence && !alertData) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F4F7F5"
        />

        <Ionicons
          name="alert-circle-outline"
          size={42}
          color="#C0392B"
        />

        <Text style={styles.errorText}>
          Área não encontrada.
        </Text>

        <Text style={styles.errorDescription}>
          Não foi possível localizar os dados desta área.
        </Text>

        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.errorButtonText}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F4F7F5"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#193B2A"
            />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              Detalhes da vegetação
            </Text>

            <Text style={styles.headerSubtitle}>
              Monitoramento da área
            </Text>
          </View>
        </View>

        {/* Localização */}
        <View style={styles.locationCard}>
          <View style={styles.locationIcon}>
            <Ionicons
              name="navigate-outline"
              size={21}
              color="#176B43"
            />
          </View>

          <View style={styles.locationContent}>
            <Text style={styles.locationRegion}>
              {region}
            </Text>

            <Text style={styles.locationRoad}>
              {locationKm}
              {" • BR-381 • Fernão Dias"}
            </Text>
          </View>
        </View>

        {/* Imagem da vegetação */}
        <View style={styles.imageCard}>
          <Image
            source={getVegetationImage(heightRisk)}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Classificação do risco */}
        <View
          style={[
            styles.riskCard,
            { backgroundColor: riskColors.background },
          ]}
        >
          <View style={styles.riskIcon}>
            <Ionicons
              name={
                heightRisk === "Alto"
                  ? "warning-outline"
                  : heightRisk === "Médio"
                    ? "alert-circle-outline"
                    : "checkmark-circle-outline"
              }
              size={24}
              color={riskColors.icon}
            />
          </View>

          <View style={styles.riskContent}>
            <Text
              style={[
                styles.riskLabel,
                { color: riskColors.text },
              ]}
            >
              RISCO {heightRisk.toUpperCase()}
            </Text>

            <Text style={styles.riskTitle}>
              {getRiskTitle(heightRisk)}
            </Text>

            <Text style={styles.riskDescription}>
              {getRiskDescription(heightRisk)}
            </Text>
          </View>
        </View>

        {/* Indicadores */}
        <Text style={styles.sectionTitle}>
          Indicadores da vegetação
        </Text>

        <View style={styles.metricsContainer}>
          {/* Altura */}
          <View style={styles.metricCard}>
            <View
              style={[
                styles.metricIcon,
                styles.metricGreen,
              ]}
            >
              <Ionicons
                name="resize-outline"
                size={21}
                color="#176B43"
              />
            </View>

            <Text style={styles.metricLabel}>
              Altura
            </Text>

            <Text style={styles.metricValue}>
              {Number.isFinite(heightInCm)
                ? `${Math.round(heightInCm)} cm`
                : "—"}
            </Text>

            <Text style={styles.metricDescription}>
              Vegetação
            </Text>
          </View>

          {/* Tendência */}
          <View style={styles.metricCard}>
            <View
              style={[
                styles.metricIcon,
                {
                  backgroundColor:
                    growthTrend === "Alta"
                      ? "#FDEDEC"
                      : growthTrend === "Média"
                        ? "#FEF9E7"
                        : "#EAF6EF",
                },
              ]}
            >
              <Ionicons
                name="trending-up-outline"
                size={21}
                color={trendColor}
              />
            </View>

            <Text style={styles.metricLabel}>
              Tendência
            </Text>

            <Text
              style={[
                styles.metricValue,
                { color: trendColor },
              ]}
            >
              {growthTrend}
            </Text>

            <Text style={styles.metricDescription}>
              Crescimento
            </Text>
          </View>

          {/* Risco */}
          <View style={styles.metricCard}>
            <View
              style={[
                styles.metricIcon,
                { backgroundColor: riskColors.background },
              ]}
            >
              <Ionicons
                name="shield-outline"
                size={21}
                color={riskColors.icon}
              />
            </View>

            <Text style={styles.metricLabel}>
              Risco
            </Text>

            <Text
              style={[
                styles.metricValue,
                { color: riskColors.text },
              ]}
            >
              {heightRisk}
            </Text>

            <Text style={styles.metricDescription}>
              Classificação
            </Text>
          </View>
        </View>

        {/* Condições ambientais */}
        <Text style={styles.sectionTitle}>
          Condições ambientais
        </Text>

        <View style={styles.environmentCard}>
          <View style={styles.environmentItem}>
            <View
              style={[
                styles.environmentIcon,
                styles.temperatureIcon,
              ]}
            >
              <Ionicons
                name="thermometer-outline"
                size={20}
                color="#C0392B"
              />
            </View>

            <View style={styles.environmentTextContainer}>
              <Text style={styles.environmentLabel}>
                Temperatura
              </Text>

              <Text style={styles.environmentValue}>
                {Number.isFinite(temperature)
                  ? `${temperature}°C`
                  : "—"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.environmentItem}>
            <View
              style={[
                styles.environmentIcon,
                styles.humidityIcon,
              ]}
            >
              <Ionicons
                name="water-outline"
                size={20}
                color="#2471A3"
              />
            </View>

            <View style={styles.environmentTextContainer}>
              <Text style={styles.environmentLabel}>
                Umidade
              </Text>

              <Text style={styles.environmentValue}>
                {Number.isFinite(humidity)
                  ? `${humidity}%`
                  : "—"}
              </Text>
            </View>
          </View>
        </View>

        {/* Descrição da nova ocorrência */}
        {description.length > 0 && (
          <View style={styles.descriptionCard}>
            <View style={styles.descriptionHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#176B43"
              />

              <Text style={styles.descriptionTitle}>
                Descrição da ocorrência
              </Text>
            </View>

            <Text style={styles.descriptionText}>
              {description}
            </Text>

            {occurrence?.createdAt ? (
              <Text style={styles.createdAtText}>
                Registrada em{" "}
                {new Date(
                  occurrence.createdAt
                ).toLocaleString("pt-BR")}
              </Text>
            ) : null}
          </View>
        )}

        {/* Status operacional */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#607069"
            />

            <Text style={styles.statusTitle}>
              Status operacional
            </Text>
          </View>

          <Text style={styles.statusText}>
            {heightRisk === "Alto"
              ? "Área com vegetação acima do limite operacional. Recomenda-se solicitar uma equipe para avaliação e realização da poda."
              : heightRisk === "Médio"
                ? "Área em nível de alerta. Recomenda-se acompanhamento e programação de manutenção preventiva."
                : "Área dentro do nível controlado. Nenhuma intervenção imediata é indicada com base na altura registrada."}
          </Text>
        </View>

        {/* Solicitar equipe */}
        {heightRisk !== "Baixo" &&
          requestStatusLoaded &&
          !teamRequested &&
          !showConfirmation && (
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.85}
              onPress={handleRequestTeam}
            >
              <Ionicons
                name="construct-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.buttonText}>
                Solicitar equipe
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}

        {/* Confirmação da solicitação */}
        {requestStatusLoaded &&
          showConfirmation &&
          !teamRequested && (
            <View style={styles.confirmationCard}>
              <View style={styles.confirmationHeader}>
                <View style={styles.confirmationIcon}>
                  <Ionicons
                    name="help-circle-outline"
                    size={22}
                    color="#176B43"
                  />
                </View>

                <View style={styles.confirmationContent}>
                  <Text style={styles.confirmationTitle}>
                    Solicitar equipe?
                  </Text>

                  <Text style={styles.confirmationText}>
                    Deseja registrar uma solicitação de manutenção
                    para esta área?
                  </Text>
                </View>
              </View>

              <View style={styles.confirmationButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.85}
                  onPress={handleCancelRequest}
                  disabled={savingRequest}
                >
                  <Text style={styles.cancelButtonText}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    savingRequest && styles.disabledButton,
                  ]}
                  activeOpacity={0.85}
                  onPress={handleConfirmRequest}
                  disabled={savingRequest}
                >
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text style={styles.confirmButtonText}>
                    {savingRequest ? "Salvando..." : "Confirmar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        {/* Solicitação registrada */}
        {requestStatusLoaded &&
          teamRequested &&
          heightRisk !== "Baixo" && (
            <View style={styles.successCard}>
              <View style={styles.successIcon}>
                <Ionicons
                  name="checkmark"
                  size={21}
                  color="#176B43"
                />
              </View>

              <View style={styles.successContent}>
                <Text style={styles.successTitle}>
                  Equipe solicitada
                </Text>

                <Text style={styles.successText}>
                  A solicitação de manutenção foi registrada para
                  esta área neste dispositivo.
                </Text>
              </View>
            </View>
          )}

        {/* Área controlada */}
        {heightRisk === "Baixo" && (
          <View style={styles.controlledCard}>
            <View style={styles.controlledIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#176B43"
              />
            </View>

            <View style={styles.controlledContent}>
              <Text style={styles.controlledTitle}>
                Área controlada
              </Text>

              <Text style={styles.controlledText}>
                A altura registrada está dentro do limite
                considerado controlado.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F5",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 35,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#F4F7F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    marginTop: 10,
    fontSize: 17,
    color: "#26352D",
    fontWeight: "700",
  },
  errorDescription: {
    marginTop: 8,
    fontSize: 13,
    color: "#718078",
    textAlign: "center",
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: "#176B43",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#EAF3ED",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#193B2A",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#7B8580",
    marginTop: 3,
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#193B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  locationIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EAF6EF",
    justifyContent: "center",
    alignItems: "center",
  },
  locationContent: {
    flex: 1,
    marginLeft: 12,
  },
  locationRegion: {
    fontSize: 15,
    fontWeight: "700",
    color: "#26352D",
  },
  locationRoad: {
    fontSize: 11,
    color: "#7B8580",
    marginTop: 4,
  },
  imageCard: {
    width: "100%",
    height: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#193B2A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  riskCard: {
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  riskIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  riskContent: {
    flex: 1,
    marginLeft: 12,
  },
  riskLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  riskTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#26352D",
    marginTop: 3,
  },
  riskDescription: {
    fontSize: 11,
    color: "#718078",
    marginTop: 3,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#26352D",
    marginBottom: 12,
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 12,
    minHeight: 125,
    shadowColor: "#193B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  metricGreen: {
    backgroundColor: "#EAF6EF",
  },
  metricLabel: {
    fontSize: 10,
    color: "#7B8580",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#26352D",
    marginTop: 3,
  },
  metricDescription: {
    fontSize: 9,
    color: "#9AA39E",
    marginTop: 3,
  },
  environmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#193B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  environmentItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  environmentTextContainer: {
    flexShrink: 1,
  },
  environmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  temperatureIcon: {
    backgroundColor: "#FDEDEC",
  },
  humidityIcon: {
    backgroundColor: "#EBF5FB",
  },
  environmentLabel: {
    fontSize: 10,
    color: "#7B8580",
  },
  environmentValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#26352D",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#E8ECE9",
    marginHorizontal: 10,
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#193B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  descriptionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#176B43",
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: "#526159",
    lineHeight: 20,
  },
  createdAtText: {
    marginTop: 12,
    fontSize: 10,
    color: "#8B9690",
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 18,
    shadowColor: "#193B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#435049",
    marginLeft: 7,
  },
  statusText: {
    fontSize: 12,
    color: "#718078",
    lineHeight: 18,
  },
  button: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#176B43",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    shadowColor: "#176B43",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginHorizontal: 10,
  },
  confirmationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 2,
    shadowColor: "#193B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  confirmationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  confirmationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EAF6EF",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmationContent: {
    flex: 1,
    marginLeft: 10,
  },
  confirmationTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#26352D",
  },
  confirmationText: {
    fontSize: 12,
    color: "#718078",
    lineHeight: 18,
    marginTop: 4,
  },
  confirmationButtons: {
    flexDirection: "row",
    marginTop: 18,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 11,
    backgroundColor: "#F0F3F1",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#526159",
  },
  confirmButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 11,
    backgroundColor: "#176B43",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.6,
  },
  successCard: {
    backgroundColor: "#EAF6EF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  successIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  successContent: {
    flex: 1,
    marginLeft: 11,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#176B43",
  },
  successText: {
    fontSize: 11,
    color: "#526159",
    lineHeight: 16,
    marginTop: 3,
  },
  controlledCard: {
    backgroundColor: "#EAF6EF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  controlledIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  controlledContent: {
    flex: 1,
    marginLeft: 11,
  },
  controlledTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#176B43",
  },
  controlledText: {
    fontSize: 11,
    color: "#526159",
    lineHeight: 16,
    marginTop: 3,
  },
});