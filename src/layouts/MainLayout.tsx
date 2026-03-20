// src/layouts/MainLayout.tsx
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

type Props = {
  children: React.ReactNode;
  left?: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children, left }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default", // usa el theme
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Box
            sx={{
              display: "grid",
              gap: 4,
              gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
            }}
          >
            {/* SIDEBAR */}
            <Box
              sx={{
                p: 3,
                bgcolor: "#f4f6f8",
                
                borderRadius: 4,
                boxShadow: 3,
              }}
            >
              {left ?? null}
            </Box>

            {/* CONTENIDO */}
            <Box
              sx={{
                p: 4,
                bgcolor: "background.paper",
                borderRadius: 4,
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              }}
            >
              {children}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 2,
          textAlign: "center",
          mt: "auto",
        }}
      >
        © 2025 — Historia Clínica Nutricional
      </Box>
    </Box>
  );
};

export default MainLayout;