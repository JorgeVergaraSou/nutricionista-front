import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const API = "/patients";

export const addMedicacion = async (patientId: number, payload: any) => {
  const { data } = await axios.post(`${apiUrl}${API}/${patientId}/medications`, payload);
  return data;
};

export const deleteMedicacion = async (id: number) => {
  const { data } = await axios.delete(`${apiUrl}${API}/medications/${id}`);
  return data;
};
