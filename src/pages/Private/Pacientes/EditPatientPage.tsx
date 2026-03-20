import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";

import {
  getPatientById,
  updatePatientService,
} from "../../../services/pacientes/patient.service";

export default function EditPatientPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    direccion: "",
    actividadFisica: "",
  });

  useEffect(() => {
    const fetch = async () => {
      if (!patientId) return;

      const patient = await getPatientById(Number(patientId));

      setForm({
        nombre: patient.nombre || "",
        apellido: patient.apellido || "",
        dni: patient.dni || "",
        telefono: patient.telefono || "",
        email: patient.email || "",
        direccion: patient.direccion || "",
        actividadFisica: patient.actividadFisica || "",
      });

      setLoading(false);
    };

    fetch();
  }, [patientId]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!patientId) return;

    await updatePatientService(Number(patientId), form);

    navigate(`/admin/pacientes/${patientId}/perfil`);
  };

  if (loading)
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Card>
        <CardContent>

          <Typography variant="h6" mb={3}>
            Editar paciente
          </Typography>

          <Stack spacing={2}>

            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(e) =>
                handleChange("nombre", e.target.value)
              }
              fullWidth
            />

            <TextField
              label="Apellido"
              value={form.apellido}
              onChange={(e) =>
                handleChange("apellido", e.target.value)
              }
              fullWidth
            />

            <TextField
              label="DNI"
              value={form.dni}
              disabled
              fullWidth
            />

            <TextField
              label="Teléfono"
              value={form.telefono}
              onChange={(e) =>
                handleChange("telefono", e.target.value)
              }
              fullWidth
            />

            <TextField
              label="Email"
              value={form.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
              fullWidth
            />

            <TextField
              label="Dirección"
              value={form.direccion}
              onChange={(e) =>
                handleChange("direccion", e.target.value)
              }
              fullWidth
            />

            <TextField
              label="Actividad física"
              value={form.actividadFisica}
              onChange={(e) =>
                handleChange(
                  "actividadFisica",
                  e.target.value
                )
              }
              multiline
              rows={3}
              fullWidth
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                Guardar cambios
              </Button>

              <Button
                variant="outlined"
                onClick={() =>
                  navigate(
                    `/admin/pacientes/${patientId}/perfil`
                  )
                }
              >
                Cancelar
              </Button>
            </Stack>

          </Stack>

        </CardContent>
      </Card>
    </Box>
  );
}