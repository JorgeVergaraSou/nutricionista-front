import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { createFullPatientService } from "../../../services/pacientes/patient.service";

const schema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  dni: z.string().min(7),
  fechaNacimiento: z
    .string()
    .optional()
    .refine((v: string | undefined) => {
      if (!v) return true;
      return /^\d{4}-\d{2}-\d{2}$/.test(v) || /^\d{2}\/\d{2}\/\d{4}$/.test(v);
    }, "Fecha con formato YYYY-MM-DD o DD/MM/YYYY"),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  actividadFisica: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NuevoPaciente() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success"
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createFullPatientService({
        ...data,
        antecedentes: [],
        medicaciones: [],
        analisisBioquimicos: [],
        medicionesAntropometricas: [],
      });
      setSnackbar({ open: true, message: "Paciente creado", severity: "success" });
      reset();
    } catch (e: any) {
      setSnackbar({ open: true, message: e.response?.data?.message || "Error al guardar", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Nuevo Paciente
      </Typography>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
            <TextField
              label="Nombre"
              fullWidth
              {...register("nombre")}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
            <TextField
              label="Apellido"
              fullWidth
              {...register("apellido")}
              error={!!errors.apellido}
              helperText={errors.apellido?.message}
            />
            <TextField
              label="DNI"
              fullWidth
              {...register("dni")}
              error={!!errors.dni}
              helperText={errors.dni?.message}
            />
            <TextField
              label="Fecha Nacimiento"
              fullWidth
              {...register("fechaNacimiento")}
              error={!!errors.fechaNacimiento}
              helperText={errors.fechaNacimiento?.message}
            />
            <TextField
              label="Teléfono"
              fullWidth
              {...register("telefono")}
            />
            <TextField
              label="Dirección"
              fullWidth
              sx={{ gridColumn: "1 / -1" }}
              {...register("direccion")}
            />
            <TextField
              label="Email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Actividad Física"
              fullWidth
              {...register("actividadFisica")}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              size="large"
              disabled={isSubmitting}
              sx={{ gridColumn: "1 / -1", mt: 2 }}
            >
              Guardar Paciente
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
