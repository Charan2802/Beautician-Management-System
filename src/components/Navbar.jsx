import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const goProfile = () => {
    navigate("/profile");
    handleCloseMenu();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        background:
          "linear-gradient(135deg,#cf7d63,#c186e9)",
      }}
    >
      <Toolbar>

        {/* APP TITLE */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
          Beautician ERP
        </Typography>

        {/* PROFILE BUTTON */}
        <Box>
          <IconButton onClick={handleOpenMenu}>
            <Avatar
              src={user.profileImage || ""}
              sx={{ bgcolor: "#fff", color: "#000" }}
            >
              {!user.profileImage &&
                user.name?.charAt(0)}
            </Avatar>
          </IconButton>

          {/* DROPDOWN MENU */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={goProfile}>
              👤 Profile
            </MenuItem>

            <MenuItem onClick={logout}>
              🚪 Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}