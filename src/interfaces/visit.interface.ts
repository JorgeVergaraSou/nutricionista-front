// src/interfaces/visit.interface.ts
import { Turno } from "./turno.interface";
import { Anthropometric } from "./anthropometric.interface";

export interface Visit {
  id: number;
  fecha: string;
  motivoConsulta?: string;
  observaciones?: string;
  planTratamiento?: string;
  evolucion?: string;
  turno?: Turno;
  medicionesAntropometricas: Anthropometric[];
}
