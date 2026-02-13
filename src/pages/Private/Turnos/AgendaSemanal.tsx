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
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { Turno } from "../../../interfaces/turno.interface";
import { obtenerTurnosPorFecha } from "../../../services/turnos/turnos.service";
import TurnoDialog from "./Gestion/TurnoDialog";
import { useAgendaTurnos } from "../../../hooks/useAgendaTurnos";

dayjs.locale("es");

const DIAS_SEMANA = 7;

export default function AgendaSemanal() {
  const [semanaBase] = useState(dayjs());
  const [turnosPorDia, setTurnosPorDia] = useState<
    Record<string, Turno[]>
  >({});
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // 📡 Cargar semana
  // --------------------------------------------------
  const cargarSemana = async () => {
    setLoading(true);
    const inicio = semanaBase.startOf("week");
    const dataSemana: Record<string, Turno[]> = {};

    try {
      for (let i = 0; i < DIAS_SEMANA; i++) {
        const fecha = inicio.add(i, "day").format("YYYY-MM-DD");
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
  }, []);

  // --------------------------------------------------
  // 🧠 Lógica unificada de agenda
  // --------------------------------------------------
  const agenda = useAgendaTurnos({
    onRefresh: cargarSemana,
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Agenda Semanal
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 2,
          }}
        >
          {Object.entries(turnosPorDia).map(([fecha, turnos]) => (
            <Card
              key={fecha}
              sx={{
                borderRadius: 3,
                minHeight: 220,
                cursor: "pointer",
              }}
              onClick={() => agenda.abrirNuevo(fecha)}
            >
              <CardContent>
                <Typography fontWeight={600}>
                  {dayjs(fecha).format("dddd DD")}
                </Typography>

                <Stack spacing={1} mt={2}>
                  {turnos.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Sin turnos
                    </Typography>
                  )}

                  {turnos.map((turno) => (
                    <Chip
                      key={turno.id}
                      label={`${turno.hora} · ${turno.paciente.apellido}`}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        agenda.abrirEdicion(turno);
                      }}
                    />
                  ))}
                </Stack>
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
