import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useRoute, useNavigation } from "@react-navigation/native";

import { alerts } from "../data/mockData";

export default function VegetationDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [teamRequested, setTeamRequested] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { alertId } = route.params;

  const alertData = alerts.find(
    (item) => item.id === alertId
  );

  if (!alertData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={40}
          color="#C0392B"
        />

        <Text style={styles.errorText}>
          Área não encontrada.
        </Text>
      </View>
    );
  }

  /*
   * ============================
   * CLASSIFICAÇÃO DA VEGETAÇÃO
   * ============================
   *
   * 30 cm ou mais → Alto
   * 15 cm até abaixo de 30 cm → Médio
   * Abaixo de 15 cm → Baixo
   */

  const getRiskByHeight = () => {
    if (alertData.height >= 0.30) {
      return "Alto";
    }

    if (alertData.height >= 0.15) {
      return "Médio";
    }

    return "Baixo";
  };

  const heightRisk = getRiskByHeight();

  /*
   * ============================
   * CORES DO RISCO
   * ============================
   */

  const getRiskColors = () => {
    switch (heightRisk) {
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

  const riskColors = getRiskColors();

  /*
   * ============================
   * IMAGEM DA VEGETAÇÃO
   * ============================
   */

  const getVegetationImage = () => {
    switch (heightRisk) {
      case "Alto":
        return require("../../assets/images/vegetacao-alta.png");

      case "Médio":
        return require("../../assets/images/vegetacao-media.png");

      default:
        return require("../../assets/images/vegetacao-baixa.png");
    }
  };

  /*
   * ============================
   * TEXTOS
   * ============================
   */

  const getRiskTitle = () => {
    switch (heightRisk) {
      case "Alto":
        return "Vegetação necessita poda";

      case "Médio":
        return "Vegetação em nível de alerta";

      default:
        return "Vegetação controlada";
    }
  };

  const getRiskDescription = () => {
    switch (heightRisk) {
      case "Alto":
        return "A altura da vegetação indica necessidade de intervenção.";

      case "Médio":
        return "A vegetação requer acompanhamento e manutenção preventiva.";

      default:
        return "A vegetação está dentro do nível considerado controlado.";
    }
  };

  const getTrendColor = () => {
    switch (alertData.growthTrend) {
      case "Alta":
        return "#C0392B";

      case "Média":
        return "#B8860B";

      default:
        return "#176B43";
    }
  };

  /*
   * ============================
   * SOLICITAR EQUIPE
   * ============================
   */

  const handleRequestTeam = () => {
    setShowConfirmation(true);
  };

  const handleCancelRequest = () => {
    setShowConfirmation(false);
  };

  const handleConfirmRequest = () => {
    setShowConfirmation(false);
    setTeamRequested(true);
  };

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

        {/* ============================
            HEADER
        ============================ */}

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

        {/* ============================
            LOCALIZAÇÃO
        ============================ */}

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
              {alertData.region}
            </Text>

            <Text style={styles.locationRoad}>
              {alertData.km} • BR-381 • Fernão Dias
            </Text>
          </View>

        </View>

        {/* ============================
            IMAGEM
        ============================ */}

        <View style={styles.imageCard}>
          <Image
            source={getVegetationImage()}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* ============================
            STATUS DO RISCO
        ============================ */}

        <View
          style={[
            styles.riskCard,
            {
              backgroundColor: riskColors.background,
            },
          ]}
        >

          <View
            style={[
              styles.riskIcon,
              {
                backgroundColor: "#FFFFFF",
              },
            ]}
          >
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
                {
                  color: riskColors.text,
                },
              ]}
            >
              RISCO {heightRisk.toUpperCase()}
            </Text>

            <Text style={styles.riskTitle}>
              {getRiskTitle()}
            </Text>

            <Text style={styles.riskDescription}>
              {getRiskDescription()}
            </Text>
          </View>

        </View>

        {/* ============================
            INDICADORES
        ============================ */}

        <Text style={styles.sectionTitle}>
          Indicadores da vegetação
        </Text>

        <View style={styles.metricsContainer}>

          {/* ALTURA */}

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
              {Math.round(alertData.height * 100)} cm
            </Text>

            <Text style={styles.metricDescription}>
              Vegetação
            </Text>

          </View>

          {/* TENDÊNCIA */}

          <View style={styles.metricCard}>

            <View
              style={[
                styles.metricIcon,
                {
                  backgroundColor:
                    alertData.growthTrend === "Alta"
                      ? "#FDEDEC"
                      : alertData.growthTrend === "Média"
                      ? "#FEF9E7"
                      : "#EAF6EF",
                },
              ]}
            >
              <Ionicons
                name="trending-up-outline"
                size={21}
                color={getTrendColor()}
              />
            </View>

            <Text style={styles.metricLabel}>
              Tendência
            </Text>

            <Text
              style={[
                styles.metricValue,
                {
                  color: getTrendColor(),
                },
              ]}
            >
              {alertData.growthTrend}
            </Text>

            <Text style={styles.metricDescription}>
              Crescimento
            </Text>

          </View>

          {/* RISCO */}

          <View style={styles.metricCard}>

            <View
              style={[
                styles.metricIcon,
                {
                  backgroundColor:
                    riskColors.background,
                },
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
                {
                  color: riskColors.text,
                },
              ]}
            >
              {heightRisk}
            </Text>

            <Text style={styles.metricDescription}>
              Classificação
            </Text>

          </View>

        </View>

        {/* ============================
            DADOS AMBIENTAIS
        ============================ */}

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

            <View>
              <Text style={styles.environmentLabel}>
                Temperatura
              </Text>

              <Text style={styles.environmentValue}>
                {alertData.temperature}°C
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

            <View>
              <Text style={styles.environmentLabel}>
                Umidade
              </Text>

              <Text style={styles.environmentValue}>
                {alertData.humidity}%
              </Text>
            </View>

          </View>

        </View>

        {/* ============================
            STATUS OPERACIONAL
        ============================ */}

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
              ? "Área com vegetação acima do limite operacional. Recomenda-se solicitar equipe para realização da poda."
              : heightRisk === "Médio"
              ? "Área em nível de alerta. Recomenda-se acompanhamento e programação de manutenção preventiva."
              : "Área dentro do nível controlado. Nenhuma intervenção imediata necessária."}
          </Text>

        </View>

        {/* ============================
            AÇÃO
        ============================ */}

        {heightRisk !== "Baixo" &&
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

        {/* ============================
            CONFIRMAÇÃO DA SOLICITAÇÃO
        ============================ */}

        {showConfirmation && !teamRequested && (
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
                  Deseja registrar uma solicitação de manutenção para esta área?
                </Text>
              </View>

            </View>

            <View style={styles.confirmationButtons}>

              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.85}
                onPress={handleCancelRequest}
              >
                <Text style={styles.cancelButtonText}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                activeOpacity={0.85}
                onPress={handleConfirmRequest}
              >
                <Ionicons
                  name="checkmark"
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.confirmButtonText}>
                  Confirmar
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        )}

        {/* ============================
            CONFIRMAÇÃO
        ============================ */}

        {teamRequested && (
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
                A solicitação de manutenção foi registrada para esta área.
              </Text>
            </View>

          </View>
        )}

        {/* ============================
            ÁREA CONTROLADA
        ============================ */}

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
                A vegetação está dentro do limite operacional.
              </Text>
            </View>

          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  /* ============================
     CONTAINER
  ============================ */

  container: {
    flex: 1,
    backgroundColor: "#F4F7F5",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 35,
  },

  /* ============================
     ERRO
  ============================ */

  errorContainer: {
    flex: 1,
    backgroundColor: "#F4F7F5",
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#26352D",
    fontWeight: "600",
  },

  /* ============================
     HEADER
  ============================ */

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

  /* ============================
     LOCALIZAÇÃO
  ============================ */

  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,

    shadowColor: "#193B2A",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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

  /* ============================
     IMAGEM
  ============================ */

  imageCard: {
    width: "100%",
    height: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 15,

    shadowColor: "#193B2A",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,

    elevation: 2,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  /* ============================
     RISCO
  ============================ */

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

  /* ============================
     SEÇÕES
  ============================ */

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#26352D",
    marginBottom: 12,
  },

  /* ============================
     MÉTRICAS
  ============================ */

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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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

  /* ============================
     AMBIENTE
  ============================ */

  environmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,

    shadowColor: "#193B2A",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  environmentItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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

  /* ============================
     STATUS
  ============================ */

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 18,

    shadowColor: "#193B2A",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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

  /* ============================
     BOTÃO
  ============================ */

  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#176B43",
    borderRadius: 13,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#176B43",
    shadowOffset: {
      width: 0,
      height: 4,
    },
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

  /* ============================
     CONFIRMAÇÃO
  ============================ */

  confirmationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 2,

    shadowColor: "#193B2A",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

    elevation: 2,
  },

  confirmationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  confirmationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EAF6EF",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmationContent: {
    flex: 1,
    marginLeft: 10,
  },

  confirmationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#26352D",
  },

  confirmationText: {
    fontSize: 11,
    color: "#718078",
    marginTop: 3,
    lineHeight: 16,
  },

  confirmationButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 11,
    backgroundColor: "#F1F4F2",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#607069",
  },

  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 11,
    backgroundColor: "#176B43",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 6,
  },

  /* ============================
     SUCESSO
  ============================ */

  successCard: {
    backgroundColor: "#EAF6EF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  successIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  successContent: {
    flex: 1,
    marginLeft: 10,
  },

  successTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#176B43",
  },

  successText: {
    fontSize: 11,
    color: "#607069",
    marginTop: 3,
    lineHeight: 16,
  },

  /* ============================
     ÁREA CONTROLADA
  ============================ */

  controlledCard: {
    backgroundColor: "#EAF6EF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  controlledIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  controlledContent: {
    flex: 1,
    marginLeft: 10,
  },

  controlledTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#176B43",
  },

  controlledText: {
    fontSize: 11,
    color: "#607069",
    marginTop: 3,
  },

  /* ============================
     ATUALIZAÇÃO
  ============================ */

  updateInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  updateText: {
    fontSize: 10,
    color: "#8A958F",
    marginLeft: 5,
  },

});