export interface Alert {
  id: number;

  // Localização
  km: string;
  region: string;

  // Classificação do risco
  risk: "Alto" | "Médio" | "Baixo";

  // Dados ambientais
  temperature: number;
  humidity: number;

  // Vegetação
  // Valor armazenado em metros.
  // Exemplo: 0.30 = 30 cm
  height: number;
  growthTrend: "Alta" | "Média" | "Baixa";

  // Situação operacional
  status: string;
}

/*
 * =====================================================
 * CLASSIFICAÇÃO DA VEGETAÇÃO
 * =====================================================
 *
 * 30 cm ou mais  -> Alto / Crítico
 * 15 cm a <30 cm -> Médio / Alerta
 * Abaixo de 15cm -> Baixo / Controlado
 *
 */

export const getRiskByHeight = (
  heightInMeters: number
): "Alto" | "Médio" | "Baixo" => {
  const heightInCm = heightInMeters * 100;

  if (heightInCm >= 30) {
    return "Alto";
  }

  if (heightInCm >= 15) {
    return "Médio";
  }

  return "Baixo";
};

/*
 * =====================================================
 * DADOS SIMULADOS
 * =====================================================
 *
 * Os dados abaixo são mockados para o protótipo.
 * As alturas representam a vegetação encontrada
 * em cada ponto monitorado.
 *
 */

const monitoringData = [
  {
    id: 1,
    km: "Km 15",
    region: "Serra da Cantareira",
    temperature: 34,
    humidity: 22,
    height: 0.30,
    growthTrend: "Alta" as const,
  },

  {
    id: 2,
    km: "Km 65",
    region: "Atibaia / Bragança Paulista",
    temperature: 25,
    humidity: 48,
    height: 0.10,
    growthTrend: "Baixa" as const,
  },

  {
    id: 3,
    km: "Km 120",
    region: "Extrema / Serra da Mantiqueira",
    temperature: 29,
    humidity: 31,
    height: 0.20,
    growthTrend: "Média" as const,
  },

  {
    id: 4,
    km: "Km 200",
    region: "Pouso Alegre / Careaçu",
    temperature: 24,
    humidity: 51,
    height: 0.08,
    growthTrend: "Baixa" as const,
  },

  {
    id: 5,
    km: "Km 310",
    region: "Três Corações / Carmo da Cachoeira",
    temperature: 33,
    humidity: 24,
    height: 0.32,
    growthTrend: "Alta" as const,
  },

  {
    id: 6,
    km: "Km 420",
    region: "Oliveira / Santo Antônio do Amparo",
    temperature: 28,
    humidity: 34,
    height: 0.22,
    growthTrend: "Média" as const,
  },

  {
    id: 7,
    km: "Km 520",
    region: "Itaguara / Betim / BH",
    temperature: 26,
    humidity: 45,
    height: 0.12,
    growthTrend: "Baixa" as const,
  },
];

/*
 * =====================================================
 * ALERTAS
 * =====================================================
 *
 * O risco é calculado automaticamente através
 * da altura da vegetação.
 *
 */

export const alerts: Alert[] = monitoringData.map(
  (item) => {
    const risk = getRiskByHeight(item.height);

    let status = "";

    if (risk === "Alto") {
      status = "Vegetação necessita poda";
    } else if (risk === "Médio") {
      status = "Necessita acompanhamento";
    } else {
      status = "Área controlada";
    }

    return {
      ...item,
      risk,
      status,
    };
  }
);