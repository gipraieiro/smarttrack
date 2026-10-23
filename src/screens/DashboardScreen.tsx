
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { alerts } from "../data/mockData";
import type {
  RootStackParamList,
  NewOccurrence,
} from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

const STORAGE_KEY = "@smarttrack/new-occurrences";

type DashboardArea = {
  heightInCm: number;
  risk: NewOccurrence["risk"];
  growthTrend: string;
};

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [mapVisible, setMapVisible] = useState(false);
  const [newOccurrences, setNewOccurrences] = useState<NewOccurrence[]>([]);

  // Classificação de risco padronizada com as demais telas.
  const getRiskByHeight = (
    heightInCm: number
  ): NewOccurrence["risk"] => {
    if (heightInCm >= 30) return "Alto";
    if (heightInCm >= 15) return "Médio";
    return "Baixo";
  };

  // Atualiza as ocorrências sempre que o Dashboard recebe foco.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadOccurrences() {
        try {
          const stored = await AsyncStorage.getItem(STORAGE_KEY);

          if (!stored) {
            if (isActive) setNewOccurrences([]);
            return;
          }

          const parsed: unknown = JSON.parse(stored);

          if (!Array.isArray(parsed)) {
            if (isActive) setNewOccurrences([]);
            return;
          }

          const validOccurrences = parsed.filter(
            (item): item is NewOccurrence =>
              item !== null &&
              typeof item === "object" &&
              typeof item.id === "number" &&
              Number.isFinite(item.id) &&
              typeof item.height === "number" &&
              Number.isFinite(item.height) &&
              item.height > 0 &&
              typeof item.location === "string" &&
              typeof item.temperature === "number" &&
              typeof item.humidity === "number" &&
              typeof item.description === "string"
          );

          if (isActive) {
            setNewOccurrences(validOccurrences);
          }
        } catch (error) {
          console.error(
            "Erro ao carregar ocorrências no Dashboard:",
            error
          );

          if (isActive) setNewOccurrences([]);
        }
      }

      loadOccurrences();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Os pontos fixos usam altura em metros no mockData.
  const fixedAreas: DashboardArea[] = alerts.map((item) => {
    const heightInCm = Number(item.height) * 100;

    return {
      heightInCm,
      risk: getRiskByHeight(heightInCm),
      growthTrend: item.growthTrend,
    };
  });

  // As ocorrências cadastradas já têm altura em centímetros.
  const registeredAreas: DashboardArea[] = newOccurrences.map((item) => ({
    heightInCm: item.height,
    risk: getRiskByHeight(item.height),
    growthTrend:
      item.risk === "Alto"
        ? "Alta"
        : item.risk === "Médio"
        ? "Média"
        : "Baixa",
  }));

  // Consolida os pontos fixos e os registros cadastrados.
  const allAreas = [...fixedAreas, ...registeredAreas];

  const criticalAreas = allAreas.filter(
    (item) => item.risk === "Alto"
  ).length;

  const alertAreas = allAreas.filter(
    (item) => item.risk === "Médio"
  ).length;

  const monitoredAreas = allAreas.filter(
    (item) => item.risk === "Baixo"
  ).length;

  // Média de altura em centímetros, considerando todos os pontos.
  const averageHeight =
    allAreas.length > 0
      ? allAreas.reduce(
          (total, item) => total + item.heightInCm,
          0
        ) / allAreas.length
      : 0;

  const highGrowthAreas = allAreas.filter(
    (item) => item.growthTrend === "Alta"
  ).length;

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
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, Marcelo</Text>
            <Text style={styles.headerSubtitle}>
              Supervisor operacional
            </Text>
          </View>

          <View style={styles.profileIcon}>
            <Ionicons
              name="person-outline"
              size={22}
              color="#176B43"
            />
          </View>
        </View>

        {/* TÍTULO */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Monitoramento</Text>

          <View style={styles.roadInfo}>
            <Ionicons
              name="navigate-outline"
              size={16}
              color="#176B43"
            />
            <Text style={styles.roadText}>
              BR-381 • Fernão Dias
            </Text>
          </View>
        </View>

        {/* RESUMO DA OPERAÇÃO */}
        <Text style={styles.sectionTitle}>
          Resumo da operação
        </Text>

        <View style={styles.cardsContainer}>
          {/* ÁREAS CRÍTICAS */}
          <View style={styles.card}>
            <View style={[styles.cardIcon, styles.cardIconRed]}>
              <Ionicons
                name="warning-outline"
                size={20}
                color="#C0392B"
              />
            </View>

            <Text style={styles.cardValue}>{criticalAreas}</Text>
            <Text style={styles.cardTitle}>Áreas críticas</Text>
            <Text style={styles.cardDescription}>
              Intervenção urgente
            </Text>
          </View>

          {/* ÁREAS EM ALERTA */}
          <View style={styles.card}>
            <View style={[styles.cardIcon, styles.cardIconYellow]}>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#B8860B"
              />
            </View>

            <Text style={styles.cardValue}>{alertAreas}</Text>
            <Text style={styles.cardTitle}>Em alerta</Text>
            <Text style={styles.cardDescription}>
              Requer acompanhamento
            </Text>
          </View>

          {/* ÁREAS MONITORADAS */}
          <View style={styles.card}>
            <View style={[styles.cardIcon, styles.cardIconGreen]}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#176B43"
              />
            </View>

            <Text style={styles.cardValue}>{monitoredAreas}</Text>
            <Text style={styles.cardTitle}>Monitoradas</Text>
            <Text style={styles.cardDescription}>
              Sem intervenção
            </Text>
          </View>
        </View>

        {/* MAPA */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Mapa de monitoramento
            </Text>
            <Text style={styles.sectionSubtitle}>
              Pontos monitorados ao longo da Fernão Dias
            </Text>
          </View>

          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>MONITORAMENTO</Text>
          </View>
        </View>

        {/* MAPA CLICÁVEL */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setMapVisible(true)}
          style={styles.mapCard}
          accessibilityRole="button"
          accessibilityLabel="Ampliar mapa de monitoramento"
        >
          <Image
            source={require("../../assets/images/mapa-fernaodias.png")}
            style={styles.map}
            resizeMode="cover"
          />

          <View style={styles.expandIcon}>
            <Ionicons
              name="expand-outline"
              size={20}
              color="#26352D"
            />
          </View>
        </TouchableOpacity>

        {/* MAPA AMPLIADO */}
        <Modal
          visible={mapVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setMapVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.8}
              onPress={() => setMapVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Fechar mapa ampliado"
            >
              <Ionicons
                name="close"
                size={26}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Image
              source={require("../../assets/images/mapa-fernaodias.png")}
              style={styles.fullMap}
              resizeMode="contain"
            />
          </View>
        </Modal>

        {/* INDICADORES OPERACIONAIS */}
        <Text style={styles.sectionTitle}>
          Indicadores operacionais
        </Text>

        <View style={styles.indicatorsContainer}>
          {/* ALTURA MÉDIA */}
          <View style={styles.indicatorCard}>
            <View
              style={[
                styles.indicatorIcon,
                styles.indicatorGreen,
              ]}
            >
              <Ionicons
                name="resize-outline"
                size={21}
                color="#176B43"
              />
            </View>

            <View style={styles.indicatorContent}>
              <Text style={styles.indicatorLabel}>
                Altura média
              </Text>

              <Text style={styles.indicatorValue}>
                {Math.round(averageHeight)} cm
              </Text>

              <Text style={styles.indicatorSubtext}>
                Vegetação monitorada
              </Text>
            </View>
          </View>

          {/* TENDÊNCIA DE CRESCIMENTO */}
          <View style={styles.indicatorCard}>
            <View
              style={[
                styles.indicatorIcon,
                styles.indicatorYellow,
              ]}
            >
              <Ionicons
                name="trending-up-outline"
                size={21}
                color="#B8860B"
              />
            </View>

            <View style={styles.indicatorContent}>
              <Text style={styles.indicatorLabel}>
                Crescimento
              </Text>

              <Text style={styles.indicatorValue}>
                {highGrowthAreas} ponto(s)
              </Text>

              <Text style={styles.indicatorSubtext}>
                Com tendência alta
              </Text>
            </View>
          </View>
        </View>

        {/* BOTÃO DE MONITORAMENTO */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Alerts")}
          accessibilityRole="button"
        >
          <View style={styles.buttonIcon}>
            <Ionicons
              name="list-outline"
              size={20}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.buttonText}>
            Ver monitoramento
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* ÚLTIMA ATUALIZAÇÃO */}
        <View style={styles.updateInfo}>
          <Ionicons
            name="time-outline"
            size={14}
            color="#8A958F"
          />
          <Text style={styles.updateText}>
            Indicadores atualizados ao abrir esta tela
          </Text>
        </View>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#193B2A",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#718078",
    marginTop: 4,
  },

  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#E8F3EC",
    justifyContent: "center",
    alignItems: "center",
  },

  titleSection: {
    marginBottom: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#193B2A",
  },

  roadInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  roadText: {
    fontSize: 14,
    color: "#607069",
    marginLeft: 6,
    fontWeight: "500",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#26352D",
    marginBottom: 12,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#7B8580",
    marginTop: -7,
    marginBottom: 12,
  },

  cardsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 27,
  },

  card: {
    flex: 1,
    minHeight: 142,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 13,
    shadowColor: "#193B2A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 2,
  },

  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  cardIconRed: {
    backgroundColor: "#FDEDEC",
  },

  cardIconYellow: {
    backgroundColor: "#FEF9E7",
  },

  cardIconGreen: {
    backgroundColor: "#EAF6EF",
  },

  cardValue: {
    fontSize: 27,
    fontWeight: "700",
    color: "#26352D",
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#435049",
    marginTop: 1,
  },

  cardDescription: {
    fontSize: 9,
    color: "#8A958F",
    marginTop: 4,
    lineHeight: 13,
  },

  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF6EF",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 12,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#27AE60",
    marginRight: 5,
  },

  liveText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#176B43",
  },

  mapCard: {
    width: "100%",
    height: 365,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 27,
    shadowColor: "#193B2A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  expandIcon: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.94)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#193B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullMap: {
    width: "100%",
    height: "80%",
  },

  closeButton: {
    position: "absolute",
    top: 55,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  indicatorsContainer: {
    gap: 11,
    marginBottom: 27,
  },

  indicatorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#193B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  indicatorIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  indicatorGreen: {
    backgroundColor: "#EAF6EF",
  },

  indicatorYellow: {
    backgroundColor: "#FEF9E7",
  },

  indicatorContent: {
    flex: 1,
    marginLeft: 13,
  },

  indicatorLabel: {
    fontSize: 12,
    color: "#7B8580",
    fontWeight: "500",
  },

  indicatorValue: {
    fontSize: 20,
    color: "#26352D",
    fontWeight: "700",
    marginTop: 3,
  },

  indicatorSubtext: {
    fontSize: 10,
    color: "#9AA39E",
    marginTop: 3,
  },

  button: {
    width: "100%",
    height: 57,
    backgroundColor: "#176B43",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#176B43",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },

  buttonIcon: {
    marginRight: 9,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginRight: 10,
  },

  updateInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  updateText: {
    fontSize: 10,
    color: "#8A958F",
    marginLeft: 5,
  },
});