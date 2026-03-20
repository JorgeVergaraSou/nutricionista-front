// src/services/turnos/turnos.service.ts
import axios from "axios";
import { Turno } from "../../interfaces/turno.interface";
const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;

export const obtenerTurnosPorFecha = (fecha: string) =>{
  const data = axios.get(`${apiUrl}/turnos/turnos_por_fecha`, { params: { fecha } });
  console.log("Data obtenida por fecha:", data);
  return data;
}
 

export const crearTurno = (data: any) =>
  axios.post(`${apiUrl}/turnos/dar_turno`, data);

export const editarTurno = (id: number, data: any) =>
  axios.patch(`${apiUrl}/turnos/${id}`, data);

export const eliminarTurno = (id: number) =>
  axios.delete(`${apiUrl}/turnos/eliminar_turno/${id}`);

export const obtenerTurnoPorId = (id: number) => {
  return axios.get<Turno>(`${apiUrl}/turnos/turno_por_id/${id}`);
};

export const actualizarTurno = (id: number, data: any) => {
  return axios.patch(`${apiUrl}/turnos/actualizar_turno/${id}`, data);
};

export const marcarNoAsistio = (id: number) => {
  return axios.patch(`${apiUrl}/turnos/no-asistio/${id}`);
};

interface HistorialParams {
  desde?: string;
  hasta?: string;
}

export const obtenerHistorialTurnos = (params?: HistorialParams) => {
  return axios.get<Turno[]>(`${apiUrl}/turnos/historial`, {
    params,
  });
};