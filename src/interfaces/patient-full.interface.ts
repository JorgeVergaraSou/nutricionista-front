//src/interfaces/patient-full.interface.ts
export interface Antecedente {
  id: number;
  tipo: string;
  titulo: string;
  detalle?: string;
}

export interface MedicionAntropometrica {
  peso?: number;
  altura?: number;
  imc?: number;
}

export interface AnalisisItem {
  id: number;
  nombre?: string;
  resultado?: string;
}

export interface Analisis {
  id: number;
  tipo?: string;
  items?: AnalisisItem[];
}

export interface Prescripcion {
  id: number;
  nombre?: string;
  indicaciones?: string;
}

export interface Visita {
  id: number;
  fecha: string;
  motivo?: string;

  medicionesAntropometricas?: MedicionAntropometrica[];
  analisis?: Analisis[];
  prescripciones?: Prescripcion[];
}

export interface PatientFull {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;

  fechaNacimiento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  actividadFisica?: string;

  antecedentes?: Antecedente[];
  visitas?: Visita[];
}