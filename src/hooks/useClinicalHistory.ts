// src/hooks/useClinicalHistory.ts

import { useEffect, useState } from "react";
import { getClinicalHistory } from "../services/pacientes/patient.service";


export const useClinicalHistory = (patientId?: number) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getClinicalHistory(patientId);

        // 🔥 NORMALIZACIÓN CLAVE
        if (Array.isArray(res)) {
          console.log("Respuesta  'data':", res);
          setData(res);
        } else if (Array.isArray(res?.data)) {
          setData(res.data);
        } else {
          console.warn("Formato inesperado:", res);
          setData([]);
        }
      } catch (error) {
        console.error("Error cargando historia clínica", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  return { data, loading };
};