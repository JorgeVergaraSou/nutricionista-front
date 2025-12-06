// src/components/Modals/ModalBioanalysis.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (dto: { tipo: string; resultados: string; fecha: string }) => Promise<void>;
};

const ModalBioanalysis: React.FC<Props> = ({ open, onClose, onCreate }) => {
  const [tipo, setTipo] = useState("");
  const [resultados, setResultados] = useState("");
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!tipo.trim() || !resultados.trim() || !fecha.trim()) return;
    setLoading(true);
    try {
      await onCreate({ tipo: tipo.trim(), resultados: resultados.trim(), fecha: fecha });
      setTipo("");
      setResultados("");
      setFecha("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !loading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>Agregar análisis bioquímico</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Tipo (ej. Hemograma)" value={tipo} onChange={(e) => setTipo(e.target.value)} fullWidth disabled={loading} />
          <TextField label="Resultados" value={resultados} onChange={(e) => setResultados(e.target.value)} fullWidth disabled={loading} />
          <TextField label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth disabled={loading} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button variant="contained" onClick={handleCreate} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalBioanalysis;
