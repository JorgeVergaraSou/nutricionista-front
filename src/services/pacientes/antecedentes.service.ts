import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const API = "/patients";

export const addAntecedente = async (patientId: number, payload: any) => {
  const { data } = await axios.post(`${apiUrl}${API}/${patientId}/antecedents`, payload);
  return data;
};

export const deleteAntecedente = async (id: number) => {
  const { data } = await axios.delete(`${apiUrl}${API}/antecedents/${id}`);
  return data;
};
