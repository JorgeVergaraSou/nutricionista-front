//src/pages/Private/Pacientes/PatientProfile.tsx

import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import { PatientProfile } from "../../../interfaces/patient-profile.interface";
import { getPatientById } from "../../../services/pacientes/patient.service";

import { useClinicalHistory } from "../../../hooks/useClinicalHistory";
import PatientTimeline from "../../../components/PatientTimeline";


export default function PatientProfilePage() {
  const { patientId } = useParams<{ patientId: string }>();

  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEvolution, setOpenEvolution] = useState(false);

  const {
    data: clinicalHistory,
    loading: loadingHistory,
  } = useClinicalHistory(Number(patientId));

  useEffect(() => {
    if (!patientId) return;

    const fetchPatient = async () => {
      try {
        const data = await getPatientById(Number(patientId));
        setPatient(data);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (loading)
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );

  if (!patient)
    return (
      <Box p={4}>
        <Typography color="error">Paciente no encontrado</Typography>
      </Box>
    );

  const edad = patient.fechaNacimiento
    ? dayjs().diff(dayjs(patient.fechaNacimiento), "year")
    : null;

  const grupoEtario =
    edad && edad >= 65
      ? "Adulto mayor"
      : edad && edad >= 40
      ? "Adulto"
      : "Adulto joven";

  const alertas: string[] = [];

  if (
    patient.antecedentes?.some((a) =>
      a.titulo?.toLowerCase().includes("diabetes")
    )
  )
    alertas.push("Diabetes");

  if (
    patient.antecedentes?.some((a) =>
      a.titulo?.toLowerCase().includes("hipert")
    )
  )
    alertas.push("Hipertensión");

  const evolutionData =
    patient.visitas
      ?.map((v) => {
        const m = v.medicionesAntropometricas?.[0];
        if (!m) return null;

        return {
          fecha: dayjs(v.fecha).format("DD/MM"),
          peso: m.peso ? Number(m.peso) : null,
        };
      })
      .filter(Boolean)
      .reverse() || [];

  return (
    <Box sx={{ p: 4, maxWidth: 1100, mx: "auto" }}>
      {/* HEADER */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight="bold">
              {patient.apellido}, {patient.nombre}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={`DNI ${patient.dni}`} size="small" />

              {edad && (
                <Chip
                  label={`${edad} años • ${grupoEtario}`}
                  size="small"
                  color="primary"
                />
              )}

              {alertas.map((a) => (
                <Chip key={a} label={a} size="small" color="error" />
              ))}
            </Stack>

            <Button
              variant="outlined"
              onClick={() => setOpenEvolution(true)}
              sx={{ width: "fit-content" }}
            >
              📊 Evolución del paciente
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* DATOS PERSONALES */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight="bold" mb={2}>
                Datos personales
              </Typography>

              <Stack spacing={1}>
                {patient.telefono && (
                  <Typography>Teléfono: {patient.telefono}</Typography>
                )}
                {patient.email && (
                  <Typography>Email: {patient.email}</Typography>
                )}
                {patient.direccion && (
                  <Typography>Dirección: {patient.direccion}</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* HISTORIA CLÍNICA PRO */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight="bold" mb={2}>
                Historia clínica
              </Typography>

              {loadingHistory ? (
                <CircularProgress />
              ) : !Array.isArray(clinicalHistory) ||
                clinicalHistory.length === 0 ? (
                <Typography color="text.secondary">
                  Sin registros clínicos
                </Typography>
              ) : (
                <PatientTimeline history={clinicalHistory} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* MODAL */}
      <Dialog
        open={openEvolution}
        onClose={() => setOpenEvolution(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Evolución clínica del paciente</DialogTitle>

        <DialogContent>
          {evolutionData.length === 0 ? (
            <Typography>No hay datos</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="peso" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}