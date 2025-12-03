// src/layouts/MainLayout.tsx
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
//import DropdownMenu from "../components/NavBars/DropdownMenu";

type Props = {
  children: React.ReactNode;
  left?: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children, left }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",           // 👈 altura mínima de pantalla
        display: "flex",
        flexDirection: "column",     // 👈 orden vertical
      }}
    >
      {/* HEADER */}
    

      {/* CONTENIDO PRINCIPAL OCUPA TODO EL ESPACIO DISPONIBLE */}
      <Box sx={{ flex: 1 }}>        {/* 👈 empuja el footer hacia abajo */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "3fr 9fr" },
              alignItems: "start",
            }}
          >
            {/* IZQUIERDA */}
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
              {left ?? null}
            </Box>

            {/* DERECHA */}
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
              {children}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* FOOTER — SIEMPRE AL FONDO */}
      <Box
        sx={{
          bgcolor: "grey.200",
          py: 2,
          textAlign: "center",
          mt: "auto",            // 👈 fuerza al footer abajo
        }}
      >
        © 2025 — Historia Clínica Nutricional
      </Box>
    </Box>
  );
};

export default MainLayout;
