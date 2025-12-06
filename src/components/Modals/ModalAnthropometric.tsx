// src/components/Modals/ModalAnthropometric.tsx
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
  Box,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (dto: {
    fecha: string;
    talla: string | number;
    peso: string | number;
    imc: string | number;
    porcentajeGrasa?: string | number | null;
    porcentajeMusculo?: string | number | null;
    porcentajeGrasaABD?: string | number | null;
    kcalBasales?: string | number | null;
    circAbdominal?: string | number | null;
  }) => Promise<void>;
};

const ModalAnthropometric: React.FC<Props> = ({ open, onClose, onCreate }) => {
  const [fecha, setFecha] = useState("");
  const [talla, setTalla] = useState("");
  const [peso, setPeso] = useState("");
  const [imc, setImc] = useState("");
  const [porcentajeGrasa, setPorcentajeGrasa] = useState("");
  const [porcentajeMusculo, setPorcentajeMusculo] = useState("");
  const [porcentajeGrasaABD, setPorcentajeGrasaABD] = useState("");
  const [kcalBasales, setKcalBasales] = useState("");
  const [circAbdominal, setCircAbdominal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!fecha || !talla || !peso) return;
    setLoading(true);
    try {
      await onCreate({
        fecha,
        talla,
        peso,
        imc,
        porcentajeGrasa: porcentajeGrasa || null,
        porcentajeMusculo: porcentajeMusculo || null,
        porcentajeGrasaABD: porcentajeGrasaABD || null,
        kcalBasales: kcalBasales || null,
        circAbdominal: circAbdominal || null,
      });

      setFecha("");
      setTalla("");
      setPeso("");
      setImc("");
      setPorcentajeGrasa("");
      setPorcentajeMusculo("");
      setPorcentajeGrasaABD("");
      setKcalBasales("");
      setCircAbdominal("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !loading && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>Agregar medición antropométrica</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled={loading}
          />

          {/* ⭐ Reemplazo del Grid con Box Grid */}
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Talla (m)"
              value={talla}
              onChange={(e) => setTalla(e.target.value)}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Peso (kg)"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              fullWidth
              disabled={loading}
            />
          </Box>

          <TextField
            label="IMC"
            value={imc}
            onChange={(e) => setImc(e.target.value)}
            fullWidth
            disabled={loading}
          />

          {/* Segunda fila de dos columnas */}
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="% Grasa"
              value={porcentajeGrasa}
              onChange={(e) => setPorcentajeGrasa(e.target.value)}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="% Músculo"
              value={porcentajeMusculo}
              onChange={(e) => setPorcentajeMusculo(e.target.value)}
              fullWidth
              disabled={loading}
            />
          </Box>

          <TextField
            label="% Grasa ABD"
            value={porcentajeGrasaABD}
            onChange={(e) => setPorcentajeGrasaABD(e.target.value)}
            fullWidth
            disabled={loading}
          />

          <TextField
            label="Kcal basales"
            value={kcalBasales}
            onChange={(e) => setKcalBasales(e.target.value)}
            fullWidth
            disabled={loading}
          />

          <TextField
            label="Circ. abdominal (cm)"
            value={circAbdominal}
            onChange={(e) => setCircAbdominal(e.target.value)}
            fullWidth
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

export default ModalAnthropometric;
