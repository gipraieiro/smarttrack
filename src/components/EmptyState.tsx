import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onRetry?: () => void;
}

export default function EmptyState({
  title = "Nenhum ponto encontrado",
  message = "Não existem áreas para exibição no momento.",
  buttonText = "Atualizar",
  onRetry,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="leaf-outline"
          size={30}
          color="#176B43"
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
    backgroundColor: "#E8F1EC",
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
    minWidth: 130,
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