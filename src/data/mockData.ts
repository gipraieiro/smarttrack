export interface Alert {
  id: number;
  km: string;
  risk: "Alto" | "Médio" | "Baixo";
  temperature: number;
  humidity: number;
  status: string;
}

export const alerts: Alert[] = [
  {
    id: 1,
    km: "Km 132 - Rodoanel Oeste",
    risk: "Alto",
    temperature: 34,
    humidity: 22,
    status: "Vegetação crítica detectada",
  },

  {
    id: 2,
    km: "Km 98 - Rodoanel Oeste",
    risk: "Médio",
    temperature: 29,
    humidity: 31,
    status: "Necessita manutenção preventiva",
  },

  {
    id: 3,
    km: "Km 44 - Rodoanel Oeste",
    risk: "Baixo",
    temperature: 25,
    humidity: 48,
    status: "Área monitorada normalmente",
  },

  {
    id: 4,
    km: "Km 175 - Rodoanel Oeste",
    risk: "Baixo",
    temperature: 26,
    humidity: 45,
    status: "Área monitorada normalmente",
  },
];