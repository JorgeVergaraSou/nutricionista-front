// src/interfaces/create-visit.interface.ts
export interface CreateVisitDto {
  patientId: number;
  turnoId?: number;
  fecha: string;

  motivoConsulta?: string;
  observaciones?: string;
  planTratamiento?: string;
  evolucion?: string;

  antropometria?: {
    peso?: number | null;
    talla?: number | null;
  };
}
