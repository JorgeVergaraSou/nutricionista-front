//src/pages/Private/Visits/ConsultaDiaria.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Autocomplete } from "@mui/material";
import { ANALITOS } from "../../../constants/analitos";
import { Turno } from "../../../interfaces/turno.interface";
import { Patient } from "../../../interfaces/patients.interface";
import { obtenerTurnoPorId } from "../../../services/turnos/turnos.service";
import { crearVisitaFull } from "../../../services/visits/visits.service";
import { calcularEstado } from "../../../utilities/analisis";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;

// ================= HELPERS (PRO) =================

const toNumberOrUndefined = (value: string): number | undefined => {
  if (!value || value.trim() === "") return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
};

const cleanString = (v?: string): string | undefined => {
  if (!v || v.trim() === "") return undefined;
  return v.trim();
};

const isEmpty = (v?: string) => !v || v.trim() === "";

// ================= TYPES =================

type AnalisisItem = {
  nombre: string;
  valor: string;
  unidad: string;
  valorMin: string;
  valorMax: string;

};

type Analisis = {
  tipo: string;
  resultados: string;
  fecha?: string;
  items: AnalisisItem[];
};

type Prescripcion = {
  medicamento: string;
  dosis: string;
  intervalo: string;
  fechaInicio?: string;
  fechaFin?: string;
  activa: boolean;
};

// ================= FILE CONFIG =================

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export default function ConsultaDiaria() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const turnoId = params.get("turnoId");
  const patientId = params.get("patientId");

  const [turno, setTurno] = useState<Turno | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);

  const [form, setForm] = useState({
    motivoConsulta: "",
    enfermedadActual: "",
    examenFisico: "",
    diagnostico: "",
    planTratamiento: "",
    evolucion: "",
    observaciones: "",

    // antropometría completa
    peso: "",
    talla: "",
    circAbdominal: "",
    porcentajeGrasa: "",
    porcentajeGrasaABD: "",
    porcentajeMusculo: "",
    kcalBasales: "",
  });

  const [prescripciones, setPrescripciones] = useState<Prescripcion[]>([]);
  const [analisis, setAnalisis] = useState<Analisis[]>([]);

  // ================= LOAD =================

  useEffect(() => {
    const load = async () => {
      try {
        if (turnoId) {
          const { data } = await obtenerTurnoPorId(Number(turnoId));
          setTurno(data);
          setPatient(data.paciente);
        } else if (patientId) {
          const { data } = await axios.get(
            `${apiUrl}/patients/paciente-simple/${patientId}`
          );
          setPatient(data);
        } else {
          setError("Falta turnoId o patientId");
        }
      } catch {
        setError("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [turnoId, patientId]);

  // ================= IMC =================

  const imc =
    form.peso && form.talla && Number(form.talla) > 0
      ? Number(form.peso) / (Number(form.talla) * Number(form.talla))
      : null;

  // ================= FILES =================

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const valid: File[] = [];
    let hasError = false;

    newFiles.forEach((f) => {
      if (!ALLOWED_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE) {
        hasError = true;
        return;
      }

      const exists = files.some((file) => file.name === f.name);
      if (!exists) valid.push(f);
    });

    if (hasError) setError("Algunos archivos fueron rechazados");

    setFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  // ================= PRESCRIPCIONES =================

  const addPrescripcion = () =>
    setPrescripciones([
      ...prescripciones,
      {
        medicamento: "",
        dosis: "",
        intervalo: "",
        fechaInicio: "",
        fechaFin: "",
        activa: true,
      },
    ]);

  const updatePrescripcion = (
    i: number,
    field: keyof Prescripcion,
    value: string | boolean
  ) => {
    const copy = [...prescripciones];
    (copy[i] as any)[field] = value;
    setPrescripciones(copy);
  };

  const removePrescripcion = (i: number) =>
    setPrescripciones(prescripciones.filter((_, idx) => idx !== i));

  // ================= ANALISIS =================

  const addAnalisis = () =>
    setAnalisis([
      ...analisis,
      {
        tipo: "",
        resultados: "",
        fecha: "",
        items: [],
      },
    ]);

  const addItem = (aIndex: number) => {
    const copy = [...analisis];
    copy[aIndex].items.push({
      nombre: "",
      valor: "",
      unidad: "",
      valorMin: "",
      valorMax: "",

    });
    setAnalisis(copy);
  };

  const removeAnalisis = (i: number) =>
    setAnalisis(analisis.filter((_, idx) => idx !== i));

  const updateItem = (
    aIndex: number,
    iIndex: number,
    field: keyof AnalisisItem,
    value: string
  ) => {
    const copy = [...analisis];
    (copy[aIndex].items[iIndex] as any)[field] = value;
    setAnalisis(copy);
  };
  const removeItem = (aIndex: number, iIndex: number) => {
    const copy = [...analisis];
    copy[aIndex].items.splice(iIndex, 1);
    setAnalisis(copy);
  };

  // ================= VALIDACION =================

  const validar = () => {
    if (!patient) return "Paciente inválido";
    if (isEmpty(form.motivoConsulta)) return "Motivo obligatorio";

    for (const p of prescripciones) {
      if (isEmpty(p.medicamento)) return "Medicamento obligatorio";
      if (isEmpty(p.dosis)) return "Dosis obligatoria";
      if (isEmpty(p.intervalo)) return "Intervalo obligatorio";
    }

    for (const a of analisis) {
      if (isEmpty(a.tipo)) return "Análisis sin tipo";

      if (a.items.length === 0 && isEmpty(a.resultados)) {
        return `El análisis "${a.tipo}" necesita resultados`;
      }

      for (const item of a.items) {
        if (isEmpty(item.nombre)) {
          return `Parámetro sin nombre en "${a.tipo}"`;
        }
      }
    }

    return null;
  };

  // ================= SAVE =================

  const guardarVisita = async () => {
    const err = validar();
    if (err) return setError(err);

    try {
      setSaving(true);
      setError(null);

      const dto = {
        patientId: patient!.id,
        turnoId: turno?.id,

        motivoConsulta: form.motivoConsulta.trim(),

        enfermedadActual: cleanString(form.enfermedadActual),
        examenFisico: cleanString(form.examenFisico),
        diagnostico: cleanString(form.diagnostico),
        planTratamiento: cleanString(form.planTratamiento),
        evolucion: cleanString(form.evolucion),
        observaciones: cleanString(form.observaciones),

        antropometria:
          Object.values({
            peso: form.peso,
            talla: form.talla,
            circAbdominal: form.circAbdominal,
          }).some((v) => v !== "")
            ? {
              peso: toNumberOrUndefined(form.peso),
              talla: toNumberOrUndefined(form.talla),
              circAbdominal: toNumberOrUndefined(form.circAbdominal),
              porcentajeGrasa: toNumberOrUndefined(form.porcentajeGrasa),
              porcentajeGrasaABD: toNumberOrUndefined(
                form.porcentajeGrasaABD
              ),
              porcentajeMusculo: toNumberOrUndefined(
                form.porcentajeMusculo
              ),
              kcalBasales: toNumberOrUndefined(form.kcalBasales),
            }
            : undefined,

        prescripciones:
          prescripciones.length > 0
            ? prescripciones
              .filter((p) => !isEmpty(p.medicamento))
              .map((p) => ({
                medicamento: p.medicamento.trim(),
                dosis: p.dosis.trim(),
                intervalo: p.intervalo.trim(),
                fechaInicio: p.fechaInicio || undefined,
                fechaFin: p.fechaFin || undefined,
                activa: p.activa,
              }))
            : undefined,

        analisisBioquimicos:
          analisis.length > 0
            ? analisis.map((a) => ({
              tipo: a.tipo.trim(),
              fecha: a.fecha || undefined,
              resultados:
                a.items.length === 0
                  ? cleanString(a.resultados)
                  : undefined,
              items:
                a.items.length > 0
                  ? a.items.map((i) => ({
                    nombre: i.nombre.trim(),
                    valor: toNumberOrUndefined(i.valor),
                    unidad: cleanString(i.unidad),
                    valorMin: toNumberOrUndefined(i.valorMin),
                    valorMax: toNumberOrUndefined(i.valorMax),

                  }))
                  : undefined,
            }))
            : undefined,
      };

      await crearVisitaFull(dto, files);

      navigate(`/admin/pacientes/${patient!.id}/history`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  // ================= UI =================

  if (loading) return <CircularProgress />;
  if (!patient) return <Typography>Error</Typography>;

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        Consulta médica
      </Typography>

      {turno && (
        <Typography>
          Turno: {turno.fecha} - {turno.hora}
        </Typography>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography>
            {patient.apellido}, {patient.nombre}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="Motivo de consulta"
              value={form.motivoConsulta}
              onChange={(e) =>
                setForm({ ...form, motivoConsulta: e.target.value })
              }
            />

            <TextField
              label="Enfermedad actual"
              multiline
              value={form.enfermedadActual}
              onChange={(e) =>
                setForm({ ...form, enfermedadActual: e.target.value })
              }
            />

            <TextField
              label="Examen fisico"
              multiline
              value={form.examenFisico}
              onChange={(e) =>
                setForm({ ...form, examenFisico: e.target.value })
              }
            />

            <TextField
              label="Diagnostico"
              value={form.diagnostico}
              onChange={(e) =>
                setForm({ ...form, diagnostico: e.target.value })
              }
            />

            <TextField
              label="Plan de tratamiento"
              multiline
              value={form.planTratamiento}
              onChange={(e) =>
                setForm({ ...form, planTratamiento: e.target.value })
              }
            />

            <TextField
              label="Evolucion"
              multiline
              value={form.evolucion}
              onChange={(e) =>
                setForm({ ...form, evolucion: e.target.value })
              }
            />

            <TextField
              label="Observaciones"
              multiline
              value={form.observaciones}
              onChange={(e) =>
                setForm({ ...form, observaciones: e.target.value })
              }
            />

            <Stack direction="row" spacing={2}>
              {/* ANTROPOMETRIA COMPLETA */}

              <TextField
                label="Peso"
                value={form.peso}
                onChange={(e) =>
                  setForm({ ...form, peso: e.target.value })
                }
              />

              <TextField
                label="Talla"
                value={form.talla}
                onChange={(e) =>
                  setForm({ ...form, talla: e.target.value })
                }
              />
              {imc && <Typography>IMC: {imc.toFixed(2)}</Typography>}
              <TextField
                label="Circ. Abdominal"
                value={form.circAbdominal}
                onChange={(e) =>
                  setForm({ ...form, circAbdominal: e.target.value })
                }
              />

              <TextField
                label="porcentaje de Grasa"
                value={form.porcentajeGrasa}
                onChange={(e) =>
                  setForm({ ...form, porcentajeGrasa: e.target.value })
                }
              />
            </Stack>

            <Stack direction="row" spacing={2}>


              <TextField
                label="porcentaje Grasa ABD"
                value={form.porcentajeGrasaABD}
                onChange={(e) =>
                  setForm({ ...form, porcentajeGrasaABD: e.target.value })
                }
              />

              <TextField
                label="porcentaje Musculo"
                value={form.porcentajeMusculo}
                onChange={(e) =>
                  setForm({ ...form, porcentajeMusculo: e.target.value })
                }
              />
              <TextField
                label="kcal Basales"
                value={form.kcalBasales}
                onChange={(e) =>
                  setForm({ ...form, kcalBasales: e.target.value })
                }
              />
            </Stack>

            {/* PRESCRIPCIONES PRO */}
            <Button onClick={addPrescripcion} variant="outlined">
              + Medicamento
            </Button>
            {prescripciones.map((p, i) => (
              <Box
                key={i}
                sx={{
                  border: "1px solid #eee",
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="Medicamento"
                      fullWidth
                      value={p.medicamento}
                      onChange={(e) =>
                        updatePrescripcion(i, "medicamento", e.target.value)
                      }
                    />

                    <IconButton onClick={() => removePrescripcion(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="Dosis"
                      fullWidth
                      value={p.dosis}
                      onChange={(e) =>
                        updatePrescripcion(i, "dosis", e.target.value)
                      }
                    />

                    <TextField
                      label="Intervalo"
                      fullWidth
                      value={p.intervalo}
                      onChange={(e) =>
                        updatePrescripcion(i, "intervalo", e.target.value)
                      }
                    />
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <TextField
                      type="date"
                      label="Inicio"
                      InputLabelProps={{ shrink: true }}
                      value={p.fechaInicio || ""}
                      onChange={(e) =>
                        updatePrescripcion(i, "fechaInicio", e.target.value)
                      }
                    />

                    <TextField
                      type="date"
                      label="Fin"
                      InputLabelProps={{ shrink: true }}
                      value={p.fechaFin || ""}
                      onChange={(e) =>
                        updatePrescripcion(i, "fechaFin", e.target.value)
                      }
                    />
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Activa</Typography>
                    <input
                      type="checkbox"
                      checked={p.activa}
                      onChange={(e) =>
                        updatePrescripcion(i, "activa", e.target.checked)
                      }
                    />
                  </Stack>
                </Stack>
              </Box>
            ))}

            {/* ANALISIS PRO */}

{analisis.map((a, i) => (
  <Box key={i} sx={{ border: "1px solid #eee", p: 2, borderRadius: 2 }}>
    <Stack spacing={2}>

      {/* HEADER ANALISIS */}
      <Stack direction="row" spacing={1}>
        <TextField
          label="Tipo de análisis"
          fullWidth
          value={a.tipo}
          onChange={(e) => {
            const copy = [...analisis];
            copy[i].tipo = e.target.value;
            setAnalisis(copy);
          }}
        />

        <TextField
          type="date"
          label="Fecha"
          InputLabelProps={{ shrink: true }}
          value={a.fecha || ""}
          onChange={(e) => {
            const copy = [...analisis];
            copy[i].fecha = e.target.value;
            setAnalisis(copy);
          }}
        />

        <IconButton onClick={() => removeAnalisis(i)}>
          <DeleteIcon />
        </IconButton>
      </Stack>

      {/* TABLA CABECERA */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          px: 1,
          py: 0.5,
          borderBottom: "2px solid #ddd",
          fontSize: 12,
          fontWeight: 600,
          color: "text.secondary",
        }}
      >
        <Box sx={{ width: 240 }}>Parámetro</Box>
        <Box sx={{ width: 100 }}>Valor</Box>
        <Box sx={{ width: 90 }}>Estado</Box>
        <Box sx={{ width: 100 }}>Unidad</Box>
        <Box sx={{ width: 120 }}>Mín</Box>
        <Box sx={{ width: 120 }}>Máx</Box>

        {/* BOTÓN AGREGAR EN CABECERA */}
        <Box sx={{ width: 60 }}>
          <Button size="small" onClick={() => addItem(i)}>
            +
          </Button>
        </Box>
      </Stack>

      {/* FILAS */}
      {a.items.map((item, j) => {
        const valorNum = Number(item.valor);
        const minNum = Number(item.valorMin);
        const maxNum = Number(item.valorMax);

        const estado = calcularEstado(
          isNaN(valorNum) ? undefined : valorNum,
          isNaN(minNum) ? undefined : minNum,
          isNaN(maxNum) ? undefined : maxNum
        );

        return (
          <Stack
            key={j}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              px: 1,
              py: 0.5,
              borderBottom: "1px solid #eee",
            }}
          >
            {/* PARAMETRO */}
            <Autocomplete
              sx={{ width: 240 }}
              freeSolo
              options={ANALITOS}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.nombre
              }
              value={item.nombre || ""}
              onChange={(_, newValue) => {
                const copy = [...analisis];

                if (typeof newValue === "string") {
                  copy[i].items[j].nombre = newValue;
                } else if (newValue) {
                  copy[i].items[j].nombre = newValue.nombre;

                  if (newValue.unidad)
                    copy[i].items[j].unidad = newValue.unidad;

                  if (newValue.min != null)
                    copy[i].items[j].valorMin = String(newValue.min);

                  if (newValue.max != null)
                    copy[i].items[j].valorMax = String(newValue.max);
                }

                setAnalisis(copy);
              }}
              renderInput={(params) => (
                <TextField {...params} size="small" placeholder="Parámetro" />
              )}
            />

            {/* VALOR */}
            <TextField
              
              size="small"
              type="number"
              value={item.valor}
              onChange={(e) =>
                updateItem(i, j, "valor", e.target.value)
              }
              sx={{
                width: 100,
                "& .MuiOutlinedInput-root": {
                  color:
                    estado === "ALTO"
                      ? "error.main"
                      : estado === "BAJO"
                      ? "info.main"
                      : estado === "NORMAL"
                      ? "success.main"
                      : "inherit",
                },
              }}
            />

            {/* ESTADO */}
            <Box sx={{ width: 90 }}>
              {estado && (
                <Typography variant="caption">
                  {estado === "ALTO" && "↑ Alto"}
                  {estado === "BAJO" && "↓ Bajo"}
                  {estado === "NORMAL" && "✓ Normal"}
                </Typography>
              )}
            </Box>

            {/* UNIDAD */}
            <TextField
              sx={{ width: 100 }}
              size="small"
              value={item.unidad}
              onChange={(e) =>
                updateItem(i, j, "unidad", e.target.value)
              }
            />

            {/* MIN */}
            <TextField
              sx={{ width: 120 }}
              size="small"
              value={item.valorMin}
              onChange={(e) =>
                updateItem(i, j, "valorMin", e.target.value)
              }
            />

            {/* MAX */}
            <TextField
              sx={{ width: 120 }}
              size="small"
              value={item.valorMax}
              onChange={(e) =>
                updateItem(i, j, "valorMax", e.target.value)
              }
            />

            {/* DELETE */}
            <Box sx={{ width: 60 }}>
              <IconButton onClick={() => removeItem(i, j)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Stack>
        );
      })}

      {/* RESULTADOS LIBRES */}
      {a.items.length === 0 && (
        <TextField
          label="Resultados"
          multiline
          value={a.resultados}
          onChange={(e) => {
            const copy = [...analisis];
            copy[i].resultados = e.target.value;
            setAnalisis(copy);
          }}
        />
      )}

    </Stack>
  </Box>
))}

<Button onClick={addAnalisis}>+ Análisis</Button>

            {/* FILES */}
            <Button component="label">
              Subir archivos
              <input hidden type="file" multiple onChange={handleFilesChange} />
            </Button>

            <List>
              {files.map((f, i) => (
                <ListItem key={i}>
                  <ListItemText primary={f.name} />
                  <IconButton onClick={() => removeFile(i)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>

            <Button
              variant="contained"
              onClick={guardarVisita}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}