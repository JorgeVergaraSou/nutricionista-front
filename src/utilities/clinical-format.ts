//src/utilities/clinical-format.ts
// =========================
// FORMATOS NUMÉRICOS
// =========================

export const toNumber = (value: any): number | null => {
  const num = Number(value);
  return isNaN(num) ? null : num;
};

export const formatNumber = (
  value: any,
  decimals = 2
): string => {
  const num = toNumber(value);
  return num === null ? "-" : num.toFixed(decimals);
};

// =========================
// ANTROPOMETRÍA
// =========================

export const formatIMC = (value: any): string => {
  const num = toNumber(value);
  return num === null ? "-" : num.toFixed(2);
};

export const formatPeso = (value: any): string => {
  const num = toNumber(value);
  return num === null ? "-" : `${num.toFixed(1)} kg`;
};

export const formatTalla = (value: any): string => {
  const num = toNumber(value);
  return num === null ? "-" : `${num.toFixed(2)} m`;
};

// =========================
// LABORATORIO
// =========================

export const formatValor = (
  value: any,
  unidad?: string
): string => {
  const num = toNumber(value);
  if (num === null) return "-";
  return `${num} ${unidad ?? ""}`.trim();
};

export const formatRango = (
  min: any,
  max: any
): string => {
  const minVal = toNumber(min);
  const maxVal = toNumber(max);

  if (minVal === null || maxVal === null) return "";

  return `(${minVal} - ${maxVal})`;
};

// =========================
// ESTADOS (CLÍNICO)
// =========================

export const getEstadoColor = (estado?: string) => {
  switch (estado) {
    case "ALTO":
    case "Alto":
      return "error";
    case "BAJO":
    case "Bajo":
      return "warning";
    case "NORMAL":
    case "Normal":
      return "success";
    default:
      return "default";
  }
};