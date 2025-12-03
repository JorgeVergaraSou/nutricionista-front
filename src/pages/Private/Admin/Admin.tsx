// src/pages/Private/Admin/AdminPage.tsx
import { useSelector } from "react-redux";
import { AppStore } from "../../../redux/store";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

function AdminPage() {
  const user = useSelector((state: AppStore) => state.user);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Bienvenido, {user?.name ?? "Usuario"}
      </Typography>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Información del administrador
          </Typography>
          <Typography variant="body1">📧 Correo: {user?.email}</Typography>
          <Typography variant="body1">🛡️ Rol: {user?.role}</Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            Elemento 1
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            ADMIN PAGE
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            Elemento 3
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminPage;
