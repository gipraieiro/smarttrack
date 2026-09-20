import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          {/* LOGO */}

          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo-smarttrack.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* TÍTULO */}

          <Text style={styles.title}>
            Bem-vindo ao SmartTrack
          </Text>

          <Text style={styles.subtitle}>
            Monitoramento inteligente da vegetação para apoio à manutenção rodoviária
          </Text>

          {/* CARD DE LOGIN */}

          <View style={styles.loginCard}>

            <Text style={styles.loginTitle}>
              Login
            </Text>

            <Text style={styles.loginDescription}>
              Entre com suas credenciais.
            </Text>

            {/* EMAIL */}

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={21}
                color="#607D6B"
                style={styles.inputIcon}
              />

              <TextInput
                placeholder="E-mail"
                placeholderTextColor="#9AA5A0"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* SENHA */}

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color="#607D6B"
                style={styles.inputIcon}
              />

              <TextInput
                placeholder="Senha"
                placeholderTextColor="#9AA5A0"
                secureTextEntry
                style={styles.input}
              />
            </View>

            {/* BOTÃO */}

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Dashboard")}
            >
              <Text style={styles.buttonText}>
                Entrar
              </Text>

              <Ionicons
                name="arrow-forward"
                size={21}
                color="#FFFFFF"
              />
            </TouchableOpacity>

          </View>

          {/* RODAPÉ */}

          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color="#718078"
            />

            <Text style={styles.footerText}>
              SmartTrack
            </Text>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F5",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  content: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 35,
  },

  /* LOGO */

  logoContainer: {
  width: 280,
  height: 180,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
},

logo: {
  width: 275,
  height: 175,
},

  /* CABEÇALHO */

  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#193B2A",
    textAlign: "center",
    marginTop: 5,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#68756E",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },

  /* CARD */

  loginCard: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 25,

    shadowColor: "#163B28",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,

    elevation: 4,
  },

  loginTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#193B2A",
    marginBottom: 6,
  },

  loginDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#7A847E",
    marginBottom: 22,
  },

  /* INPUTS */

  inputContainer: {
    width: "100%",
    height: 54,
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#F7F9F8",

    borderWidth: 1,
    borderColor: "#E1E8E3",

    borderRadius: 12,

    marginBottom: 14,
  },

  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",

    color: "#26352D",
    fontSize: 15,

    paddingRight: 15,
  },

  /* BOTÃO */

  button: {
    width: "100%",
    height: 55,

    backgroundColor: "#176B43",

    borderRadius: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginTop: 7,

    shadowColor: "#176B43",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 7,

    elevation: 3,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },

  /* RODAPÉ */

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },

  footerText: {
    fontSize: 12,
    color: "#718078",
    marginLeft: 6,
  },
});