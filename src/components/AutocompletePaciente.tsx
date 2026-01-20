import { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { autocompletePaciente } from "../services/pacientes/patient.service";


interface PacienteOption {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
}

interface Props {
  value: PacienteOption | null;
  onChange: (paciente: PacienteOption | null) => void;
}

export default function AutocompletePaciente({
  value,
  onChange,
}: Props) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<PacienteOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputValue.trim().length < 2) {
      setOptions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await autocompletePaciente(inputValue.trim());
        setOptions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <Autocomplete
      options={options}
      value={value}
      loading={loading}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      getOptionLabel={(o) =>
        `${o.apellido}, ${o.nombre} (${o.dni})`
      }
      onInputChange={(_, v) => setInputValue(v)}
      onChange={(_, v) => onChange(v)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Paciente"
          placeholder="Buscar por nombre o DNI"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress size={18} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
