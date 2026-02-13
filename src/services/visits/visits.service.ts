// src/services/visits/visits.service.ts
import axios from "axios";
const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;
import { Visit } from "../../interfaces/visit.interface";
import { CreateVisitDto } from "../../interfaces/create-visit.interface";

export const obtenerVisitasPorPaciente = (patientId: number) => {
  return axios.get<Visit[]>(`${apiUrl}/visits/patient/${patientId}`);
};

export const crearVisita = (data: CreateVisitDto) => {
  return axios.post<Visit>(`${apiUrl}/visits`, data);
};

export const crearVisitaFull = async (dto: any) => {
  const { data } = await axios.post(apiUrl + `/visits/full`, dto);
  return data;
};