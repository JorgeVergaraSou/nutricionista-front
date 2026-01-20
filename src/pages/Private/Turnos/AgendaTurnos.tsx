import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";

import TurnosTable from "./TurnosTable";
import TurnoDialog from "./TurnoDialog";
import {
  obtenerTurnosPorFecha,
  crearTurno,
  editarTurno,
  eliminarTurno,
} from "../../../services/turnos/turnos.service";

import {
  FormFiltro,
  Turno,
  TurnoForm,
} from "../../../interfaces/turno.interface";

export default function AgendaTurnos() {
  const { control, watch } = useForm<FormFiltro>({
    defaultValues: { fecha: dayjs().format("YYYY-MM-DD") },
  });

  const fecha = watch("fecha");

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] =
    useState<Turno | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

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

  const guardarTurno = async (data: TurnoForm) => {
    try {
      if (turnoSeleccionado) {
        await editarTurno(turnoSeleccionado.id, data);
      } else {
        await crearTurno(data);
      }
      setOpenDialog(false);
      cargarTurnos();
    } catch (e: any) {
      setSnackbar({
        open: true,
        message: e.response?.data?.message || "Error al guardar",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Agenda de Turnos
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setTurnoSeleccionado(null);
            setOpenDialog(true);
          }}
        >
          Nuevo Turno
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Controller
            control={control}
            name="fecha"
            render={({ field }) => (
              <DatePicker
                label="Fecha"
                value={dayjs(field.value)}
                onChange={(v) =>
                  field.onChange(v?.format("YYYY-MM-DD"))
                }
              />
            )}
          />

          {loading ? (
            <CircularProgress />
          ) : (
            <TurnosTable
              turnos={turnos}
              onEdit={(t) => {
                setTurnoSeleccionado(t);
                setOpenDialog(true);
              }}
              onDelete={async (id) => {
                await eliminarTurno(id);
                cargarTurnos();
              }}
            />
          )}
        </CardContent>
      </Card>

      <TurnoDialog
        open={openDialog}
        turno={turnoSeleccionado}
        onClose={() => setOpenDialog(false)}
        onSave={guardarTurno}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
