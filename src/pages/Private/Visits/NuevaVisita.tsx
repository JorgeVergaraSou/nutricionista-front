import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import { getPatientById } from "../../../services/pacientes/patient.service";


import { Patient } from "../../../interfaces/patients.interface";
import { crearVisitaFull } from "../../../services/visits/visits.service";

export default function NuevaVisita() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [planTratamiento, setPlanTratamiento] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [peso, setPeso] = useState("");
  const [talla, setTalla] = useState("");

  const [files, setFiles] = useState<File[]>([]);

  /* =========================
     CARGAR PACIENTE
  ========================== */

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatientById(Number(patientId));
        setPatient(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  /* =========================
     ARCHIVOS
  ========================== */

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const list = Array.from(e.target.files);
    setFiles(list);
  };

  /* =========================
     GUARDAR VISITA
  ========================== */

  const handleSubmit = async () => {
    if (!patient) return;

    try {
      const formData = new FormData();

      formData.append("patientId", String(patient.id));

      formData.append("motivoConsulta", motivoConsulta);
      formData.append("diagnostico", diagnostico);
      formData.append("planTratamiento", planTratamiento);
      formData.append("observaciones", observaciones);

      if (peso && talla) {
        formData.append(
          "antropometria",
          JSON.stringify({
            peso: Number(peso),
            talla: Number(talla),
          })
        );
      }

      files.forEach((file) => {
        formData.append("files", file);
      });

      await crearVisitaFull(formData);

      navigate(`/admin/pacientes/${patient.id}/history`);

    } catch (error) {
      console.error("Error creando visita", error);
    }
  };

  /* =========================
     UI
  ========================== */

  if (loading) return <CircularProgress />;

  if (!patient)
    return <Typography>Paciente no encontrado</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Nueva Visita
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography fontWeight={600}>
            {patient.apellido}, {patient.nombre}
          </Typography>

          <Typography color="text.secondary" mb={3}>
            DNI {patient.dni}
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Motivo de consulta"
              value={motivoConsulta}
              onChange={(e) =>
                setMotivoConsulta(e.target.value)
              }
              multiline
            />

            <TextField
              label="Diagnóstico"
              value={diagnostico}
              onChange={(e) =>
                setDiagnostico(e.target.value)
              }
              multiline
            />

            <TextField
              label="Plan de tratamiento"
              value={planTratamiento}
              onChange={(e) =>
                setPlanTratamiento(e.target.value)
              }
              multiline
            />

            <TextField
              label="Observaciones"
              value={observaciones}
              onChange={(e) =>
                setObservaciones(e.target.value)
              }
              multiline
            />

            <Typography fontWeight={600}>
              Antropometría
            </Typography>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Peso (kg)"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
              />

              <TextField
                label="Talla (m)"
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
              />
            </Stack>

            <Button variant="outlined" component="label">
              Subir archivos
              <input
                hidden
                type="file"
                multiple
                onChange={handleFiles}
              />
            </Button>

            {files.length > 0 && (
              <Typography variant="body2">
                {files.length} archivo(s) seleccionado(s)
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit}
            >
              Guardar Visita
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}