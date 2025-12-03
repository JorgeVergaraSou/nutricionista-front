// src/layouts/PrivateWrapper.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";
import LeftMenu from "./LeftMenu";

const PrivateWrapper: React.FC = () => {
  return (
    <MainLayout left={<LeftMenu />}>
      {/* El Outlet renderiza la ruta hija (página privada seleccionada) */}
      <Outlet />
    </MainLayout>
  );
};

export default PrivateWrapper;
