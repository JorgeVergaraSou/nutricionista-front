import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const API = "/patients";

export const addMedicionAntropometrica = async (patientId: number, payload: any) => {
  const { data } = await axios.post(`${apiUrl}${API}/${patientId}/anthropometrics`, payload);
  return data;
};

export const deleteMedicionAntropometrica = async (id: number) => {
  const { data } = await axios.delete(`${apiUrl}${API}/anthropometrics/${id}`);
  return data;
};
