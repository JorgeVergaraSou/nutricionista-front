import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import { Antecedente } from "../../interfaces/patient-full.interface";

type Props = {
  antecedentes: Antecedente[];
};

export default function AntecedentesSection({ antecedentes }: Props) {
  if (!antecedentes || antecedentes.length === 0) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography fontWeight="bold" mb={2}>
            Antecedentes
          </Typography>

          <Typography color="text.secondary">
            Sin antecedentes registrados
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // 🔥 AGRUPAR POR TIPO
  const grouped = antecedentes.reduce((acc: any, item: any) => {
    const tipo = item.tipo || "OTROS";
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(item);
    return acc;
  }, {});

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography fontWeight="bold" mb={2}>
          Antecedentes
        </Typography>

        <Stack spacing={2}>
          {Object.entries(grouped).map(([tipo, items]: any) => (
            <div key={tipo}>
              {/* Tipo */}
              <Typography variant="subtitle2" mb={1}>
                {tipo}
              </Typography>

              {/* Lista */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {items.map((a: any, i: number) => (
                  <Stack key={i} spacing={0.5}>
                    <Chip
                      label={a.titulo}
                      size="small"
                      variant="outlined"
                    />

                    {a.detalle && (
                      <Typography variant="caption" color="text.secondary">
                        {a.detalle}
                      </Typography>
                    )}
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ mt: 2 }} />
            </div>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}