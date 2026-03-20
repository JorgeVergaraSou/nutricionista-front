import { AntecedentType } from "../enums/antecedentes.enum";

export interface Antecedent {
  id: number;
  tipo: AntecedentType;
  titulo: string;
  detalle?: string | null;
  fechaEvento?: string | null;
}