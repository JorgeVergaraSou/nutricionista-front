//src
export type ClinicalHistoryType =
  | "VISITA"
  | "ANTROPOMETRIA"
  | "ANALISIS"
  | "PRESCRIPCION"
  | "ARCHIVO";

export interface ClinicalHistoryItem {
  fecha: string;
  tipo: ClinicalHistoryType;
  data: any;
}