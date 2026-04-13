//src/services/pacientes/clinical-history.service.ts
import axios from "axios";
import { ClinicalHistoryItem } from "../../interfaces/clinical-history.interface";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const API = "/patients";

export const getClinicalHistory = async (
  patientId: number
): Promise<ClinicalHistoryItem[]> => {
  const { data } = await axios.get(
    apiUrl + `${API}/${patientId}/clinical-history`
  );

  console.log("Respuesta API historia clínica:", data);

  return data;
};