// src/components/Modals/ModalMedication.tsx
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
  onCreate: (dto: { nombre: string; enfermedadRelacionada?: string | null; detalles?: string | null }) => Promise<void>;
};

const ModalMedication: React.FC<Props> = ({ open, onClose, onCreate }) => {
  const [nombre, setNombre] = useState("");
  const [enfermedadRelacionada, setEnfermedadRelacionada] = useState("");
  const [detalles, setDetalles] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!nombre.trim()) return;
    setLoading(true);
    try {
      await onCreate({
        nombre: nombre.trim(),
        enfermedadRelacionada: enfermedadRelacionada ? enfermedadRelacionada.trim() : null,
        detalles: detalles ? detalles.trim() : null,
      });
      setNombre("");
      setEnfermedadRelacionada("");
      setDetalles("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !loading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>Agregar medicación</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth disabled={loading} />
          <TextField label="Enfermedad relacionada (opcional)" value={enfermedadRelacionada} onChange={(e) => setEnfermedadRelacionada(e.target.value)} fullWidth disabled={loading} />
          <TextField label="Detalles (opcional)" value={detalles} onChange={(e) => setDetalles(e.target.value)} fullWidth disabled={loading} multiline rows={2} />
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

export default ModalMedication;
