import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { obtenerHistorialTurnos } from "../../../services/turnos/turnos.service";
import { EstadoTurno } from "../../../enums/estadoTurno.enum";
import { Turno } from "../../../interfaces/turno.interface";



const TurnosHistorial = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);

  const [fechaDesde, setFechaDesde] = useState<Dayjs | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Dayjs | null>(null);

  const fetchTurnos = async () => {
    try {
      setLoading(true);

      const response = await obtenerHistorialTurnos({
        desde: fechaDesde ? fechaDesde.format("YYYY-MM-DD") : undefined,
        hasta: fechaHasta ? fechaHasta.format("YYYY-MM-DD") : undefined,

      });
      console.log("Respuesta del servidor:", response.data);
      setTurnos(response.data);
    } catch (error) {
      console.error("Error cargando historial", error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (
    estado: EstadoTurno
  ): "success" | "error" | "warning" | "default" => {
    switch (estado) {
      case EstadoTurno.ATENDIDO:
        return "success";
      case EstadoTurno.CANCELADO:
        return "error";
      case EstadoTurno.NO_ASISTIO:
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Historial de Turnos
      </Typography>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ md: "flex-end" }}
          >
            <DatePicker
              label="Desde"
              value={fechaDesde}
              onChange={(newValue) => setFechaDesde(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />

            <DatePicker
              label="Hasta"
              value={fechaHasta}
              onChange={(newValue) => setFechaHasta(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />

            <Button
              variant="contained"
              onClick={fetchTurnos}
              sx={{
                height: 56,
                minWidth: 120,
              }}
            >
              Buscar
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card
        elevation={2}
        sx={{
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "grey.100",
                  }}
                >
                  <TableCell sx={{ fontWeight: 700 }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Hora
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Paciente
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Estado
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {turnos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ py: 6 }}
                    >
                      <Typography color="text.secondary">
                        No hay resultados para el rango seleccionado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  turnos.map((turno) => (
                    <TableRow
                      key={turno.id}
                      hover
                      sx={{
                        transition: "0.15s",
                        "&:hover": {
                          backgroundColor: "grey.50",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight={500}>
                          {dayjs(turno.fecha).format("DD/MM/YYYY")}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {turno.hora}
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight={600}>
                          {turno.paciente.nombre}{" "}
                          {turno.paciente.apellido}
                        </Typography>

                      </TableCell>

                      <TableCell>
                        <Chip
  label={turno.estado}
  color={getEstadoColor(turno.estado)}
  sx={{
    fontWeight: 600,
    color: "white",
  }}
/>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TurnosHistorial;