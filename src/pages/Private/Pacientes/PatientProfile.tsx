//src/pages/Private/Pacientes/PatientProfile.tsx

import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  CircularProgress,
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

import PatientHeader from "../../../components/patient/PatientHeader";
import AntecedentesSection from "../../../components/patient/AntecedentesSection";


import { PatientFull } from "../../../interfaces/patient-full.interface";
import { getPatientById } from "../../../services/pacientes/patient.service";


export default function PatientProfilePage() {
  const { patientId } = useParams<{ patientId: string }>();
const [patient, setPatient] = useState<PatientFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEvolution, setOpenEvolution] = useState(false);



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
      ?.map((v: any) => {
        const m = v.medicionesAntropometricas?.[0];
        if (!m) return null;

        return {
          fecha: dayjs(v.fecha).format("DD/MM"),
          peso: m.peso ? Number(m.peso) : null,
          imc: m.imc ? Number(m.imc) : null,
        };
      })
      .filter(Boolean)
      .reverse() || [];

  return (
    <Box sx={{ p: 4, maxWidth: 1100, mx: "auto" }}>
      <PatientHeader
        patient={patient}
        onOpenEvolution={() => setOpenEvolution(true)}
      />

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

        {/* 🔥 NUEVO: ANTECEDENTES */}
        <Grid size={{ xs: 12, md: 6 }}>
          <AntecedentesSection antecedentes={patient.antecedentes || []} />
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
                <Line type="monotone" dataKey="peso" name="Peso (kg)" />
                <Line type="monotone" dataKey="imc" name="IMC" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}