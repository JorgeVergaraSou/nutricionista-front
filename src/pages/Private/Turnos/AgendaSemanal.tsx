// src/pages/Private/Turnos/AgendaSemanal.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Chip,
  IconButton,
  Badge,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { Turno } from "../../../interfaces/turno.interface";
import { obtenerTurnosPorFecha } from "../../../services/turnos/turnos.service";
import TurnoDialog from "./Gestion/TurnoDialog";
import { useAgendaTurnos } from "../../../hooks/useAgendaTurnos";
import { EstadoTurno } from "../../../enums/estadoTurno.enum";

dayjs.locale("es");

const DIAS_LABORALES = [1, 2, 3, 4, 5, 6]; // lunes a sábado

export default function AgendaSemanal() {
  const [semanaBase, setSemanaBase] = useState(dayjs());
  const [turnosPorDia, setTurnosPorDia] = useState<
    Record<string, Turno[]>
  >({});
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // 📡 Cargar semana
  // --------------------------------------------------
  const cargarSemana = async () => {
    setLoading(true);
    const inicioSemana = semanaBase.startOf("week");
    const dataSemana: Record<string, Turno[]> = {};

    try {
      for (let i = 0; i < 7; i++) {
        const fechaObj = inicioSemana.add(i, "day");

        if (!DIAS_LABORALES.includes(fechaObj.day())) continue;

        const fecha = fechaObj.format("YYYY-MM-DD");
        const { data } = await obtenerTurnosPorFecha(fecha);
        dataSemana[fecha] = data;
      }

      setTurnosPorDia(dataSemana);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSemana();
  }, [semanaBase]);

  // --------------------------------------------------
  // 🧠 Hook Agenda
  // --------------------------------------------------
  const agenda = useAgendaTurnos({
    onRefresh: cargarSemana,
  });

  // --------------------------------------------------
  // 🎨 Color por estado
  // --------------------------------------------------
const getEstadoColor = (
  estado: EstadoTurno
): "success" | "error" | "warning" | "info" | "default" => {
  switch (estado) {
    case EstadoTurno.CONFIRMADO:
      return "success";

    case EstadoTurno.CANCELADO:
      return "error";

    case EstadoTurno.NO_ASISTIO:
      return "warning";

    case EstadoTurno.ATENDIDO:
      return "info";

    case EstadoTurno.PENDIENTE:
    default:
      return "default";
  }
};

  // --------------------------------------------------
  // 📅 Rango visible
  // --------------------------------------------------
  const inicioVisible = semanaBase.startOf("week").add(1, "day");
  const finVisible = inicioVisible.add(5, "day");

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight={700}>
          Agenda Semanal
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            onClick={() => setSemanaBase((prev) => prev.subtract(1, "week"))}
          >
            <ArrowBackIos />
          </IconButton>

          <Typography fontWeight={600}>
            {inicioVisible.format("DD MMM")} -{" "}
            {finVisible.format("DD MMM YYYY")}
          </Typography>

          <IconButton
            onClick={() => setSemanaBase((prev) => prev.add(1, "week"))}
          >
            <ArrowForwardIos />
          </IconButton>
        </Stack>
      </Stack>

      {/* LOADING */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 3,
          }}
        >
          {Object.entries(turnosPorDia).map(([fecha, turnos]) => (
            <Card
              key={fecha}
              elevation={2}
              sx={{
                borderRadius: 4,
                minHeight: 320,
                display: "flex",
                flexDirection: "column",
                transition: "0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
              onClick={() => agenda.abrirNuevo(fecha)}
            >
              {/* HEADER DÍA */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "grey.50",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  fontWeight={600}
                  textTransform="capitalize"
                >
                  {dayjs(fecha).format("dddd DD")}
                </Typography>

                <Badge
                  badgeContent={turnos.length}
                  color="primary"
                />
              </Box>

              {/* CONTENIDO */}
              <CardContent
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  p: 2,
                }}
              >
                {turnos.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Sin turnos
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {turnos.map((turno) => (
                      <Chip
                        key={turno.id}
                        label={`${turno.hora} · ${turno.paciente.apellido}`}
                        color={getEstadoColor(turno.estado)}
                        variant="outlined"
                        sx={{
                          justifyContent: "flex-start",
                          fontWeight: 500,
                          borderRadius: 2,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          agenda.abrirEdicion(turno);
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <TurnoDialog
        open={agenda.openDialog}
        turno={agenda.turnoSeleccionado}
        fechaPreseleccionada={agenda.fechaPreseleccionada}
        onClose={agenda.cerrar}
        onSave={agenda.guardar}
      />
    </Box>
  );
}