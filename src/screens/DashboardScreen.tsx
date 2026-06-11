import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import { alerts } from "../data/mockData";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();

  const criticalAreas = alerts.filter(
    (item) => item.risk === "Alto"
  ).length;

  const alertAreas = alerts.filter(
    (item) => item.risk === "Médio"
  ).length;

  const monitoredAreas = alerts.filter(
    (item) => item.risk === "Baixo"
  ).length;

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        SMART<Text style={styles.green}>TRACK</Text>
      </Text>

      <Text style={styles.welcome}>
        Olá, Marcelo!
      </Text>

      <Text style={styles.subtitle}>
        Monitoramento em tempo real
      </Text>

      <View style={styles.cardsContainer}>
        <View style={[styles.card, styles.redCard]}>
          <Text style={styles.cardTitle}>
            Área Crítica
          </Text>

          <Text style={styles.cardValue}>
            {criticalAreas}
          </Text>
        </View>

        <View style={[styles.card, styles.yellowCard]}>
          <Text style={styles.cardTitleDark}>
            Área em Alerta
          </Text>

          <Text style={styles.cardValueDark}>
            {alertAreas}
          </Text>
        </View>

        <View style={[styles.card, styles.greenCard]}>
          <Text style={styles.cardTitle}>
            Áreas Monitoradas
          </Text>

          <Text style={styles.cardValue}>
            {monitoredAreas}
          </Text>
        </View>
      </View>

      <Image
        source={require("../../assets/images/mapa.png")}
        style={styles.map}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Alerts")}
      >
        <Text style={styles.buttonText}>
          Ver monitoramento
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6DBDF",
    alignItems: "center",
    paddingTop: 85,
  },

  logo: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 25,
  },

  green: {
    color: "#27AE60",
  },

  welcome: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E5631",
  },

  subtitle: {
    fontSize: 17,
    color: "#566573",
    marginTop: 5,
    marginBottom: 28,
  },

  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "92%",
    marginBottom: 25,
  },

  card: {
    width: 108,
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  redCard: {
    backgroundColor: "#E74C3C",
  },

  yellowCard: {
    backgroundColor: "#F4D03F",
  },

  greenCard: {
    backgroundColor: "#27AE60",
  },

  cardTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },

  cardTitleDark: {
    color: "#2C3E50",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },

  cardValue: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 6,
  },

  cardValueDark: {
    color: "#2C3E50",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 6,
  },

  map: {
    width: 340,
    height: 340,
    marginBottom: 20,
  },

  button: {
    width: 280,
    height: 60,
    backgroundColor: "#27AE60",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});