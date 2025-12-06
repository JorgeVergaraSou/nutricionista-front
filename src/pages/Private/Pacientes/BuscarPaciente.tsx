// src/pages/Private/Admin/BuscarPaciente.tsx
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HealingIcon from "@mui/icons-material/Healing";
import MedicationIcon from "@mui/icons-material/Medication";
import ScienceIcon from "@mui/icons-material/Science";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  autocompletePaciente,
  getPacienteById,
  createAntecedent,
  deleteAntecedent,
  createMedication,
  deleteMedication,
  createBioanalysis,
  deleteBioanalysis,
  createAnthropometric,
  deleteAnthropometric,
} from "../../../services/pacientes/patient.service";



import { PacienteAuto } from "../../../interfaces/patients.interface";
import { formatDate } from "../../../utilities/dateUtils";
import ModalAnthropometric from "../../../components/Modals/ModalAnthropometric";
import ModalBioanalysis from "../../../components/Modals/ModalBioanalysis";
import ModalMedication from "../../../components/Modals/ModalMedication";
import ModalAntecedent from "../../../components/Modals/ModalAntecedent";

function BuscarPaciente() {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<PacienteAuto[]>([]);
  const [selected, setSelected] = useState<PacienteAuto | null>(null);

  const [loadingAuto, setLoadingAuto] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);

  const [pacienteFull, setPacienteFull] = useState<any>(null);

  // Acordeones
  const [openAccordion, setOpenAccordion] = useState<string | false>(false);
  const handleAccordion = (key: string) => setOpenAccordion((prev) => (prev === key ? false : key));

  // Modales
  const [openAntecedentModal, setOpenAntecedentModal] = useState(false);
  const [openMedicationModal, setOpenMedicationModal] = useState(false);
  const [openBioModal, setOpenBioModal] = useState(false);
  const [openAnthroModal, setOpenAnthroModal] = useState(false);

  // AUTOCOMPLETE debounce
  useEffect(() => {
    if (inputValue.trim().length < 1) {
      setOptions([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoadingAuto(true);
      try {
        const results = await autocompletePaciente(inputValue.trim());
        setOptions(results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAuto(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [inputValue]);

  // traer paciente completo
  const fetchPacienteFull = useCallback(async (id: number) => {
    setLoadingFull(true);
    try {
      const data = await getPacienteById(id);
      // en tu backend supongo que el objeto útil está en data (si está en data.data, adaptá)
      setPacienteFull(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFull(false);
    }
  }, []);

  const buscarPacienteCompleto = async () => {
    if (!selected) return;
    await fetchPacienteFull(selected.id);
  };

  // ---------- CREATORS ----------
  const handleCreateAntecedent = async (dto: { descripcion: string }) => {
    if (!pacienteFull?.id) return;
    await createAntecedent(pacienteFull.id, dto);
    // actualizar exclusivamente la sección pidiendo el paciente completo
    await fetchPacienteFull(pacienteFull.id);
  };

  const handleCreateMedication = async (dto: { nombre: string; enfermedadRelacionada?: string | null; detalles?: string | null }) => {
    if (!pacienteFull?.id) return;
    await createMedication(pacienteFull.id, dto);
    await fetchPacienteFull(pacienteFull.id);
  };

  const handleCreateBioanalysis = async (dto: { tipo: string; resultados: string; fecha: string }) => {
    if (!pacienteFull?.id) return;
    await createBioanalysis(pacienteFull.id, dto);
    await fetchPacienteFull(pacienteFull.id);
  };

  const handleCreateAnthropometric = async (dto: any) => {
    if (!pacienteFull?.id) return;
    await createAnthropometric(pacienteFull.id, dto);
    await fetchPacienteFull(pacienteFull.id);
  };

  // ---------- DELETES ----------
  const handleDeleteAntecedent = async (aid: number) => {
    if (!confirm("Eliminar antecedente?")) return;
    await deleteAntecedent(aid);
    await fetchPacienteFull(pacienteFull.id);
  };

  const handleDeleteMedication = async (mid: number) => {
    if (!confirm("Eliminar medicación?")) return;
    await deleteMedication(mid);
    await fetchPacienteFull(pacienteFull.id);
  };

  const handleDeleteBioanalysis = async (bid: number) => {
    if (!confirm("Eliminar análisis?")) return;
    await deleteBioanalysis(bid);
    await fetchPacienteFull(pacienteFull.id);
  };

  const handleDeleteAnthropometric = async (aid: number) => {
    if (!confirm("Eliminar medición?")) return;
    await deleteAnthropometric(aid);
    await fetchPacienteFull(pacienteFull.id);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Buscar Paciente
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Autocomplete
          sx={{ flex: 1 }}
          options={options}
          getOptionLabel={(o) => `${o.nombre} - ${o.dni}`}
          loading={loadingAuto}
          onChange={(_, value) => setSelected(value)}
          onInputChange={(_, value) => setInputValue(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar por nombre, apellido o DNI"
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingAuto ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Button
          variant="contained"
          sx={{ mt: { xs: 1, sm: 0 }, textTransform: "none", bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" } }}
          disabled={!selected || loadingFull}
          onClick={buscarPacienteCompleto}
        >
          {loadingFull ? "Cargando..." : "Traer información completa"}
        </Button>
      </Stack>

      {pacienteFull && (
        <Card sx={{ mt: 4, p: 3, borderRadius: 3, background: "#f6fdf6", border: "1px solid #d7edd7", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1b5e20" }}>
                  {pacienteFull.nombre} {pacienteFull.apellido}
                </Typography>
                <Typography sx={{ color: "#4f6f52" }}>DNI: {pacienteFull.dni}</Typography>
                <Typography sx={{ color: "#4f6f52" }}>Fecha nacimiento: {formatDate(pacienteFull.fechaNacimiento)}</Typography>
                <Typography sx={{ color: "#4f6f52" }}>Teléfono: {pacienteFull.telefono}</Typography>
                <Typography sx={{ color: "#4f6f52" }}>Email: {pacienteFull.email}</Typography>
                <Typography sx={{ color: "#4f6f52" }}>Dirección: {pacienteFull.direccion}</Typography>
                <Typography sx={{ color: "#4f6f52" }}>Actividad física: {pacienteFull.actividadFisica}</Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => { setSelected(null); setPacienteFull(null); setOptions([]); }}>
                  Limpiar
                </Button>
                <Button variant="contained" onClick={() => fetchPacienteFull(pacienteFull.id)} disabled={loadingFull}>
                  Actualizar
                </Button>
              </Stack>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* ------------- ANTECEDENTES ------------- */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Antecedentes
              </Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Agregar">
                  <IconButton size="small" onClick={() => setOpenAntecedentModal(true)}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            <Accordion expanded={openAccordion === "antecedentes"} onChange={() => handleAccordion("antecedentes")} sx={{ mt: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <HealingIcon sx={{ mr: 1, color: "#1b5e20" }} />
                <Typography fontWeight="bold">Ver antecedentes</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {pacienteFull.antecedentes?.length > 0 ? (
                    pacienteFull.antecedentes.map((item: any) => (
                      <ListItem key={item.id} secondaryAction={
                        <IconButton edge="end" onClick={() => handleDeleteAntecedent(item.id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      }>
                        <ListItemIcon>
                          <span style={{ color: "#66bb6a", fontSize: 12 }}>●</span>
                        </ListItemIcon>
                        <ListItemText primary={item.descripcion} />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary">Sin antecedentes</Typography>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* ------------- MEDICACIONES ------------- */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Medicaciones
              </Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Agregar">
                  <IconButton size="small" onClick={() => setOpenMedicationModal(true)}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            <Accordion expanded={openAccordion === "medicaciones"} onChange={() => handleAccordion("medicaciones")} sx={{ mt: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <MedicationIcon sx={{ mr: 1, color: "#1b5e20" }} />
                <Typography fontWeight="bold">Ver medicaciones</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {pacienteFull.medicaciones?.length > 0 ? (
                    pacienteFull.medicaciones.map((item: any) => (
                      <ListItem key={item.id} secondaryAction={
                        <IconButton edge="end" onClick={() => handleDeleteMedication(item.id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      }>
                        <ListItemIcon>
                          <span style={{ color: "#66bb6a", fontSize: 12 }}>●</span>
                        </ListItemIcon>
                        <ListItemText
                          primary={item.nombre}
                          secondary={
                            <>
                              {item.enfermedadRelacionada && <Typography component="span" variant="body2">Relacionada con: {item.enfermedadRelacionada}</Typography>}
                              {item.detalles && <Typography component="span" variant="body2"> {" | "}Detalles: {item.detalles}</Typography>}
                            </>
                          }
                          secondaryTypographyProps={{ component: "span" }}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary">Sin medicaciones</Typography>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* ------------- BIOANÁLISIS ------------- */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Bioanálisis
              </Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Agregar">
                  <IconButton size="small" onClick={() => setOpenBioModal(true)}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            <Accordion expanded={openAccordion === "bioanalisis"} onChange={() => handleAccordion("bioanalisis")} sx={{ mt: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ScienceIcon sx={{ mr: 1, color: "#1b5e20" }} />
                <Typography fontWeight="bold">Ver análisis</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {pacienteFull.analisisBioquimicos?.length > 0 ? (
                    pacienteFull.analisisBioquimicos.map((item: any) => (
                      <ListItem key={item.id} secondaryAction={
                        <IconButton edge="end" onClick={() => handleDeleteBioanalysis(item.id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      }>
                        <ListItemIcon>
                          <span style={{ color: "#66bb6a", fontSize: 12 }}>●</span>
                        </ListItemIcon>
                        <ListItemText
                          primary={`${item.tipo} — ${item.resultados}`}
                          secondary={<Typography variant="body2" component="span">Fecha: {formatDate(item.fecha)}</Typography>}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary">Sin análisis registrados</Typography>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* ------------- MEDICIONES ------------- */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Mediciones antropométricas
              </Typography>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Agregar">
                  <IconButton size="small" onClick={() => setOpenAnthroModal(true)}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            <Accordion expanded={openAccordion === "mediciones"} onChange={() => handleAccordion("mediciones")} sx={{ mt: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <MonitorWeightIcon sx={{ mr: 1, color: "#1b5e20" }} />
                <Typography fontWeight="bold">Ver mediciones</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {pacienteFull.medicionesAntropometricas?.length > 0 ? (
                    pacienteFull.medicionesAntropometricas.map((item: any) => (
                      <ListItem key={item.id} secondaryAction={
                        <IconButton edge="end" onClick={() => handleDeleteAnthropometric(item.id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      }>
                        <ListItemIcon>
                          <span style={{ color: "#66bb6a", fontSize: 12 }}>●</span>
                        </ListItemIcon>

                        <ListItemText
                          primary={`Fecha: ${formatDate(item.fecha)}`}
                          secondary={
                            <>
                              <Typography variant="body2">Talla: {item.talla} m</Typography>
                              <Typography variant="body2">Peso: {item.peso} kg</Typography>
                              <Typography variant="body2">IMC: {item.imc}</Typography>
                              {item.porcentajeGrasa && <Typography variant="body2">% Grasa: {item.porcentajeGrasa}%</Typography>}
                              {item.porcentajeMusculo && <Typography variant="body2">% Músculo: {item.porcentajeMusculo}%</Typography>}
                              {item.porcentajeGrasaABD && <Typography variant="body2">% Grasa ABD: {item.porcentajeGrasaABD}%</Typography>}
                              {item.kcalBasales && <Typography variant="body2">Kcal basales: {item.kcalBasales}</Typography>}
                              {item.circAbdominal && <Typography variant="body2">Circ. abdominal: {item.circAbdominal} cm</Typography>}
                            </>
                          }
                          secondaryTypographyProps={{ component: "span" }}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary">Sin mediciones registradas</Typography>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* MODALES */}
      <ModalAntecedent open={openAntecedentModal} onClose={() => setOpenAntecedentModal(false)} onCreate={handleCreateAntecedent} />
      <ModalMedication open={openMedicationModal} onClose={() => setOpenMedicationModal(false)} onCreate={handleCreateMedication} />
      <ModalBioanalysis open={openBioModal} onClose={() => setOpenBioModal(false)} onCreate={handleCreateBioanalysis} />
      <ModalAnthropometric open={openAnthroModal} onClose={() => setOpenAnthroModal(false)} onCreate={handleCreateAnthropometric} />
    </Box>
  );
}

export default BuscarPaciente;
