// src/interfaces/visit-full.interface.ts
import { Turno } from "./turno.interface";
import { Anthropometric } from "./anthropometric.interface";
import { Bioanalysis } from "./bioanalysis.interface";
import { Prescription } from "./prescription.interface";
import { PatientFile } from "./patient-file.interface";

export interface VisitFullDTO {
  id: number;
  fecha: string;

  motivoConsulta?: string | null;
  enfermedadActual?: string | null;
  examenFisico?: string | null;
  diagnostico?: string | null;
  planTratamiento?: string | null;
  evolucion?: string | null;
  observaciones?: string | null;

  turno?: Turno;

  medicionesAntropometricas: Anthropometric[];
  analisisBioquimicos: Bioanalysis[];
  prescripciones: Prescription[];
  files: PatientFile[];
}