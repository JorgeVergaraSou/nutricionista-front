// src/interfaces/anthropometric.interface.ts
export interface Anthropometric {
  id: number;
  fecha: string;
  peso?: number | null;
  talla?: number | null;
  imc?: number | null;
  porcentajeGrasa?: number | null;
  porcentajeMusculo?: number | null;
  circAbdominal?: number | null;
}
