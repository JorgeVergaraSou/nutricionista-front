// src/pages/Private/Patients/PatientHistory.tsx
import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Divider,
    Stack,
} from "@mui/material";
import dayjs from "dayjs";


import { Visit } from "../../../interfaces/visit.interface";
import { obtenerVisitasPorPaciente } from "../../../services/visits/visits.service";
import { Patient } from "../../../interfaces/patients.interface";

interface Props {
    paciente: Patient;
}

export default function PatientHistory({ paciente }: Props) {
    const [visitas, setVisitas] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(false);

    const cargarHistorial = async () => {
        setLoading(true);
        try {
            const { data } = await obtenerVisitasPorPaciente(paciente.id);

            setVisitas(
                data.map((v) => ({
                    ...v,
                    medicionesAntropometricas:
                        v.medicionesAntropometricas ?? [],
                }))
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarHistorial();
    }, [paciente.id]);

    return (
        <Box sx={{ p: 3 }}>
            <Box mb={3}>
                <Typography variant="h5" fontWeight="bold">
                    Historia Clínica
                </Typography>

                <Typography variant="subtitle1" color="text.secondary">
                    {paciente.apellido}, {paciente.nombre} · DNI {paciente.dni}
                </Typography>
            </Box>

            {loading ? (
                <CircularProgress />
            ) : visitas.length === 0 ? (
                <Typography color="text.secondary">
                    El paciente no tiene visitas registradas.
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {visitas.map((visita) => (
                        <Card key={visita.id} sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Typography fontWeight={600}>
                                    {dayjs(visita.fecha).format("DD/MM/YYYY")}
                                </Typography>

                                {visita.turno && (
                                    <Typography variant="body2" color="text.secondary">
                                        Turno: {visita.turno.hora}
                                    </Typography>
                                )}

                                <Divider sx={{ my: 1.5 }} />

                                {visita.motivoConsulta && (
                                    <>
                                        <Typography fontWeight={500}>
                                            Motivo de consulta
                                        </Typography>
                                        <Typography variant="body2">
                                            {visita.motivoConsulta}
                                        </Typography>
                                    </>
                                )}

                                {visita.observaciones && (
                                    <>
                                        <Typography fontWeight={500} mt={1}>
                                            Observaciones
                                        </Typography>
                                        <Typography variant="body2">
                                            {visita.observaciones}
                                        </Typography>
                                    </>
                                )}

                                {visita.medicionesAntropometricas.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Typography fontWeight={500}>
                                            Antropometría
                                        </Typography>

                                        {visita.medicionesAntropometricas.map((a) => (
                                            <Typography key={a.id} variant="body2">
                                                Peso: {a.peso ?? "-"} kg ·
                                                Talla: {a.talla ?? "-"} m ·
                                                IMC: {a.imc ?? "-"}
                                            </Typography>
                                        ))}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
