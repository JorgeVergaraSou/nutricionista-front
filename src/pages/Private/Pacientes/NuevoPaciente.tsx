// src/pages/Private/Pacientes/NuevoPaciente.tsx

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
  MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

import { createFullPatientService } from "../../../services/pacientes/patient.service";
import { AntecedentType } from "../../../enums/antecedentes.enum";

/* ============================
   SCHEMAS
============================ */

const antecedentesSchema = z.object({
  tipo: z.enum(Object.values(AntecedentType) as [string, ...string[]]),
  titulo: z.string().min(1, "Requerido"),
  detalle: z.string().optional(),
});

const schema = z.object({
  nombre: z.string().trim().min(2, "Nombre obligatorio"),
  apellido: z.string().trim().min(2, "Apellido obligatorio"),
  dni: z.string().trim().regex(/^\d{7,8}$/, "DNI inválido"),
  fechaNacimiento: z.string().nullable().optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  actividadFisica: z.string().optional(),

  antecedentes: z.array(antecedentesSchema).optional(),
});

type FormData = z.infer<typeof schema>;

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
      antecedentes: [
        {
          tipo: AntecedentType.FAMILIAR,
          titulo: "",
          detalle: "",
        },
      ],
    },
  });

  const antecedentesFA = useFieldArray({
    control,
    name: "antecedentes",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  /* ============================
     SUBMIT
  ============================ */

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        fechaNacimiento: data.fechaNacimiento || null,
        direccion: data.direccion || null,
        telefono: data.telefono || null,
        email: data.email || null,
        actividadFisica: data.actividadFisica || null,
        antecedentes: data.antecedentes || [],
      };

      await createFullPatientService(payload);

      setSnackbar({
        open: true,
        message: "Paciente creado correctamente",
        severity: "success",
      });

      reset();
    } catch (e: any) {
      if (e.response?.status === 409) {
        setSnackbar({
          open: true,
          message: "El DNI ya está registrado.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: e.response?.data?.message || "Error al guardar paciente",
          severity: "error",
        });
      }
    }
  };

  /* ============================
     UI
  ============================ */

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Nuevo Paciente
      </Typography>

      <Card>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "grid", gap: 2 }}
          >
            <TextField
              label="Nombre"
              {...register("nombre")}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />

            <TextField
              label="Apellido"
              {...register("apellido")}
              error={!!errors.apellido}
              helperText={errors.apellido?.message}
            />

            <TextField
              label="DNI"
              {...register("dni")}
              error={!!errors.dni}
              helperText={errors.dni?.message}
            />

            <Controller
              control={control}
              name="fechaNacimiento"
              render={({ field }) => (
                <DatePicker
                  label="Fecha de nacimiento"
                  format="DD/MM/YYYY"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(value) =>
                    field.onChange(value ? value.format("YYYY-MM-DD") : null)
                  }
                />
              )}
            />

            <TextField label="Teléfono" {...register("telefono")} />

            <TextField
              label="Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField label="Dirección" {...register("direccion")} />

            <TextField label="Actividad Física" {...register("actividadFisica")} />

            {/* ANTECEDENTES */}

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Antecedentes</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {antecedentesFA.fields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      display: "flex",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Controller
                      control={control}
                      name={`antecedentes.${index}.tipo`}
                      render={({ field }) => (
                        <TextField
                          select
                          label="Tipo"
                          fullWidth
                          value={field.value || ""} // 🔥 clave
                          onChange={field.onChange}
                          error={!!errors.antecedentes?.[index]?.tipo}
                          helperText={errors.antecedentes?.[index]?.tipo?.message}
                        >
                          {Object.values(AntecedentType).map((tipo) => (
                            <MenuItem key={tipo} value={tipo}>
                              {tipo}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />

                    <TextField
                      label="Título"
                      fullWidth
                      {...register(`antecedentes.${index}.titulo`)}
                      error={!!errors.antecedentes?.[index]?.titulo}
                      helperText={errors.antecedentes?.[index]?.titulo?.message}
                    />

                    <TextField
                      label="Detalle"
                      fullWidth
                      multiline
                      rows={2}
                      {...register(`antecedentes.${index}.detalle`)}
                    />

                    <IconButton
                      onClick={() => antecedentesFA.remove(index)}
                      disabled={antecedentesFA.fields.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  onClick={() =>
                    antecedentesFA.append({
                      tipo: AntecedentType.FAMILIAR,
                      titulo: "",
                      detalle: "",
                    })
                  }
                >
                  + Agregar Antecedente
                </Button>
              </AccordionDetails>
            </Accordion>

            <Button variant="contained" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Paciente"}
            </Button>
          </Box>
        </CardContent>
      </Card>

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