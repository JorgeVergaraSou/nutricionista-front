import { useState } from "react";
import { Turno, TurnoForm } from "../interfaces/turno.interface";
import {
  crearTurno,
  editarTurno as editarTurnoService,
} from "../services/turnos/turnos.service";

interface Props {
  onRefresh: () => void;
}

export function useAgendaTurnos({ onRefresh }: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] =
    useState<Turno | null>(null);
  const [fechaPreseleccionada, setFechaPreseleccionada] =
    useState<string | null>(null);

  // 👉 abrir nuevo turno
  const abrirNuevo = (fecha?: string) => {
    setTurnoSeleccionado(null);
    setFechaPreseleccionada(fecha ?? null);
    setOpenDialog(true);
  };

  // 👉 abrir edición
  const abrirEdicion = (turno: Turno) => {
    setFechaPreseleccionada(null);
    setTurnoSeleccionado(turno);
    setOpenDialog(true);
  };

  // 👉 guardar (crear o editar)
  const guardar = async (data: TurnoForm) => {
    if (turnoSeleccionado) {
      await editarTurnoService(turnoSeleccionado.id, data);
    } else {
      await crearTurno({
        ...data,
        fecha: data.fecha ?? fechaPreseleccionada!,
      });
    }

    setOpenDialog(false);
    onRefresh();
  };

  return {
    openDialog,
    turnoSeleccionado,
    fechaPreseleccionada,

    abrirNuevo,
    abrirEdicion,
    guardar,
    cerrar: () => setOpenDialog(false),
  };
}
