import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type {
  RootStackParamList,
  NewOccurrence,
} from "../navigation/AppNavigator";

const STORAGE_KEY = "@smarttrack/new-occurrences";

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "NewOccurrence"
>;

export default function NewOccurrenceScreen() {
  const navigation = useNavigation<NavigationProps>();

  const savingRef = useRef(false);

  // Mantém o texto da descrição sem controlar diretamente o TextInput.
  const descriptionRef = useRef("");

  const [placeName, setPlaceName] = useState("");
  const [km, setKm] = useState("");
  const [height, setHeight] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [saving, setSaving] = useState(false);

  function parseNumber(value: string): number {
    return Number(value.trim().replace(",", "."));
  }

  function classifyRisk(value: number): NewOccurrence["risk"] {
    if (value >= 30) return "Alto";
    if (value >= 15) return "Médio";
    return "Baixo";
  }

  function handleDescriptionChange(text: string) {
    descriptionRef.current = text;
  }

  async function handleSave() {
    if (savingRef.current) return;

    const currentDescription = descriptionRef.current.trim();

    if (
      !placeName.trim() ||
      !km.trim() ||
      !height.trim() ||
      !temperature.trim() ||
      !humidity.trim() ||
      !currentDescription
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha todos os campos antes de salvar."
      );
      return;
    }

    const parsedHeight = parseNumber(height);
    const parsedTemperature = parseNumber(temperature);
    const parsedHumidity = parseNumber(humidity);

    if (
      !Number.isFinite(parsedHeight) ||
      parsedHeight <= 0 ||
      parsedHeight > 1000
    ) {
      Alert.alert(
        "Altura inválida",
        "Informe uma altura maior que zero e de até 1.000 cm."
      );
      return;
    }

    if (
      !Number.isFinite(parsedTemperature) ||
      parsedTemperature < -50 ||
      parsedTemperature > 70
    ) {
      Alert.alert(
        "Temperatura inválida",
        "Informe uma temperatura entre -50 °C e 70 °C."
      );
      return;
    }

    if (
      !Number.isFinite(parsedHumidity) ||
      parsedHumidity < 0 ||
      parsedHumidity > 100
    ) {
      Alert.alert(
        "Umidade inválida",
        "A umidade deve ser um número entre 0% e 100%."
      );
      return;
    }

    savingRef.current = true;
    setSaving(true);

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let occurrences: NewOccurrence[] = [];

      if (stored) {
        const parsed: unknown = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          occurrences = parsed as NewOccurrence[];
        }
      }

      const normalizedPlaceName = placeName.trim();
      const normalizedKm = km.trim();

      const newOccurrence: NewOccurrence = {
        id: Date.now(),
        placeName: normalizedPlaceName,
        km: normalizedKm,
        location: normalizedKm,
        height: parsedHeight,
        temperature: parsedTemperature,
        humidity: parsedHumidity,
        description: currentDescription,
        risk: classifyRisk(parsedHeight),
        createdAt: new Date().toISOString(),
      };

      occurrences.unshift(newOccurrence);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(occurrences)
      );

      Alert.alert(
        "Ocorrência cadastrada",
        "O registro foi salvo neste dispositivo.",
        [
          {
            text: "Ver alertas",
            onPress: () => navigation.navigate("Alerts"),
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao salvar ocorrência:", error);

      Alert.alert(
        "Erro ao salvar",
        "Não foi possível salvar a ocorrência. Tente novamente."
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  const parsedHeightForPreview = parseNumber(height);

  const showRiskPreview =
    height.trim() !== "" &&
    Number.isFinite(parsedHeightForPreview) &&
    parsedHeightForPreview > 0 &&
    parsedHeightForPreview <= 1000;

  const previewRisk = showRiskPreview
    ? classifyRisk(parsedHeightForPreview)
    : null;

  const riskColor =
    previewRisk === "Alto"
      ? "#B6423C"
      : previewRisk === "Médio"
        ? "#B77A20"
        : "#47764B";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={22} color="#36563B" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>SMARTTRACK</Text>
            <Text style={styles.title}>Nova ocorrência</Text>
            <Text style={styles.subtitle}>
              Registre uma condição identificada na vegetação.
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#58734D"
          />
          <Text style={styles.infoText}>
            Os dados serão armazenados localmente neste dispositivo.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Dados da ocorrência</Text>

          <Text style={styles.label}>Nome do local *</Text>
          <TextInput
            style={styles.input}
            value={placeName}
            onChangeText={setPlaceName}
            placeholder="Ex.: Trecho próximo a Três Corações"
            placeholderTextColor="#92978F"
            maxLength={100}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="next"
          />

          <Text style={styles.label}>Quilômetro da rodovia *</Text>
          <TextInput
            style={styles.input}
            value={km}
            onChangeText={setKm}
            placeholder="Ex.: Km 67"
            placeholderTextColor="#92978F"
            maxLength={30}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="next"
          />

          <Text style={styles.label}>Altura da vegetação (cm) *</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="Ex.: 32"
            placeholderTextColor="#92978F"
            keyboardType="decimal-pad"
            returnKeyType="next"
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Temperatura (°C) *</Text>
              <TextInput
                style={styles.input}
                value={temperature}
                onChangeText={setTemperature}
                placeholder="Ex.: 26"
                placeholderTextColor="#92978F"
                keyboardType="numbers-and-punctuation"
                returnKeyType="next"
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Umidade (%) *</Text>
              <TextInput
                style={styles.input}
                value={humidity}
                onChangeText={setHumidity}
                placeholder="Ex.: 65"
                placeholderTextColor="#92978F"
                keyboardType="decimal-pad"
                returnKeyType="next"
              />
            </View>
          </View>

          <Text style={styles.label}>Descrição da ocorrência *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            defaultValue=""
            onChangeText={handleDescriptionChange}
            onEndEditing={(event) => {
              descriptionRef.current = event.nativeEvent.text;
            }}
            placeholder="Ex.: Vegetação em alerta, necessita de poda."
            placeholderTextColor="#92978F"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            autoCapitalize="sentences"
            autoCorrect={false}
            spellCheck={false}
            keyboardType="default"
            maxLength={500}
          />

          {showRiskPreview && previewRisk && (
            <View style={styles.riskPreview}>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color={riskColor}
              />
              <Text style={styles.riskPreviewText}>
                Classificação estimada:{" "}
                <Text
                  style={[
                    styles.riskPreviewBold,
                    { color: riskColor },
                  ]}
                >
                  {previewRisk}
                </Text>
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.saveButton,
              saving && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={saving}
            accessibilityRole="button"
          >
            <Ionicons name="save-outline" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {saving ? "Salvando..." : "Cadastrar ocorrência"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={saving}
            accessibilityRole="button"
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>* Campos obrigatórios</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F1",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 35,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
    borderWidth: 1,
    borderColor: "#E4E8DE",
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: "#718268",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#263E2C",
  },
  subtitle: {
    color: "#737B70",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF0E4",
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: "#4D6447",
    fontSize: 13,
    lineHeight: 19,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E9ECE5",
  },
  sectionTitle: {
    color: "#2D4531",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    color: "#475346",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 13,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#DDE3D7",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#29352A",
    fontSize: 14,
    backgroundColor: "#FCFDFB",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
    minWidth: 0,
  },
  textArea: {
    minHeight: 110,
  },
  riskPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    marginTop: 18,
    backgroundColor: "#F5F7F1",
    borderRadius: 12,
  },
  riskPreviewText: {
    color: "#596455",
    fontSize: 13,
    flex: 1,
  },
  riskPreviewBold: {
    fontWeight: "700",
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#456B43",
    minHeight: 52,
    borderRadius: 14,
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelButton: {
    alignItems: "center",
    padding: 15,
    marginTop: 5,
  },
  cancelButtonText: {
    color: "#697365",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    color: "#82897E",
    fontSize: 12,
    marginTop: 14,
    marginLeft: 3,
  },
});