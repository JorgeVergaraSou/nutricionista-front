import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { PropsTurnosTable } from "../../../interfaces/turno.interface";
import { EstadoTurno } from "../../../enums/estadoTurno.enum";

const estadoColor = (estado: EstadoTurno) => {
  switch (estado) {
    case EstadoTurno.CONFIRMADO:
      return "success";
    case EstadoTurno.CANCELADO:
      return "error";
    default:
      return "warning";
  }
};

export default function TurnosTable({
  turnos,
  onDelete,
  onPacienteClick,
}: PropsTurnosTable) {
  if (!turnos.length) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
        <Stack spacing={2} alignItems="center">
          <EventBusyIcon color="disabled" fontSize="large" />
          <Typography variant="h6">
            No hay turnos para este día
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hora</TableCell>
            <TableCell>Paciente</TableCell>
            <TableCell>DNI</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {turnos.map((turno) => (
            <TableRow key={turno.id} hover>
              <TableCell>{turno.hora}</TableCell>

              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography>
                    {turno.paciente.apellido}, {turno.paciente.nombre}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() => onPacienteClick(turno)}
                  >
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>

              <TableCell>{turno.paciente.dni}</TableCell>

              <TableCell>
                <Chip
                  label={turno.estado}
                  color={estadoColor(turno.estado)}
                  size="small"
                />
              </TableCell>

              <TableCell align="right">
                <IconButton onClick={() => onDelete(turno.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
