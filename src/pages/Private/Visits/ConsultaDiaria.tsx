// src/pages/Private/Visits/ConsultaDiaria.tsx
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

import { Turno } from "../../../interfaces/turno.interface";
import { obtenerTurnoPorId } from "../../../services/turnos/turnos.service";
import { crearVisitaFull } from "../../../services/visits/visits.service";

// =========================
// TYPES
// =========================

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
  items: AnalisisItem[];
};

type Prescripcion = {
  nombre: string;
  indicaciones: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export default function ConsultaDiaria() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const turnoId = Number(params.get("turnoId"));

  const [turno, setTurno] = useState<Turno | null>(null);
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
    peso: "",
    talla: "",
  });

  const [prescripciones, setPrescripciones] = useState<Prescripcion[]>([]);
  const [analisis, setAnalisis] = useState<Analisis[]>([]);

  useEffect(() => {
    if (!turnoId) return;

    obtenerTurnoPorId(turnoId)
      .then(({ data }) => setTurno(data))
      .catch(() => setError("No se pudo cargar el turno"))
      .finally(() => setLoading(false));
  }, [turnoId]);

  // =========================
  // IMC
  // =========================

  const imc =
    form.peso !== "" && form.talla !== ""
      ? Number(form.peso) /
        (Number(form.talla) * Number(form.talla))
      : null;

  // =========================
  // FILES
  // =========================

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const valid = Array.from(e.target.files).filter(
      (f) =>
        ALLOWED_TYPES.includes(f.type) &&
        f.size <= MAX_FILE_SIZE
    );

    setFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  // =========================
  // PRESCRIPCIONES
  // =========================

  const addPrescripcion = () =>
    setPrescripciones([...prescripciones, { nombre: "", indicaciones: "" }]);

  const updatePrescripcion = (
    i: number,
    field: keyof Prescripcion,
    value: string
  ) => {
    const copy = [...prescripciones];
    copy[i][field] = value;
    setPrescripciones(copy);
  };

  const removePrescripcion = (i: number) =>
    setPrescripciones(prescripciones.filter((_, idx) => idx !== i));

  // =========================
  // ANALISIS
  // =========================

  const addAnalisis = () =>
    setAnalisis([...analisis, { tipo: "", resultados: "", items: [] }]);

  const removeAnalisis = (i: number) =>
    setAnalisis(analisis.filter((_, idx) => idx !== i));

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

  const updateItem = (
    aIndex: number,
    iIndex: number,
    field: keyof AnalisisItem,
    value: string
  ) => {
    const copy = [...analisis];
    copy[aIndex].items[iIndex][field] = value;
    setAnalisis(copy);
  };

  const removeItem = (aIndex: number, iIndex: number) => {
    const copy = [...analisis];
    copy[aIndex].items.splice(iIndex, 1);
    setAnalisis(copy);
  };

  // =========================
  // GUARDAR (FIX COMPLETO)
  // =========================

  const guardarVisita = async () => {
    if (!turno) return;

    if (!form.motivoConsulta.trim()) {
      setError("Motivo obligatorio");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const dto = {
        patientId: turno.paciente.id,
        turnoId: turno.id,

        motivoConsulta: form.motivoConsulta,
        enfermedadActual: form.enfermedadActual,
        examenFisico: form.examenFisico,
        diagnostico: form.diagnostico,
        planTratamiento: form.planTratamiento,
        evolucion: form.evolucion,
        observaciones: form.observaciones,

        // ANTROPOMETRIA
        antropometria:
          form.peso !== "" || form.talla !== ""
            ? {
                peso:
                  form.peso !== "" ? Number(form.peso) : null,
                talla:
                  form.talla !== "" ? Number(form.talla) : null,
              }
            : undefined,

        // PRESCRIPCIONES (FIX)
        prescripciones:
          prescripciones.length > 0
            ? prescripciones.map((p) => ({
                medicamento: p.nombre,
                dosis: "",
                intervalo: p.indicaciones,
                fechaInicio: null,
                fechaFin: null,
              }))
            : undefined,

        // ANALISIS (FIX COMPLETO)
        analisisBioquimicos:
          analisis.length > 0
            ? analisis.map((a) => ({
                tipo: a.tipo,
                resultados:
                  a.items.length === 0
                    ? a.resultados || null
                    : null,

                items:
                  a.items.length > 0
                    ? a.items.map((i) => ({
                        nombre: i.nombre,

                        valor:
                          i.valor !== ""
                            ? Number(i.valor)
                            : null,

                        unidad: i.unidad || null,

                        valorMin:
                          i.valorMin !== ""
                            ? Number(i.valorMin)
                            : null,

                        valorMax:
                          i.valorMax !== ""
                            ? Number(i.valorMax)
                            : null,
                      }))
                    : [],
              }))
            : undefined,
      };

      console.log("DTO FINAL:", dto);

      await crearVisitaFull(dto, files);

      navigate(`/admin/pacientes/${turno.paciente.id}/history`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // UI
  // =========================

  if (loading) return <CircularProgress />;
  if (!turno) return <Typography>Error</Typography>;

  const { paciente } = turno;

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        Consulta médica
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography>
            {paciente.apellido}, {paciente.nombre}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="Motivo"
              value={form.motivoConsulta}
              onChange={(e) =>
                setForm({ ...form, motivoConsulta: e.target.value })
              }
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Peso (kg)"
                value={form.peso}
                onChange={(e) =>
                  setForm({ ...form, peso: e.target.value })
                }
              />
              <TextField
                label="Talla (m)"
                value={form.talla}
                onChange={(e) =>
                  setForm({ ...form, talla: e.target.value })
                }
              />
            </Stack>

            {imc && <Typography>IMC: {imc.toFixed(2)}</Typography>}

            {/* PRESCRIPCIONES */}
            {prescripciones.map((p, i) => (
              <Stack key={i} direction="row" spacing={1}>
                <TextField
                  label="Medicamento"
                  value={p.nombre}
                  onChange={(e) =>
                    updatePrescripcion(i, "nombre", e.target.value)
                  }
                />
                <TextField
                  label="Indicaciones"
                  value={p.indicaciones}
                  onChange={(e) =>
                    updatePrescripcion(i, "indicaciones", e.target.value)
                  }
                />
                <IconButton onClick={() => removePrescripcion(i)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}

            <Button onClick={addPrescripcion}>+ Medicamento</Button>

            {/* ANALISIS */}
            {analisis.map((a, i) => (
              <Box key={i} sx={{ border: "1px solid #eee", p: 2 }}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Tipo"
                    value={a.tipo}
                    onChange={(e) => {
                      const copy = [...analisis];
                      copy[i].tipo = e.target.value;
                      setAnalisis(copy);
                    }}
                  />
                  <IconButton onClick={() => removeAnalisis(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>

                {a.items.map((item, j) => (
                  <Stack key={j} direction="row" spacing={1}>
                    <TextField
                      label="Nombre"
                      value={item.nombre}
                      onChange={(e) =>
                        updateItem(i, j, "nombre", e.target.value)
                      }
                    />
                    <TextField
                      label="Valor"
                      value={item.valor}
                      onChange={(e) =>
                        updateItem(i, j, "valor", e.target.value)
                      }
                    />
                    <IconButton onClick={() => removeItem(i, j)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}

                <Button onClick={() => addItem(i)}>+ Parámetro</Button>

                {a.items.length === 0 && (
                  <TextField
                    label="Resultados"
                    value={a.resultados}
                    onChange={(e) => {
                      const copy = [...analisis];
                      copy[i].resultados = e.target.value;
                      setAnalisis(copy);
                    }}
                  />
                )}
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