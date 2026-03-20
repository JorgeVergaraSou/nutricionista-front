export interface CreateVisitDto {
  patientId: number;
  turnoId: number;

  motivoConsulta: string;
  enfermedadActual?: string;
  examenFisico?: string;
  diagnostico?: string;
  planTratamiento?: string;
  evolucion?: string;
  observaciones?: string;

  antropometria?: {
    peso?: number;
    talla?: number;

    circAbdominal?: number;
    porcentajeGrasa?: number;
    porcentajeGrasaABD?: number;
    porcentajeMusculo?: number;
    kcalBasales?: number;
  };

  prescripciones?: {
    nombre: string;
    indicaciones: string;
  }[];

  analisisBioquimicos?: {
    tipo: string;
    resultados: string;
  }[];
}