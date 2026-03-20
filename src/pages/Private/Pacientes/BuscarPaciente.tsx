//src/pages/Private/Pacientes/BuscarPaciente.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import AutocompletePaciente from "../../../components/AutocompletePaciente";
import { Patient } from "../../../interfaces/patients.interface";
import { PrivateRoutes } from "../../../models";

export default function BuscarPaciente() {
  const navigate = useNavigate();

  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Buscar Paciente
      </Typography>

      <AutocompletePaciente
        value={selectedPatient}
        onChange={(value) => setSelectedPatient(value)}
        label="Buscar por nombre o DNI"
      />

      {!selectedPatient && (
        <Typography mt={3} color="text.secondary">
          Seleccione un paciente para ver información.
        </Typography>
      )}

      {selectedPatient && (
        <Card sx={{ mt: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600}>
              {selectedPatient.apellido},{" "}
              {selectedPatient.nombre}
            </Typography>

            <Typography color="text.secondary">
              DNI: {selectedPatient.dni}
            </Typography>

            {selectedPatient.telefono && (
              <Typography color="text.secondary">
                Teléfono: {selectedPatient.telefono}
              </Typography>
            )}

            {selectedPatient.email && (
              <Typography color="text.secondary">
                Email: {selectedPatient.email}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    PrivateRoutes.PERFIL_PACIENTE.replace(
                      ':patientId',
                      String(selectedPatient.id)
                    )
                  )
                }
              >
                Ver Perfil
              </Button>

              <Button
                variant="outlined"
                onClick={() =>
                  navigate(
                    `/admin/pacientes/${selectedPatient.id}/history`
                  )
                }
              >
                Historia Clínica
              </Button>
                
              <Button
                variant="contained"
                color="secondary"
                onClick={() =>
                  navigate(
                    `/admin/visitas/nueva/${selectedPatient.id}`
                  )
                }
              >
                Nueva Visita
              </Button>
               
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}