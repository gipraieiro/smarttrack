import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

import { alerts } from "../data/mockData";

export default function VegetationDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [teamRequested, setTeamRequested] = useState(false);

  const { alertId } = route.params;

  const alertData = alerts.find(
    (item) => item.id === alertId
  );

  if (!alertData) {
    return (
      <View style={styles.container}>
        <Text>Alerta não encontrado.</Text>
      </View>
    );
  }

  const getVegetationImage = () => {
    switch (alertData.risk) {
      case "Alto":
        return require("../../assets/images/vegetacao-alta.png");

      case "Médio":
        return require("../../assets/images/vegetacao-media.png");

      default:
        return require("../../assets/images/vegetacao-baixa.png");
    }
  };

  const handleRequestTeam = () => {
    setTeamRequested(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButton}>
          ← Voltar
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Detalhes da Vegetação
      </Text>

      <Image
        source={getVegetationImage()}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <MaterialIcons
            name="location-on"
            size={24}
            color="#1E5631"
          />
          <Text style={styles.infoText}>
            {alertData.km}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons
            name="warning"
            size={24}
            color="#E67E22"
          />
          <Text style={styles.infoText}>
            Risco: {alertData.risk}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons
            name="device-thermostat"
            size={24}
            color="#E74C3C"
          />
          <Text style={styles.infoText}>
            Temperatura: {alertData.temperature}°C
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons
            name="water-drop"
            size={24}
            color="#3498DB"
          />
          <Text style={styles.infoText}>
            Umidade: {alertData.humidity}%
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons
            name="description"
            size={24}
            color="#566573"
          />
          <Text style={styles.infoText}>
            Status
          </Text>
        </View>

        <Text style={styles.status}>
          {alertData.status}
        </Text>
      </View>

      {alertData.risk !== "Baixo" && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={handleRequestTeam}
          >
            <Text style={styles.buttonText}>
              Solicitar Equipe
            </Text>
          </TouchableOpacity>

          {teamRequested && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                Equipe de manutenção acionada com sucesso!
              </Text>
            </View>
          )}
        </>
      )}

      {alertData.risk === "Baixo" && (
        <View style={styles.monitorBox}>
          <Text style={styles.monitorText}>
            Nenhuma intervenção necessária.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#D6DBDF",
    padding: 20,
    paddingTop: 60,
  },

  backButton: {
    color: "#1E5631",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E5631",
    marginBottom: 20,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  infoText: {
    marginLeft: 10,
    fontSize: 17,
    color: "#2C3E50",
    flex: 1,
  },

  status: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E5631",
  },

  button: {
    backgroundColor: "#27AE60",
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  successBox: {
    marginTop: 15,
    backgroundColor: "#D5F5E3",
    borderColor: "#27AE60",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },

  successText: {
    color: "#1E5631",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  monitorBox: {
    marginTop: 15,
    backgroundColor: "#D5F5E3",
    borderColor: "#27AE60",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },

  monitorText: {
    color: "#1E5631",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});