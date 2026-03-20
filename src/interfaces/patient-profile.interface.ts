//src/interfaces/patient-profile.interface.ts
import { Antecedent } from "./antecedentes.interface";
import { Visit } from "./visit.interface";

export interface PatientProfile {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  actividadFisica?: string | null;

  antecedentes?: Antecedent[];
  visitas?: Visit[];
}

/** * 

export interface Visit {
  id: number;
  fecha: string;
}

export interface PatientProfile {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;

  fechaNacimiento?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  actividadFisica?: string | null;

  antecedentes?: Antecedent[];
  visitas?: Visit[];
}
 */