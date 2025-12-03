import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { DecodedToken } from "../interfaces/decode.token.interface";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;


export const loginService = async (email: string, password: string) => {
  try {
    const res = await axios.post(apiUrl + `/auth/login`, { email, password });
    console.log("res.data", res.data);
    
    
    const token = res.data.token; 

   
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token); 
   console.log("Decoded token:", decoded);
   
    return { token, ...decoded };
  } catch (error: any) {
   
    const errorMessage = error.response?.data?.message || 'Error desconocido';
    console.error("Error durante el login:", errorMessage);
    throw new Error(errorMessage);
  }
};
