import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;

export const registerService = async (name: string, email: string, password: string, secretWord: string) => {
  try {
    const res = await axios.post(apiUrl + `/auth/register`, { name, email, password, secretWord });
    
    // Accede al mensaje devuelto por el backend

   console.log('res.data', res.data);
   
    const successMessage = res.data.message; 
    console.log('Mensaje de éxito:', successMessage);

    const successOk = res.data.success; 
    console.log('Mensaje de éxito:', successOk);
    
    // Retorna el mensaje para ser usado en el frontend
    return res.data;  // Aquí res.data contiene el mensaje y el token si es exitoso

  } catch (error: any) {
    // Manejo de errores como antes
    const errorMessage = error.response?.data?.message || 'Error desconocido';
    throw new Error(errorMessage);
  }
};
