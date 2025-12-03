import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;

export const profileService = async (token: string) => {
   
  try {

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

    const responseProfile = await axios.get(apiUrl + `/auth/profile`, { headers });
   
    return responseProfile;
  } catch (error: any) {
   
    const errorMessage = error.response?.data?.message || 'Error desconocido';
    console.error("Error al obtener el perfil:", errorMessage);
    throw new Error(errorMessage);
  }
};
