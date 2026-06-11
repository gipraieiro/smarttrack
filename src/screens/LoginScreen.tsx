import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        SMART<Text style={styles.green}>TRACK</Text>
      </Text>

      <Text style={styles.subtitle}>
        Monitoramento inteligente de vegetação
      </Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.buttonText}>
          Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6DBDF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  logo: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
  },

  green: {
    color: "#27AE60",
  },

  subtitle: {
    color: "#566573",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 50,
  },

  input: {
    width: "85%",
    height: 55,
    borderWidth: 2,
    borderColor: "#27AE60",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    marginBottom: 20,
  },

  button: {
    width: "70%",
    height: 55,
    backgroundColor: "#27AE60",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});