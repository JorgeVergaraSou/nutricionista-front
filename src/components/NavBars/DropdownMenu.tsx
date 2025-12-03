import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import { AppStore } from "../../redux/store";
import { PrivateRoutes, Roles } from "../../models";
import { getRoleRoute } from "../../utilities";
import useLogout from "../Logout/Logout";

type MenuItemType = {
  name: string;
  links?: { label: string; path: string }[];
};

const menuItems: MenuItemType[] = [

  {
    name: "Item 2",
    links: [
      { label: "Link 3", path: "/link3" },
      { label: "Link 4", path: "/link4" },
    ],
  },

  {
    name: "Perfil",
    links: [
      { label: "Perfil", path: PrivateRoutes.PERFIL },
      { label: "Cerrar sesión", path: PrivateRoutes.LOGOUT },
    ],
  },
];

const DropdownMenu: React.FC = () => {
  const user = useSelector((state: AppStore) => state.user);
  const roleRoute = getRoleRoute(user.role as Roles);

  const logOut = useLogout();

  // estado para los dropdowns
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenu, setCurrentMenu] = useState<string | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, menu: string) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menu);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  const handleLinkClick = (path: string) => {
    if (path === PrivateRoutes.LOGOUT) {
      logOut();
      return;
    }
    handleCloseMenu();
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* INICIO */}
        <Button color="inherit" component={Link} to={roleRoute}>
          INICIO
        </Button>

        {/* MENÚS */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {menuItems.map(
            (item) =>
              (item.name !== "Configuraciones" || user.role === Roles.ADMIN) && (
                <div key={item.name}>
                  <Button
                    color="inherit"
                    onClick={(e) => handleOpenMenu(e, item.name)}
                  >
                    {item.name}
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={currentMenu === item.name}
                    onClose={handleCloseMenu}
                  >
                    {item.links?.map((link) => (
                      <MenuItem
                        key={link.path}
                        component={Link}
                        to={link.path}
                        onClick={() => handleLinkClick(link.path)}
                      >
                        {link.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              )
          )}
        </Box>

        {/* MENU MOBILE */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" } }}
          color="inherit"
          onClick={(e) => handleOpenMenu(e, "mobile")}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={currentMenu === "mobile"}
          onClose={handleCloseMenu}
        >
          {menuItems.map((item) =>
            (item.name !== "Configuraciones" || user.role === Roles.ADMIN) ? (
              <Box key={item.name}>
                <Typography sx={{ px: 2, py: 1, fontWeight: "bold" }}>
                  {item.name}
                </Typography>
                {item.links?.map((link) => (
                  <MenuItem
                    key={link.path}
                    component={Link}
                    to={link.path}
                    onClick={() => handleLinkClick(link.path)}
                  >
                    {link.label}
                  </MenuItem>
                ))}
              </Box>
            ) : null
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default DropdownMenu;
