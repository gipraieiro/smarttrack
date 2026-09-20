import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorStateProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Não foi possível carregar os dados",
  message = "Ocorreu um problema ao consultar os pontos monitorados.",
  buttonText = "Tentar novamente",
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={32}
          color="#B54747"
        />
      </View>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>

      {onRetry && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={onRetry}
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.buttonText}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 45,
  },

  iconContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#F8EAEA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#193B2A",
    textAlign: "center",
    marginBottom: 7,
  },

  message: {
    fontSize: 14,
    lineHeight: 20,
    color: "#718078",
    textAlign: "center",
    maxWidth: 300,
  },

  button: {
    minWidth: 150,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#176B43",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 7,
  },
});