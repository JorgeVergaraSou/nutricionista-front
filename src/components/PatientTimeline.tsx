//src/components/PatientTimeline.tsx
import {
  Box,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { PatientFile } from "../interfaces/patient-file.interface";
import dayjs from "dayjs";
import {
  formatIMC,
  formatPeso,
  formatTalla,
  formatValor,
  formatRango,
  getEstadoColor,
} from "../utilities/clinical-format";
import FileList from "./files/FileList";

type Props = {
  history: any[];
};

const getColor = (tipo: string) => {
  switch (tipo) {
    case "VISITA":
      return "primary";
    case "ANTROPOMETRIA":
      return "success";
    case "ANALISIS":
      return "warning";
    case "PRESCRIPCION":
      return "secondary";
    case "ARCHIVO":
      return "default";
    default:
      return "default";
  }
};

export default function PatientTimeline({ history }: Props) {
  if (!Array.isArray(history)) return null;

  return (
    <Stack spacing={3}>
      {history.map((item, index) => {
        /* =========================
           ADAPTAR ARCHIVOS
        ========================== */
        let files: PatientFile[] = [];

        if (item.tipo === "ARCHIVO") {
          files = [
            {
              id: index,
              filename: item.data?.nombre || "",
              originalName: item.data?.nombre || "",
              mimeType: item.data?.mimeType || "",
              storagePath: item.data?.path || "",
              size: item.data?.size || 0,
              uploadedAt: item.fecha || new Date().toISOString(),
            },
          ];
        }
        return (
          <Card
            key={index}
            sx={{
              borderRadius: 3,
              borderLeft: "6px solid",
              borderColor: `${getColor(item.tipo)}.main`,
            }}
          >
            <CardContent>
              {/* HEADER */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Chip
                  label={item.tipo}
                  color={getColor(item.tipo) as any}
                  size="small"
                />

                <Typography variant="body2" color="text.secondary">
                  {item.fecha
                    ? dayjs(item.fecha).format("DD/MM/YYYY")
                    : "-"}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* VISITA */}
              {item.tipo === "VISITA" && (
                <Box>
                  <Typography>
                    <b>Motivo:</b> {item.data?.motivoConsulta || "-"}
                  </Typography>

                  {item.data?.enfermedadActual && (
                    <Typography>
                      <b>Enfermedad actual:</b> {item.data.enfermedadActual}
                    </Typography>
                  )}

                  {item.data?.examenFisico && (
                    <Typography>
                      <b>Examen físico:</b> {item.data.examenFisico}
                    </Typography>
                  )}

                  <Typography>
                    <b>Diagnóstico:</b> {item.data?.diagnostico || "-"}
                  </Typography>

                  <Typography>
                    <b>Plan:</b> {item.data?.planTratamiento || "-"}
                  </Typography>

                  {item.data?.evolucion && (
                    <Typography>
                      <b>Evolución:</b> {item.data.evolucion}
                    </Typography>
                  )}

                  {item.data?.observaciones && (
                    <Typography>
                      <b>Observaciones:</b> {item.data.observaciones}
                    </Typography>
                  )}

                  {item.data?.turno && (
                    <Typography variant="body2" color="text.secondary">
                      Turno: {item.data.turno.fecha} {item.data.turno.hora}
                    </Typography>
                  )}
                </Box>
              )}

              {/* ANTROPOMETRIA */}
              {item.tipo === "ANTROPOMETRIA" && (
                <Stack spacing={1}>
                  <Stack direction="row" spacing={3}>
                    {item.data?.peso && (
                      <Typography>Peso: {formatPeso(item.data.peso)}</Typography>
                    )}

                    {item.data?.talla && (
                      <Typography>Talla: {formatTalla(item.data.talla)}</Typography>
                    )}

                    {item.data?.imc && (
                      <Typography>IMC: {formatIMC(item.data.imc)}</Typography>
                    )}
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    {item.data?.circAbdominal && (
                      <Typography>
                        Abdomen: {item.data.circAbdominal} cm
                      </Typography>
                    )}

                    {item.data?.porcentajeGrasa && (
                      <Typography>
                        % Grasa: {item.data.porcentajeGrasa}
                      </Typography>
                    )}

                    {item.data?.porcentajeMusculo && (
                      <Typography>
                        % Músculo: {item.data.porcentajeMusculo}
                      </Typography>
                    )}
                  </Stack>

                  {item.data?.kcalBasales && (
                    <Typography>
                      Kcal basales: {item.data.kcalBasales}
                    </Typography>
                  )}
                </Stack>
              )}

              {/* ANALISIS */}
              {item.tipo === "ANALISIS" && (
                <Box>
                  <Typography mb={1}>
                    <b>{item.data?.tipo}</b>
                  </Typography>

                  {/* 🧪 NUEVO: TABLA DE ITEMS */}
                  {Array.isArray(item.data?.items) && item.data.items.length > 0 ? (
                    <Box>
                      {item.data.items.map((it: any, idx: number) => {
                      

                        return (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderBottom: "1px solid #eee",
                              py: 1,
                            }}
                          >
                            <Typography>
                              {it.nombre}
                            </Typography>

                            <Typography>
                              {formatValor(it.valor, it.unidad)}
                            </Typography>

                            {it.valorMin !== null && it.valorMax !== null && (
                              <Typography variant="caption" color="text.secondary">
                                {formatRango(it.valorMin, it.valorMax)}
                              </Typography>
                            )}

                            {it.estado && (
                              <Chip
                                label={it.estado}
                                color={getEstadoColor(it.estado) as any}
                                size="small"
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    /* 🧯 FALLBACK (NO ROMPE NADA) */
                    <Typography variant="body2">
                      {item.data?.resultados || "Sin resultados"}
                    </Typography>
                  )}
                </Box>
              )}

              {/* PRESCRIPCION */}
              {item.tipo === "PRESCRIPCION" && (
                <Box>
                  <Typography>
                    <b>{item.data?.medicamento}</b>
                  </Typography>

                  <Typography>
                    {item.data?.dosis} • {item.data?.intervalo}
                  </Typography>

                  <Chip
                    label={
                      item.data?.activa ? "Activa" : "Finalizada"
                    }
                    color={item.data?.activa ? "success" : "default"}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}

              {/* ARCHIVOS (🔥 NUEVO) */}
              {item.tipo === "ARCHIVO" && files.length > 0 && (
                <Box>
                  <Typography fontWeight={600} mb={1}>
                    Archivo adjunto
                  </Typography>

                  <FileList files={files} />
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}