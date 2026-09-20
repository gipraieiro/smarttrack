import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { alerts } from "../data/mockData";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Alerts"
>;

export default function AlertsScreen() {
  const navigation = useNavigation<NavigationProp>();

  /*
   * =====================================================
   * DEFINIÇÃO DO RISCO PELA ALTURA DA VEGETAÇÃO
   * =====================================================
   *
   * 30 cm ou mais  -> Alto
   * 15 a 29 cm     -> Médio
   * abaixo de 15cm -> Baixo
   */

  const getRiskByHeight = (height: number) => {
    const heightInCm = height * 100;

    if (heightInCm >= 30) {
      return "Alto";
    }

    if (heightInCm >= 15) {
      return "Médio";
    }

    return "Baixo";
  };

  /*
   * =====================================================
   * CONFIGURAÇÃO VISUAL DE CADA RISCO
   * =====================================================
   */

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

  /*
   * =====================================================
   * ORDENAÇÃO
   * =====================================================
   *
   * Primeiro aparecem as áreas de maior risco.
   */

  const sortedAlerts = [...alerts].sort((a, b) => {
    const priority = {
      Alto: 1,
      Médio: 2,
      Baixo: 3,
    };

    return priority[a.risk] - priority[b.risk];
  });

  /*
   * =====================================================
   * CARD DE MONITORAMENTO
   * =====================================================
   */

  const renderItem = ({
    item,
  }: {
    item: (typeof alerts)[number];
  }) => {
    /*
     * A altura está armazenada em metros no mockData.
     * Aqui ela é convertida para centímetros.
     */

    const heightInCm = Math.round(item.height * 100);

    /*
     * O risco visual é determinado pela altura.
     */

    const calculatedRisk = getRiskByHeight(item.height);

    const config = getRiskConfig(calculatedRisk);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={() =>
          navigation.navigate("Details", {
            alertId: item.id,
          })
        }
      >
        {/* =================================================
            CABEÇALHO DO CARD
        ================================================= */}

        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor: config.iconBackground,
              },
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
                {
                  color: config.riskColor,
                },
              ]}
            >
              {config.label}
            </Text>

            <Text style={styles.region}>
              {item.region}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#A1AAA5"
          />
        </View>

        {/* =================================================
            LOCALIZAÇÃO
        ================================================= */}

        <View style={styles.locationRow}>
          <Ionicons
            name="navigate-outline"
            size={16}
            color="#607D6B"
          />

          <Text style={styles.km}>
            {item.km}
          </Text>

          <View style={styles.separator} />

          <Text style={styles.road}>
            BR-381 • Fernão Dias
          </Text>
        </View>

        {/* =================================================
            STATUS
        ================================================= */}

        <Text style={styles.status}>
          {config.action}
        </Text>

        {/* =================================================
            INDICADORES
        ================================================= */}

        <View style={styles.indicatorsRow}>
          {/* ALTURA */}

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
              <Text style={styles.indicatorLabel}>
                Altura
              </Text>

              <Text style={styles.indicatorValue}>
                {heightInCm} cm
              </Text>
            </View>
          </View>

          {/* TENDÊNCIA */}

          <View style={styles.indicator}>
            <View
              style={[
                styles.indicatorIcon,
                calculatedRisk === "Alto"
                  ? styles.redIndicator
                  : calculatedRisk === "Médio"
                  ? styles.yellowIndicator
                  : styles.greenIndicator,
              ]}
            >
              <Ionicons
                name="trending-up-outline"
                size={17}
                color={
                  calculatedRisk === "Alto"
                    ? "#C0392B"
                    : calculatedRisk === "Médio"
                    ? "#B8860B"
                    : "#176B43"
                }
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

          {/* RISCO */}

          <View style={styles.indicator}>
            <View
              style={[
                styles.indicatorIcon,
                {
                  backgroundColor:
                    config.iconBackground,
                },
              ]}
            >
              <Ionicons
                name="shield-outline"
                size={17}
                color={config.riskColor}
              />
            </View>

            <View>
              <Text style={styles.indicatorLabel}>
                Risco
              </Text>

              <Text
                style={[
                  styles.indicatorValue,
                  {
                    color: config.riskColor,
                  },
                ]}
              >
                {calculatedRisk}
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            DETALHES
        ================================================= */}

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
    );
  };

  return (
    <View style={styles.container}>
      {/* =================================================
          HEADER
      ================================================= */}

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
          <Text style={styles.title}>
            Alertas
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#176B43"
          />
        </View>
      </View>

      {/* =================================================
          CABEÇALHO DA LISTA
      ================================================= */}

      <View style={styles.listHeader}>
        <View>
          <View style={styles.listTitleRow}>
            <Text style={styles.listTitle}>
              Pontos monitorados
            </Text>

            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {alerts.length}
              </Text>
            </View>
          </View>

          <Text style={styles.listSubtitle}>
            Áreas organizadas por nível de risco
          </Text>
        </View>
      </View>

      {/* =================================================
          LISTA
      ================================================= */}

      <FlatList
        data={sortedAlerts}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

/*
 * =========================================================
 * ESTILOS
 * =========================================================
 */

const styles = StyleSheet.create({
  /* =====================================================
     CONTAINER
  ===================================================== */

  container: {
    flex: 1,
    backgroundColor: "#F4F7F5",
  },

  /* =====================================================
     HEADER
  ===================================================== */

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

  /* =====================================================
     CABEÇALHO DA LISTA
  ===================================================== */

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

  /* =====================================================
     LISTA
  ===================================================== */

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  /* =====================================================
     CARD
  ===================================================== */

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

  /* =====================================================
     CABEÇALHO DO CARD
  ===================================================== */

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

  /* =====================================================
     LOCALIZAÇÃO
  ===================================================== */

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

  /* =====================================================
     STATUS
  ===================================================== */

  status: {
    fontSize: 11,
    color: "#718078",
    marginTop: 10,
  },

  /* =====================================================
     INDICADORES
  ===================================================== */

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

  /* =====================================================
     DETALHES
  ===================================================== */

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
});