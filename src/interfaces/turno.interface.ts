import { EstadoTurno } from "../enums/estadoTurno.enum";

export interface PacienteTurno {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
}

export interface Turno {
  id: number;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  estado: EstadoTurno;
  observaciones?: string;
  paciente: PacienteTurno;
}

export interface FormFiltro {
  fecha: string;
}

export interface PropsTurnosTable {
  turnos: Turno[];
  onEdit: (turno: Turno) => void;
  onDelete: (id: number) => void;
}

export interface TurnoForm {
  fecha: string;
  hora: string;
  estado: EstadoTurno;
  observaciones?: string;
  pacienteId: number | null;
}
/**
 * import { EstadoTurno } from "../enums/estadoTurno.enum";

export interface PacienteTurno {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
}

export interface Turno {
  id: number;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  estado: EstadoTurno;
  observaciones?: string;
  paciente: PacienteTurno;
}

export interface TurnoForm {
  fecha: string;
  hora: string;
  estado: EstadoTurno;
  observaciones?: string;
  pacienteId: number;
}

export interface FormFiltro {
  fecha: string;
}

export interface TurnosTableProps {
  turnos: Turno[];
  onEdit: (turno: Turno) => void;
  onDelete: (id: number) => void;
}

 */