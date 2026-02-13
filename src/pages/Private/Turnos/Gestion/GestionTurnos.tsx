import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";

import {
  obtenerTurnosPorFecha,
  crearTurno,
  actualizarTurno,
  eliminarTurno,
} from "../../../../services/turnos/turnos.service";

import {
  Turno,
  TurnoForm,
} from "../../../../interfaces/turno.interface";

import { EstadoTurno } from "../../../../enums/estadoTurno.enum";
import AutocompletePaciente from "../../../../components/AutocompletePaciente";

export default function GestionTurnos() {
  const fechaHoy = dayjs().format("YYYY-MM-DD");

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] =
    useState<Turno | null>(null);

  const [paciente, setPaciente] = useState<any>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
  } = useForm<TurnoForm>({
    defaultValues: {
      fecha: fechaHoy,
      hora: "",
      estado: EstadoTurno.PENDIENTE,
      observaciones: "",
      pacienteId: 0,
    },
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // -----------------------------
  // Cargar turnos
  // -----------------------------
  const cargarTurnos = async () => {
    setLoading(true);
    try {
      const { data } = await obtenerTurnosPorFecha(fechaHoy);
      setTurnos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  // -----------------------------
  // Nuevo
  // -----------------------------
  const abrirNuevo = () => {
    setModoEdicion(true);
    setTurnoSeleccionado(null);
    reset({
      fecha: fechaHoy,
      hora: "",
      estado: EstadoTurno.PENDIENTE,
      observaciones: "",
      pacienteId: 0,
    });
    setPaciente(null);
  };

  // -----------------------------
  // Editar
  // -----------------------------
  const abrirEdicion = (turno: Turno) => {
    setModoEdicion(true);
    setTurnoSeleccionado(turno);

    reset({
      fecha: turno.fecha,
      hora: turno.hora,
      estado: turno.estado,
      observaciones: turno.observaciones,
      pacienteId: turno.paciente.id,
    });

    setPaciente(turno.paciente);
  };

  // -----------------------------
  // Guardar
  // -----------------------------
  const guardarTurno = async (data: TurnoForm) => {
    try {
      if (!data.pacienteId) {
        setSnackbar({
          open: true,
          message: "Debe seleccionar un paciente",
          severity: "error",
        });
        return;
      }

      if (turnoSeleccionado) {
        await actualizarTurno(turnoSeleccionado.id, data);
      } else {
        await crearTurno(data);
      }

      setModoEdicion(false);
      setTurnoSeleccionado(null);
      cargarTurnos();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message ||
          "Error al guardar turno",
        severity: "error",
      });
    }
  };

  // -----------------------------
  // Eliminar
  // -----------------------------
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar turno?")) return;

    await eliminarTurno(id);
    cargarTurnos();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Gestión de Turnos
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={abrirNuevo}
        >
          Nuevo Turno
        </Button>
      </Box>

      {modoEdicion && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <AutocompletePaciente
                value={paciente}
                onChange={(p) => {
                  setPaciente(p);
                  setValue("pacienteId", p?.id ?? 0);
                }}
              />

              <Controller
                name="fecha"
                control={control}
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

              <Controller
                name="hora"
                control={control}
                render={({ field }) => (
                  <TextField {...field} type="time" label="Hora" />
                )}
              />

              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <TextField select label="Estado" {...field}>
                    {Object.values(EstadoTurno).map((estado) => (
                      <MenuItem key={estado} value={estado}>
                        {estado}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="observaciones"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Observaciones"
                    multiline
                    rows={3}
                  />
                )}
              />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleSubmit(guardarTurno)}
                >
                  Guardar
                </Button>

                <Button
                  onClick={() => {
                    setModoEdicion(false);
                    setTurnoSeleccionado(null);
                  }}
                >
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <Stack spacing={2}>
              {turnos.map((turno) => (
                <Card key={turno.id} variant="outlined">
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography fontWeight="bold">
                          {turno.hora} —{" "}
                          {turno.paciente.apellido},{" "}
                          {turno.paciente.nombre}
                        </Typography>

                        <Typography variant="body2">
                          Estado: {turno.estado}
                        </Typography>

                        <Typography variant="body2">
                          Obs: {turno.observaciones || "-"}
                        </Typography>
                      </Box>

                      <Stack direction="row">
                        <IconButton
                          onClick={() => abrirEdicion(turno)}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          onClick={() =>
                            handleDelete(turno.id)
                          }
                        >
                          <Delete color="error" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

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
