import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const API = "/patients";

export const addBioanalisis = async (patientId: number, payload: any) => {
  const { data } = await axios.post(`${apiUrl}${API}/${patientId}/bioanalysis`, payload);
  return data;
};

export const deleteBioanalisis = async (id: number) => {
  const { data } = await axios.delete(`${apiUrl}${API}/bioanalysis/${id}`);
  return data;
};
