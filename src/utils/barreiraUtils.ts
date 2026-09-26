import { Severidade, StatusBarreira } from "@/types";

export function corDaSeveridade(severidade: Severidade): string {
  switch (severidade) {
    case "alta":
      return "#DC2626";
    case "media":
      return "#F59E0B";
    case "baixa":
    default:
      return "#16A34A";
  }
}

export function rotuloDaSeveridade(severidade: Severidade): string {
  switch (severidade) {
    case "alta":
      return "Grave";
    case "media":
      return "Moderada";
    case "baixa":
    default:
      return "Leve";
  }
}

export function rotuloDoStatus(status: StatusBarreira): string {
  return status === "resolvido" ? "Resolvida ✅" : "Pendente ⏳";
}
