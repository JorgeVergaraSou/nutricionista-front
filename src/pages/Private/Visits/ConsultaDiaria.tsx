// src/pages/Private/Visits/ConsultaDiaria.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";

import { Turno } from "../../../interfaces/turno.interface";
import { obtenerTurnoPorId } from "../../../services/turnos/turnos.service";
import { crearVisitaFull } from "../../../services/visits/visits.service";


export default function ConsultaDiaria() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const turnoId = Number(params.get("turnoId"));

  const [turno, setTurno] = useState<Turno | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    motivoConsulta: "",
    observaciones: "",
    planTratamiento: "",
    evolucion: "",
    peso: "",
    talla: "",
  });

  // --------------------------------------------------
  // 📡 Cargar turno
  // --------------------------------------------------
  useEffect(() => {
    if (!turnoId) return;

    obtenerTurnoPorId(turnoId)
      .then(({ data }) => setTurno(data))
      .finally(() => setLoading(false));
  }, [turnoId]);

  // --------------------------------------------------
  // 💾 Guardar visita + antropometría
  // --------------------------------------------------
 const guardarVisita = async () => {
  if (!turno) return;

  try {
    setSaving(true);

    await crearVisitaFull({
      patientId: turno.paciente.id,
      turnoId: turno.id,
      motivoConsulta: form.motivoConsulta,
      observaciones: form.observaciones,
      planTratamiento: form.planTratamiento,
      evolucion: form.evolucion,
      antropometria:
        form.peso && form.talla
          ? {
              peso: Number(form.peso),
              talla: Number(form.talla),
            }
          : undefined,
    });

    navigate(`/patients/${turno.paciente.id}/history`);

  } catch (error) {
    console.error("Error al guardar consulta:", error);
  } finally {
    setSaving(false);
  }
};



  // --------------------------------------------------
  // 🧠 UI
  // --------------------------------------------------
  if (loading) return <CircularProgress />;

  if (!turno)
    return <Typography>No se pudo cargar el turno</Typography>;

  const { paciente } = turno;

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Consulta médica
      </Typography>

      {/* 🧑 Paciente */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography fontWeight={600}>
            {paciente.apellido}, {paciente.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            DNI {paciente.dni} · Turno {turno.hora}
          </Typography>
        </CardContent>
      </Card>

      {/* 🧠 Consulta */}
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Motivo de consulta"
              multiline
              value={form.motivoConsulta}
              onChange={(e) =>
                setForm({ ...form, motivoConsulta: e.target.value })
              }
            />

            <TextField
              label="Observaciones"
              multiline
              value={form.observaciones}
              onChange={(e) =>
                setForm({ ...form, observaciones: e.target.value })
              }
            />

            <Divider />

            <Typography fontWeight={500}>
              Antropometría
            </Typography>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Peso (kg)"
                value={form.peso}
                onChange={(e) =>
                  setForm({ ...form, peso: e.target.value })
                }
              />
              <TextField
                label="Talla (m)"
                value={form.talla}
                onChange={(e) =>
                  setForm({ ...form, talla: e.target.value })
                }
              />
            </Stack>

            <Divider />

            <TextField
              label="Plan de tratamiento"
              multiline
              value={form.planTratamiento}
              onChange={(e) =>
                setForm({
                  ...form,
                  planTratamiento: e.target.value,
                })
              }
            />

            <TextField
              label="Evolución"
              multiline
              value={form.evolucion}
              onChange={(e) =>
                setForm({ ...form, evolucion: e.target.value })
              }
            />

            <Button
              variant="contained"
              size="large"
              onClick={guardarVisita}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar consulta"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
