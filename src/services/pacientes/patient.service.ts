// src/services/pacientes/patient.service.ts
import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const API = "/patients";

export const autocompletePaciente = async (term: string) => {
  const { data } = await axios.get(apiUrl + `${API}/autocomplete`, {
    params: { q: term },
  });
  return data.data; // solo devolvemos array de pacientes
};

export const getPacienteById = async (id: number) => {
  const { data } = await axios.get(apiUrl + `${API}/traerPaciente/${id}`);
  // supones que devuelve el paciente completo como objeto en data
  return data;
};

// Crear un paciente con registro completo
export const createFullPatientService = async (data: any) => {
  return axios.post(`${apiUrl}${API}/registro-completo`, data);
};

/* ---------- CREATE / DELETE helpers para los acordeones ---------- */

/* Antecedentes */
export const createAntecedent = async (patientId: number, dto: { descripcion: string }) => {
  const { data } = await axios.post(apiUrl + `${API}/${patientId}/antecedents`, dto);
  return data;
};

export const deleteAntecedent = async (aid: number) => {
  const { data } = await axios.delete(apiUrl + `${API}/antecedents/${aid}`);
  return data;
};

/* Medicaciones */
export const createMedication = async (
  patientId: number,
  dto: { nombre: string; enfermedadRelacionada?: string | null; detalles?: string | null }
) => {
  const { data } = await axios.post(apiUrl + `${API}/${patientId}/medications`, dto);
  return data;
};

export const deleteMedication = async (mid: number) => {
  const { data } = await axios.delete(apiUrl + `${API}/medications/${mid}`);
  return data;
};

/* Bioanalysis */
export const createBioanalysis = async (
  patientId: number,
  dto: { tipo: string; resultados: string; fecha: string }
) => {
  const { data } = await axios.post(apiUrl + `${API}/${patientId}/bioanalysis`, dto);
  return data;
};

export const deleteBioanalysis = async (bid: number) => {
  const { data } = await axios.delete(apiUrl + `${API}/bioanalysis/${bid}`);
  return data;
};

/* Anthropometrics */
export const createAnthropometric = async (
  patientId: number,
  dto: {
    fecha: string;
    talla: string | number;
    peso: string | number;
    imc: string | number;
    visitId?: number;
    porcentajeGrasa?: string | number | null;
    porcentajeMusculo?: string | number | null;
    porcentajeGrasaABD?: string | number | null;
    kcalBasales?: string | number | null;
    circAbdominal?: string | number | null   
  }
) => {
  const { data } = await axios.post(apiUrl + `${API}/${patientId}/anthropometrics`, dto);
  return data;
};

export const deleteAnthropometric = async (aid: number) => {
  const { data } = await axios.delete(apiUrl + `${API}/anthropometrics/${aid}`);
  return data;
};
