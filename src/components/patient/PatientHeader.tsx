import { Card, CardContent, Typography, Stack, Chip, Button } from "@mui/material";
import dayjs from "dayjs";
import { PatientFull } from "../../interfaces/patient-full.interface";

type Props = {
  patient: PatientFull;
  onOpenEvolution: () => void;
};

export default function PatientHeader({ patient, onOpenEvolution }: Props) {
  const edad = patient.fechaNacimiento
    ? dayjs().diff(dayjs(patient.fechaNacimiento), "year")
    : null;

  const grupoEtario =
    edad && edad >= 65
      ? "Adulto mayor"
      : edad && edad >= 40
      ? "Adulto"
      : "Adulto joven";

  const totalVisitas = patient.visitas?.length || 0;

  const ultimaVisita = patient.visitas?.[0]?.fecha
    ? dayjs(patient.visitas[0].fecha).format("DD/MM/YYYY")
    : null;

  // 🔥 ALERTAS MEJORADAS (no hardcode frágil)
  const alertas: string[] = [];

  const antecedentesTexto =
    patient.antecedentes?.map((a: any) => a.descripcion?.toLowerCase()) || [];

  if (antecedentesTexto.some((t) => t?.includes("diabetes"))) {
    alertas.push("Diabetes");
  }

  if (antecedentesTexto.some((t) => t?.includes("hipert"))) {
    alertas.push("Hipertensión");
  }

  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Nombre */}
          <Typography variant="h5" fontWeight="bold">
            {patient.apellido}, {patient.nombre}
          </Typography>

          {/* Chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`DNI ${patient.dni}`} size="small" />

            {edad && (
              <Chip
                label={`${edad} años • ${grupoEtario}`}
                size="small"
                color="primary"
              />
            )}

            {patient.actividadFisica && (
              <Chip
                label={`Actividad: ${patient.actividadFisica}`}
                size="small"
              />
            )}

            <Chip
              label={`Visitas: ${totalVisitas}`}
              size="small"
              variant="outlined"
            />

            {ultimaVisita && (
              <Chip
                label={`Última visita: ${ultimaVisita}`}
                size="small"
              />
            )}

            {alertas.map((a) => (
              <Chip key={a} label={a} size="small" color="error" />
            ))}
          </Stack>

          {/* Acción */}
          <Button
            variant="outlined"
            onClick={onOpenEvolution}
            sx={{ width: "fit-content" }}
          >
            📊 Evolución del paciente
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}