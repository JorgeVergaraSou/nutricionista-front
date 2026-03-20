// src/services/visits/visits.service.ts
import axios from "axios";
const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;
import { Visit } from "../../interfaces/visit.interface";
import { CreateVisitDto } from "../../interfaces/create-visit.interface";
import { VisitFullDTO } from "../../interfaces/visit-full.interface";


export const obtenerVisitasPorPaciente = (patientId: number) => {
  return axios.get<VisitFullDTO[]>(
    `${apiUrl}/visits/patient/${patientId}`
  );
};

export const crearVisita = (data: CreateVisitDto) => {
  return axios.post<Visit>(`${apiUrl}/visits`, data);
};

export const crearVisitaFull = async (
  dto: any,
  files: File[]
) => {
  const formData = new FormData();

  formData.append("patientId", String(dto.patientId));

  if (dto.turnoId) {
    formData.append("turnoId", String(dto.turnoId));
  }

  formData.append("motivoConsulta", dto.motivoConsulta || "");
  formData.append("observaciones", dto.observaciones || "");
  formData.append("planTratamiento", dto.planTratamiento || "");
  formData.append("evolucion", dto.evolucion || "");
  formData.append("enfermedadActual", dto.enfermedadActual || "");
  formData.append("examenFisico", dto.examenFisico || "");
  formData.append("diagnostico", dto.diagnostico || "");

  // 🔥 ANTROPOMETRIA
  if (dto.antropometria) {
    formData.append(
      "antropometria",
      JSON.stringify(dto.antropometria)
    );
  }

  // 🔥 PRESCRIPCIONES (FIX)
  if (dto.prescripciones) {
    formData.append(
      "prescripciones",
      JSON.stringify(dto.prescripciones)
    );
  }

  // 🔥 ANALISIS (FIX)
  if (dto.analisisBioquimicos) {
    formData.append(
      "analisisBioquimicos",
      JSON.stringify(dto.analisisBioquimicos)
    );
  }

  // FILES
  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await axios.post(
    `${apiUrl}/visits/full`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};