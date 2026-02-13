// src/config/leftMenu.config.tsx
import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
//import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
//import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { PrivateRoutes, Roles } from "../models";

// Tipado del item del menú
export type LeftMenuItem = {
  label: string;
  icon?: React.ReactNode;
  path?: string;
  roles?: Roles[];
  children?: Array<{
    label: string;
    icon?: React.ReactNode;
    path: string;
  }>;
};

export const leftMenuConfig: LeftMenuItem[] = [
  {
    label: "Inicio",
    icon: <DashboardIcon />,
    path: PrivateRoutes.ADMIN,
    roles: [Roles.ADMIN, Roles.USER],
  },
/*
  {
    label: "Usuarios",
    icon: <PeopleIcon />,
    path: "/admin/usuarios",
    roles: [Roles.ADMIN],
  },
*/
  {
    label: "Pacientes",
    icon: <PersonIcon />,
    roles: [Roles.ADMIN, Roles.USER],
    children: [
      {
        label: "Buscar paciente",
        icon: <SearchIcon />,
        path: PrivateRoutes.BUSCAR_PACIENTE,
      },
      {
        label: "Nuevo paciente",
        icon: <AddIcon />,
        path: PrivateRoutes.NUEVO_PACIENTE,
      },
    ],
  },

  {
    label: "Turnos",
    icon: <CalendarMonthIcon />,
    roles: [Roles.ADMIN, Roles.USER],
    children: [
      { label: "Agenda", icon: <SearchIcon />, path: PrivateRoutes.AGENDA_TURNOS },
      { label: "Agenda semanal", icon: <SearchIcon />, path: PrivateRoutes.AGENDA_SEMANAL },
      { label: "Nuevo turno", icon: <AddIcon />, path: PrivateRoutes.TURNOS_GESTION },
    ],
  },
/*
  {
    label: "Configuración",
    icon: <SettingsIcon />,
    path: "/admin/configuracion",
    roles: [Roles.ADMIN],
  },*/
];
