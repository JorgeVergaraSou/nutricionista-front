import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import { EstadoTurno } from "../../../enums/estadoTurno.enum";
import { Turno, TurnoForm } from "../../../interfaces/turno.interface";
import AutocompletePaciente from "../../../components/AutocompletePaciente";


interface Props {
  open: boolean;
  turno: Turno | null;
  onClose: () => void;
  onSave: (data: TurnoForm) => void;
}

export default function TurnoDialog({
  open,
  turno,
  onClose,
  onSave,
}: Props) {
  const { control, handleSubmit, reset, setValue } =
    useForm<TurnoForm>();

  const [paciente, setPaciente] = useState<any>(null);

  useEffect(() => {
    reset({
      fecha: turno?.fecha ?? dayjs().format("YYYY-MM-DD"),
      hora: turno?.hora ?? "",
      estado: turno?.estado ?? EstadoTurno.PENDIENTE,
      observaciones: turno?.observaciones ?? "",
      pacienteId: turno?.paciente?.id ?? 0,
    });

    setPaciente(turno?.paciente ?? null);
  }, [turno, reset]);

  const submit = (data: TurnoForm) => {
    if (!data.pacienteId) return;
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {turno ? "Editar Turno" : "Nuevo Turno"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={2}>
          <AutocompletePaciente
            value={paciente}
            onChange={(p) => {
              setPaciente(p);
              setValue("pacienteId", p?.id ?? 0);
            }}
          />

          <Controller
            name="fecha"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Fecha"
                value={dayjs(field.value)}
                onChange={(v) =>
                  field.onChange(v?.format("YYYY-MM-DD"))
                }
              />
            )}
          />

          <Controller
            name="hora"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Hora" type="time" />
            )}
          />

          <Controller
            name="estado"
            control={control}
            render={({ field }) => (
              <TextField select label="Estado" {...field}>
                {Object.values(EstadoTurno).map((e) => (
                  <MenuItem key={e} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="observaciones"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Observaciones"
                multiline
                rows={3}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit(submit)}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
