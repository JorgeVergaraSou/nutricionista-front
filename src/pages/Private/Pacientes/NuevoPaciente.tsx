import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { createFullPatientService } from "../../../services/pacientes/patient.service";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";



// ---------------------------------------------------------------------------
// 📌 SCHEMA ZOD COMPLETO
// ---------------------------------------------------------------------------
const antecedentesSchema = z.object({
  tipo: z.string().min(1, "Requerido"),
  descripcion: z.string().min(1, "Requerido"),
});

const medicacionSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  dosis: z.string().min(1, "Requerido"),
  frecuencia: z.string().min(1, "Requerido"),
});

const analisisSchema = z.object({
  tipo: z.string().min(1, "Requerido"),
  resultados: z.string().min(1, "Requerido"),
  fecha: z.string().min(1, "Requerido"),
});

const antropometriaSchema = z.object({
  fecha: z.string().min(1, "Requerido"),
  talla: z.string().min(1, "Requerido"),
  peso: z.string().min(1, "Requerido"),
  imc: z.string().min(1, "Requerido"),
  porcentajeGrasa: z.string().min(1, "Requerido"),
});

const schema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  dni: z.string().min(7),
  fechaNacimiento: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  actividadFisica: z.string().optional(),

  antecedentes: z.array(antecedentesSchema).nonempty("Debe agregar al menos un antecedente"),
  medicaciones: z.array(medicacionSchema).nonempty("Debe agregar al menos una medicación"),
  analisisBioquimicos: z.array(analisisSchema).nonempty("Debe agregar al menos un análisis"),
  medicionesAntropometricas: z.array(antropometriaSchema).nonempty("Debe agregar al menos una medición"),
});

type FormData = z.infer<typeof schema>;


// ---------------------------------------------------------------------------
// 📌 COMPONENTE PRINCIPAL
// ---------------------------------------------------------------------------
export default function NuevoPaciente() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      antecedentes: [{} as any],
      medicaciones: [{} as any],
      analisisBioquimicos: [{} as any],
      medicionesAntropometricas: [{} as any],
    },
  });

  // Array dinámicos
  const antecedentesFA = useFieldArray({ control, name: "antecedentes" });
  const medicacionesFA = useFieldArray({ control, name: "medicaciones" });
  const analisisFA = useFieldArray({ control, name: "analisisBioquimicos" });
  const antropometriaFA = useFieldArray({ control, name: "medicionesAntropometricas" });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });


  // ---------------------------------------------------------------------------
  // 📌 SUBMIT
  // ---------------------------------------------------------------------------
  const onSubmit = async (data: FormData) => {
    try {
      await createFullPatientService(data);
      setSnackbar({ open: true, message: "Paciente creado correctamente", severity: "success" });
      reset();
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
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Nuevo Paciente
      </Typography>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          {/* FORM PRINCIPAL */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            {/* Campos básicos */}
            <TextField label="Nombre" {...register("nombre")} error={!!errors.nombre} helperText={errors.nombre?.message} />
            <TextField label="Apellido" {...register("apellido")} error={!!errors.apellido} helperText={errors.apellido?.message} />
            <TextField label="DNI" {...register("dni")} error={!!errors.dni} helperText={errors.dni?.message} />
            <Controller
              control={control}
              name="fechaNacimiento"
              render={({ field }) => (
                <DatePicker
                  label="Fecha de nacimiento"
                  format="DD/MM/YYYY"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(value) => {
                    field.onChange(value ? value.format("YYYY-MM-DD") : "");
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.fechaNacimiento,
                      helperText: errors.fechaNacimiento?.message,
                    },
                  }}
                />
              )}
            />

            <TextField label="Teléfono" {...register("telefono")} />
            <TextField label="Email" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
            <TextField label="Dirección" sx={{ gridColumn: "1 / -1" }} {...register("direccion")} />
            <TextField label="Actividad Física" {...register("actividadFisica")} />

            {/* ------------------------------------------------------------------- */}
            {/* 📌 ACORDEÓN — ANTECEDENTES */}
            {/* ------------------------------------------------------------------- */}
            <Accordion sx={{ gridColumn: "1 / -1" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Antecedentes (Obligatorio)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {antecedentesFA.fields.map((field, index) => (
                  <Box key={field.id} sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField label="Tipo" fullWidth {...register(`antecedentes.${index}.tipo`)} />
                    <TextField label="Descripción" fullWidth {...register(`antecedentes.${index}.descripcion`)} />

                    {antecedentesFA.fields.length > 1 && (
                      <IconButton onClick={() => antecedentesFA.remove(index)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
                  </Box>
                ))}

                <Button variant="outlined" onClick={() => antecedentesFA.append({ tipo: "", descripcion: "" })}>
                  + Agregar Antecedente
                </Button>

                {errors.antecedentes && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.antecedentes.message}
                  </Alert>
                )}
              </AccordionDetails>
            </Accordion>

            {/* ------------------------------------------------------------------- */}
            {/* 📌 ACORDEÓN — MEDICACIONES */}
            {/* ------------------------------------------------------------------- */}
            <Accordion sx={{ gridColumn: "1 / -1" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Medicaciones (Obligatorio)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {medicacionesFA.fields.map((field, index) => (
                  <Box key={field.id} sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField label="Nombre" fullWidth {...register(`medicaciones.${index}.nombre`)} />
                    <TextField label="Dosis" fullWidth {...register(`medicaciones.${index}.dosis`)} />
                    <TextField label="Frecuencia" fullWidth {...register(`medicaciones.${index}.frecuencia`)} />

                    {medicacionesFA.fields.length > 1 && (
                      <IconButton onClick={() => medicacionesFA.remove(index)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
                  </Box>
                ))}

                <Button variant="outlined" onClick={() => medicacionesFA.append({ nombre: "", dosis: "", frecuencia: "" })}>
                  + Agregar Medicación
                </Button>

                {errors.medicaciones && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.medicaciones.message}
                  </Alert>
                )}
              </AccordionDetails>
            </Accordion>

            {/* ------------------------------------------------------------------- */}
            {/* 📌 ACORDEÓN — ANÁLISIS BIOQUÍMICOS */}
            {/* ------------------------------------------------------------------- */}
            <Accordion sx={{ gridColumn: "1 / -1" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Análisis Bioquímicos</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {analisisFA.fields.map((field, index) => (
                  <Box key={field.id} sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField label="Tipo" fullWidth {...register(`analisisBioquimicos.${index}.tipo`)} />
                    <TextField label="Resultados" fullWidth {...register(`analisisBioquimicos.${index}.resultados`)} />
                    <Controller
                      control={control}
                      name={`analisisBioquimicos.${index}.fecha`}
                      render={({ field }) => (
                        <DatePicker
                          label="Fecha"
                          format="DD-MM-YYYY"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(value) => {
                            field.onChange(value ? value.format("YYYY-MM-DD") : "");
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.analisisBioquimicos?.[index]?.fecha,
                              helperText: errors.analisisBioquimicos?.[index]?.fecha?.message,
                            },
                          }}
                        />
                      )}
                    />


                    {analisisFA.fields.length > 1 && (
                      <IconButton onClick={() => analisisFA.remove(index)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
                  </Box>
                ))}

                <Button variant="outlined" onClick={() => analisisFA.append({ tipo: "", resultados: "", fecha: "" })}>
                  + Agregar Análisis
                </Button>

                {errors.analisisBioquimicos && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.analisisBioquimicos.message}
                  </Alert>
                )}
              </AccordionDetails>
            </Accordion>

            {/* ------------------------------------------------------------------- */}
            {/* 📌 ACORDEÓN — MEDICIONES ANTROPOMÉTRICAS */}
            {/* ------------------------------------------------------------------- */}
            <Accordion sx={{ gridColumn: "1 / -1" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Mediciones Antropométricas</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {antropometriaFA.fields.map((field, index) => (
                  <Box key={field.id} sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(5, 1fr)", mb: 2 }}>
                    
                    <TextField label="Talla" {...register(`medicionesAntropometricas.${index}.talla`)} />
                    <TextField label="Peso" {...register(`medicionesAntropometricas.${index}.peso`)} />
                    <TextField label="IMC" {...register(`medicionesAntropometricas.${index}.imc`)} />
                    <TextField label="% Grasa" {...register(`medicionesAntropometricas.${index}.porcentajeGrasa`)} />
                    <Controller
                      control={control}
                      name={`medicionesAntropometricas.${index}.fecha`}
                      render={({ field }) => (
                        <DatePicker
                          label="Fecha"
                          format="DD-MM-YYYY"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(value) => {
                            field.onChange(value ? value.format("YYYY-MM-DD") : "");
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.medicionesAntropometricas?.[index]?.fecha,
                              helperText: errors.medicionesAntropometricas?.[index]?.fecha?.message,
                            },
                          }}
                        />
                      )}
                    />

                    {antropometriaFA.fields.length > 1 && (
                      <IconButton onClick={() => antropometriaFA.remove(index)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  onClick={() =>
                    antropometriaFA.append({
                      fecha: "",
                      talla: "",
                      peso: "",
                      imc: "",
                      porcentajeGrasa: "",
                    })
                  }
                >
                  + Agregar Medición
                </Button>

                {errors.medicionesAntropometricas && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.medicionesAntropometricas.message}
                  </Alert>
                )}
              </AccordionDetails>
            </Accordion>

            {/* SUBMIT */}
            <Button variant="contained" type="submit" fullWidth sx={{ gridColumn: "1 / -1" }} disabled={isSubmitting}>
              Guardar Paciente
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
