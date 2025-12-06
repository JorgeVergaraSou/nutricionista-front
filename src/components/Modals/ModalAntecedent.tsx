// src/components/Modals/ModalAntecedent.tsx
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
  onCreate: (dto: { descripcion: string }) => Promise<void>;
};

const ModalAntecedent: React.FC<Props> = ({ open, onClose, onCreate }) => {
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!descripcion.trim()) return;
    setLoading(true);
    try {
      await onCreate({ descripcion: descripcion.trim() });
      setDescripcion("");
      onClose();
    } catch (err) {
      // dejar que el padre maneje errores si quiere
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !loading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>Agregar antecedente</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            multiline
            rows={3}
            fullWidth
            autoFocus
            disabled={loading}
          />
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

export default ModalAntecedent;
