//src/pages/Private/Pacientes/PatientEvolutionCharts.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Card, CardContent, Typography, Box } from "@mui/material";
import dayjs from "dayjs";

interface Props {
  visitas: any[];
}

export default function PatientEvolutionCharts({ visitas }: Props) {
  const data =
    visitas
      ?.map((v) => {
        const m = v.medicionesAntropometricas?.[0];

        if (!m) return null;

        return {
          fecha: dayjs(v.fecha).format("DD/MM"),
          peso: m.peso ? Number(m.peso) : null,
          imc: m.imc ? Number(m.imc) : null,
          grasa: m.porcentajeGrasa ? Number(m.porcentajeGrasa) : null,
        };
      })
      .filter(Boolean)
      .reverse() || [];

  if (data.length === 0) {
    return (
      <Typography color="text.secondary">
        No hay datos para mostrar evolución
      </Typography>
    );
  }

  return (
    <Box display="grid" gap={3}>
      {/* PESO */}

      <Card>
        <CardContent>
          <Typography fontWeight="bold" mb={2}>
            Evolución del peso
          </Typography>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />

              <Line type="monotone" dataKey="peso" stroke="#1976d2" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* IMC */}

      <Card>
        <CardContent>
          <Typography fontWeight="bold" mb={2}>
            Evolución del IMC
          </Typography>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />

              <Line type="monotone" dataKey="imc" stroke="#d32f2f" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* GRASA */}

      <Card>
        <CardContent>
          <Typography fontWeight="bold" mb={2}>
            Evolución de grasa corporal
          </Typography>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />

              <Line type="monotone" dataKey="grasa" stroke="#ed6c02" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}