// src/utilities/RoutesWithNotFound.utility.tsx
import { Route, Routes, useNavigate } from "react-router-dom";
import { Props } from "../interfaces/not-found.interface";
import { PublicRoutes } from "../models";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function RoutesWithNotFound({ children }: Props) {
  const navigate = useNavigate();

  return (
    <Routes>
      {children}

      {/** =============================== */}
      {/**         RUTA NOT FOUND         */}
      {/** =============================== */}
      <Route
        path="*"
        element={
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#f4fbf4",
              p: 3,
            }}
          >
            <Card
              sx={{
                maxWidth: 420,
                width: "100%",
                p: 3,
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                borderRadius: 4,
                background: "white",
                textAlign: "center",
                border: "1px solid #cfe8cf",
              }}
            >
              <CardContent>
                <ErrorOutlineIcon
                  sx={{ fontSize: 80, color: "#4f6f52", mb: 2 }}
                />

                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#2e7d32", mb: 1 }}
                >
                  Página no encontrada
                </Typography>

                <Typography sx={{ color: "#4f6f52", mb: 3 }}>
                  La página que buscás no existe o fue movida.
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#4f6f52",
                    "&:hover": { backgroundColor: "#3d5840" },
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                  }}
                  onClick={() => navigate(`${PublicRoutes.LOGIN}`)}
                >
                  Ir al Login
                </Button>
              </CardContent>
            </Card>
          </Box>
        }
      />
    </Routes>
  );
}

export default RoutesWithNotFound;
