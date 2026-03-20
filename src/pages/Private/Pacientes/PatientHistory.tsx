//src/pages/Private/Pacientes/PatientHistory.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import AutocompletePaciente from "../../../components/AutocompletePaciente";
import PatientTimeline from "../../../components/PatientTimeline";

import { ClinicalHistoryItem } from "../../../interfaces/clinical-history.interface";
import { getPatientById } from "../../../services/pacientes/patient.service";
import { getClinicalHistory } from "../../../services/pacientes/clinical-history.service";
import { Patient } from "../../../interfaces/patients.interface";

/* =========================
   AGRUPAR POR FECHA
========================= */
const groupByDate = (history: ClinicalHistoryItem[]) => {
  const grouped: Record<string, ClinicalHistoryItem[]> = {};

  history.forEach((item) => {
    const dateKey = dayjs(item.fecha).format("YYYY-MM-DD");

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(item);
  });

  return grouped;
};

export default function PatientHistory() {
  const { patientId } = useParams();

  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const [history, setHistory] = useState<
    ClinicalHistoryItem[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState<string | false>(
    false
  );

  const handleChange =
    (panel: string) =>
    (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  /* =========================
     CARGAR PACIENTE
  ========================== */

  useEffect(() => {
    if (!patientId) return;

    const fetchPatient = async () => {
      try {
        const data = await getPatientById(Number(patientId));
        setSelectedPatient(data);
      } catch (error) {
        console.error("Error cargando paciente", error);
      }
    };

    fetchPatient();
  }, [patientId]);

  /* =========================
     CARGAR HISTORIA CLINICA
  ========================== */

  useEffect(() => {
    if (!selectedPatient) return;

    const fetchHistory = async () => {
      setLoading(true);

      try {
        const data = await getClinicalHistory(
          selectedPatient.id
        );

        console.log("Historia clínica raw:", data);

        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando historia clínica", error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedPatient]);

  /* =========================
     PROCESAR DATOS
  ========================== */

  const grouped = groupByDate(history);

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => dayjs(b).valueOf() - dayjs(a).valueOf()
  );

  /* =========================
     UI
  ========================== */

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Historia Clínica
      </Typography>

      {!patientId && (
        <AutocompletePaciente
          value={selectedPatient}
          onChange={(value) => setSelectedPatient(value)}
          label="Buscar paciente"
        />
      )}

      {!selectedPatient && !patientId && (
        <Typography mt={3} color="text.secondary">
          Seleccione un paciente para ver su historial.
        </Typography>
      )}

      {selectedPatient && (
        <Box mt={4}>
          <Typography variant="h6">
            {selectedPatient.apellido},{" "}
            {selectedPatient.nombre}
          </Typography>

          <Typography color="text.secondary" mb={3}>
            DNI {selectedPatient.dni}
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : history.length === 0 ? (
            <Typography color="text.secondary">
              No hay eventos en la historia clínica.
            </Typography>
          ) : (
            <Box>
              {sortedDates.map((date) => (
                <Accordion
                  key={date}
                  expanded={expanded === date}
                  onChange={handleChange(date)}
                  sx={{
                    borderRadius: 2,
                    "&:before": { display: "none" },
                    mb: 2,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography fontWeight={600}>
                      {dayjs(date).format("DD/MM/YYYY")}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Stack spacing={2}>
                      <PatientTimeline
                        history={grouped[date]}
                      />
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}