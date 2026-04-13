// src/utils/analisis.ts

export type EstadoAnalisis = "BAJO" | "NORMAL" | "ALTO";

export function calcularEstado(
  valor?: number | null,
  min?: number | null,
  max?: number | null
): EstadoAnalisis | undefined {
  if (valor == null || min == null || max == null) return;

  if (valor < min) return "BAJO";
  if (valor > max) return "ALTO";
  return "NORMAL";
}