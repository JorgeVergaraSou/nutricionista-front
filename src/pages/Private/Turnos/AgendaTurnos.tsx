// src/pages/Private/Turnos/AgendaTurnos.tsx

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";

import { useNavigate } from "react-router-dom";
import TurnosTable from "./TurnosTable";
import { marcarNoAsistio, obtenerTurnosPorFecha } from "../../../services/turnos/turnos.service";

import {
  FormFiltro,
  Turno,
} from "../../../interfaces/turno.interface";

import { PrivateRoutes } from "../../../models";

export default function AgendaTurnos() {
  const { control, watch } = useForm<FormFiltro>({
    defaultValues: { fecha: dayjs().format("YYYY-MM-DD") },
  });

  const navigate = useNavigate();
  const fecha = watch("fecha");

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);

  const [turnoNoAsistio, setTurnoNoAsistio] = useState<number | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // 📡 Cargar turnos
  const cargarTurnos = async () => {
    setLoading(true);
    try {
      const { data } = await obtenerTurnosPorFecha(fecha);
      setTurnos(data);
    } catch {
      setSnackbar({
        open: true,
        message: "Error al cargar turnos",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, [fecha]);

  // 👉 Abrir modal
  const handleNoAsistioClick = (id: number) => {
    setTurnoNoAsistio(id);
  };

  // 👉 Confirmar inasistencia
  const confirmarNoAsistio = async () => {
    if (!turnoNoAsistio) return;

    try {
      await marcarNoAsistio(turnoNoAsistio);
      setSnackbar({
        open: true,
        message: "Turno marcado como No asistió",
        severity: "success",
      });
      cargarTurnos();
    } catch {
      setSnackbar({
        open: true,
        message: "Error al marcar inasistencia",
        severity: "error",
      });
    } finally {
      setTurnoNoAsistio(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Agenda diaria
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Controller
            control={control}
            name="fecha"
            render={({ field }) => (
              <DatePicker
                label="Fecha"
                format="DD/MM/YYYY"
                value={dayjs(field.value)}
                onChange={(v) =>
                  field.onChange(v?.format("YYYY-MM-DD"))
                }
              />
            )}
          />

          {loading ? (
            <CircularProgress sx={{ mt: 3 }} />
          ) : (
            <TurnosTable
              turnos={turnos}
              onDelete={() => {}}
              onNoAsistio={handleNoAsistioClick}
              onPacienteClick={(turno) => {
                navigate(
                  `${PrivateRoutes.VISITS_NUEVA}?turnoId=${turno.id}`
                );
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* 🔥 MODAL CONFIRMACION */}
      <Dialog
        open={Boolean(turnoNoAsistio)}
        onClose={() => setTurnoNoAsistio(null)}
      >
        <DialogTitle>Confirmar inasistencia</DialogTitle>
        <DialogContent>
          ¿Seguro que querés marcar este turno como "No asistió"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTurnoNoAsistio(null)}>
            Cancelar
          </Button>
          <Button
            color="warning"
            variant="contained"
            onClick={confirmarNoAsistio}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar({ ...snackbar, open: false })
        }
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}