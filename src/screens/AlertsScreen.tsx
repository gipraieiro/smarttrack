import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

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

  const getIcon = (risk: string) => {
    switch (risk) {
      case "Alto":
        return (
          <MaterialIcons
            name="warning"
            size={30}
            color="#FFF"
          />
        );

      case "Médio":
        return (
          <MaterialIcons
            name="report-problem"
            size={30}
            color="#2C3E50"
          />
        );

      default:
        return (
          <MaterialIcons
            name="check-circle"
            size={30}
            color="#FFF"
          />
        );
    }
  };

  const getTitle = (risk: string) => {
    switch (risk) {
      case "Alto":
        return "CRÍTICO";

      case "Médio":
        return "ALERTA";

      default:
        return "MONITORADO";
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButton}>
          ← Voltar
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Alertas
      </Text>

      <FlatList
        data={alerts}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              item.risk === "Alto"
                ? styles.redCard
                : item.risk === "Médio"
                ? styles.yellowCard
                : styles.greenCard,
            ]}
            onPress={() =>
              navigation.navigate("Details", {
                alertId: item.id,
              })
            }
          >
            <View style={styles.header}>
              {getIcon(item.risk)}

              <Text
                style={[
                  styles.headerText,
                  item.risk === "Médio"
                    ? styles.darkText
                    : styles.lightText,
                ]}
              >
                {getTitle(item.risk)}
              </Text>
            </View>

            <Text
              style={[
                styles.status,
                item.risk === "Médio"
                  ? styles.darkText
                  : styles.lightText,
              ]}
            >
              {item.status}
            </Text>

            <Text
              style={[
                styles.text,
                item.risk === "Médio"
                  ? styles.darkText
                  : styles.lightText,
              ]}
            >
             {item.km}
            </Text>

            <Text
              style={[
                styles.text,
                item.risk === "Médio"
                  ? styles.darkText
                  : styles.lightText,
              ]}
            >
              Risco: {item.risk}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E5631",
    marginBottom: 20,
  },

  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  status: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },

  text: {
    fontSize: 15,
    marginBottom: 2,
  },

  lightText: {
    color: "#FFF",
  },

  darkText: {
    color: "#2C3E50",
  },
});