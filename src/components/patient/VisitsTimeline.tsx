// src/components/patient/VisitsTimeline.tsx
import {
    Card,
    CardContent,
    Typography,
    Stack,
    Divider,
    Chip,
} from "@mui/material";
import dayjs from "dayjs";
import { Visita } from "../../interfaces/patient-full.interface";

type Props = {
    visitas: Visita[];
};

export default function VisitsTimeline({ visitas }: Props) {
    if (!visitas || visitas.length === 0) {
        return (
            <Typography color="text.secondary">
                Sin visitas registradas
            </Typography>
        );
    }

    return (
        <Stack spacing={2}>
            {visitas.map((v: any) => {
                const medicion = v.medicionesAntropometricas?.[0];

                const imc =
                    medicion?.imc != null
                        ? Number(medicion.imc)
                        : medicion?.peso && medicion?.altura
                            ? medicion.peso / (medicion.altura * medicion.altura)
                            : null;

                return (
                    <Card key={v.id} sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Stack spacing={1}>
                                {/* 📅 Fecha */}
                                <Typography fontWeight="bold">
                                    {dayjs(v.fecha).format("DD/MM/YYYY")}
                                </Typography>

                                {/* 📋 Motivo */}
                                {v.motivo && (
                                    <Typography color="text.secondary">
                                        {v.motivo}
                                    </Typography>
                                )}

                                {/* ⚖️ Mediciones */}
                                {medicion && (
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {medicion.peso && (
                                            <Chip label={`Peso: ${medicion.peso} kg`} size="small" />
                                        )}
                                        {medicion.altura && (
                                            <Chip label={`Altura: ${medicion.altura} m`} size="small" />
                                        )}
                                        {imc && (
                                            <Chip label={`IMC: ${imc.toFixed(1)}`} size="small" />
                                        )}
                                    </Stack>
                                )}

                                {/* 🧪 Análisis */}
                                {v.analisis?.length > 0 && (
                                    <div>
                                        <Typography variant="subtitle2">Análisis</Typography>

                                        {v.analisis.map((a: any) => (
                                            <div key={a.id}>
                                                <Typography variant="body2">
                                                    • {a.tipo}
                                                </Typography>

                                                {a.items?.map((item: any) => (
                                                    <Typography key={item.id} variant="caption">
                                                        - {item.nombre}: {item.resultado}
                                                    </Typography>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 💊 Prescripciones */}
                                {v.prescripciones?.length > 0 && (
                                    <div>
                                        <Typography variant="subtitle2">
                                            Prescripciones
                                        </Typography>

                                        <Stack spacing={1}>
                                            {v.prescripciones.map((p: any) => (
                                                <Typography key={p.id} variant="body2">
                                                    • {p.nombre} — {p.indicaciones}
                                                </Typography>
                                            ))}
                                        </Stack>
                                    </div>
                                )}
                            </Stack>
                        </CardContent>

                        <Divider />
                    </Card>
                );
            })}
        </Stack>
    );
}