import { alerts, Alert } from "./mockData";

export type MockScenario =
  | "success"
  | "empty"
  | "error";

export interface MockError {
  message: string;
}

export interface MockAlertsResult {
  scenario: MockScenario;
  data: Alert[];
  error: MockError | null;
}

/*
 * =====================================================
 * CENÁRIOS MOCKADOS — SPRINT 3
 * =====================================================
 *
 * success → dados normais da aplicação
 * empty   → nenhum ponto encontrado
 * error   → falha simulada no carregamento
 *
 */

export const mockAlertsScenarios: Record<
  MockScenario,
  MockAlertsResult
> = {
  success: {
    scenario: "success",
    data: alerts,
    error: null,
  },

  empty: {
    scenario: "empty",
    data: [],
    error: null,
  },

  error: {
    scenario: "error",
    data: [],
    error: {
      message: "Não foi possível carregar os pontos monitorados.",
    },
  },
};