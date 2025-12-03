import React, { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link as RouterLink } from "react-router-dom";

import { useSelector } from "react-redux";
import { AppStore } from "../redux/store";
import { leftMenuConfig } from "../config/leftMenu.config";
import { Roles } from "../models";

import useLogout from "../components/Logout/Logout";

const LeftMenu: React.FC = () => {
  const user = useSelector((state: AppStore) => state.user);
  const logout = useLogout();

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Panel
      </Typography>

      <List>
        {leftMenuConfig
          .filter((item) => item.roles?.includes(user.role as Roles))
          .map((item) => (
            <React.Fragment key={item.label}>
              {/* ITEMS SIN SUBMENÚ */}
              {!item.children ? (
                <ListItemButton component={RouterLink} to={item.path!}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ) : (
                <>
                  {/* ITEM PRINCIPAL */}
                  <ListItemButton onClick={() => toggleMenu(item.label)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    {openMenu === item.label ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  {/* SUBMENÚ */}
                  <Collapse in={openMenu === item.label} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children?.map((sub) => (
                        <ListItemButton
                          key={sub.label}
                          sx={{ pl: 4 }}
                          component={RouterLink}
                          to={sub.path!}
                        >
                          <ListItemIcon>{sub.icon}</ListItemIcon>
                          <ListItemText primary={sub.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              )}
            </React.Fragment>
          ))}

        {/* LOGOUT */}
        <ListItemButton
          onClick={logout}
          sx={{ mt: 2, color: "error.main" }}
        >
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default LeftMenu;
