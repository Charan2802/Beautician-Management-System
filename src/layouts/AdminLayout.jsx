import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Button,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 250;

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { text: "Dashboard", path: "/dashboard" },
    { text: "Employees", path: "/employees" },
    { text: "Clients", path: "/clients" },
    { text: "Appointments", path: "/appointments" },
    { text: "Payments", path: "/payments" },
    { text: "Reports", path: "/reports" },
    { text: "Monthly Targets", path: "/monthly-targets" },
    {text: "Attendance",path: "/attendance"},
    {text: "Leaves",path: "/leaves"},
    { text: "Payroll", path: "/payroll" }
  ];

  const drawer = (
    <Box>
      <Typography
        variant="h6"
        sx={{ p: 2, fontWeight: "bold", color: "#e98686" }}
      >
        Beauty ERP
      </Typography>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* TOP BAR */}
      <AppBar position="fixed" sx={{ backgroundColor: "#c186e9", zIndex: 1300 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {name} ({role})
          </Typography>

          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              backgroundColor: "#fff",
              color: "#c186e9",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#f3f3f3" },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}