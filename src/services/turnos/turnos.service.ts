// src/services/turnos/turnos.service.ts
import axios from "axios";
import { Turno } from "../../interfaces/turno.interface";
const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;

export const obtenerTurnosPorFecha = (fecha: string) =>
  axios.get(`${apiUrl}/turnos`, { params: { fecha } });

export const crearTurno = (data: any) =>
  axios.post(`${apiUrl}/turnos`, data);

export const editarTurno = (id: number, data: any) =>
  axios.patch(`${apiUrl}/turnos/${id}`, data);

export const eliminarTurno = (id: number) =>
  axios.delete(`${apiUrl}/turnos/${id}`);

export const obtenerTurnoPorId = (id: number) => {
  return axios.get<Turno>(`${apiUrl}/turnos/${id}`);
};

export const actualizarTurno = (id: number, data: any) => {
  return axios.patch(`${apiUrl}/turnos/${id}`, data);
};