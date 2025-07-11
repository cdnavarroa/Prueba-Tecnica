"use client"

import React, { useEffect, useState } from "react";
import ProjectsOverview from "./ProjectsOverview";
import TasksOverview from "./TasksOverview";
import ProjectsOverviewKPI from "./ProjectsOverviewKPI";
import TasksOverviewKPI from "./TasksOverviewKPI";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Avatar,
  Button
} from "@mui/material";
import CommentsNotificationBadge from "./tasks/CommentsNotificationBadge";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 220;

export default function Dashboard({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

   const drawer = (
    <div>
      <Toolbar />
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
        <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: "#2f70aa" }}>
          {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2f70aa" }}>
          {user?.name || user?.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>
      <List sx={{ mt: 4 }}>
        <ListItem button selected onClick={() => router.push("/dashboard")}>
          <ListItemIcon>
            <DashboardIcon sx={{ color: "#2f70aa" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => router.push("/dashboard/tasks")}>
          <ListItemIcon>
            <AssignmentIcon sx={{ color: "#2f70aa" }} />
            </ListItemIcon>
            <ListItemText primary="Tareas" />
        </ListItem>
        <ListItem button onClick={() => router.push("/dashboard/projects")}>
          <ListItemIcon>
            <AssignmentIcon sx={{ color: "#2f70aa" }} />
          </ListItemIcon>
          <ListItemText primary="Proyectos" />
        </ListItem>
        <ListItem button onClick={() => router.push("/dashboard/teams")}>
          <ListItemIcon>
            <GroupIcon sx={{ color: "#2f70aa" }} />
          </ListItemIcon>
          <ListItemText primary="Equipos" />
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Button
        startIcon={<LogoutIcon />}
        sx={{ m: 2, color: "#2f70aa", borderColor: "#2f70aa" }}
        variant="outlined"
        onClick={handleLogout}
        
      >
        Cerrar sesión
      </Button>
    </div>
  );

  return (

    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#2f70aa"
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          {user && <CommentsNotificationBadge userId={user.id} />}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
        

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#f5f8fa",
          minHeight: "100vh"
        }}
      >
        <Toolbar />
        {children ? children : (
          <>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mb: 4 }}>
              {/* Resumen usuario y KPIs */}
              <Box sx={{ flex: 1, minWidth: 260, bgcolor: "white", borderRadius: 2, p: 3, boxShadow: 1 }}>
                <Typography variant="h4" sx={{ color: "#2f70aa", fontWeight: "bold", mb: 1 }}>
                  ¡Bienvenido, {user?.name || user?.email || "Usuario"}!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Aquí podrás gestionar tus proyectos, tareas y equipos.
                </Typography>
                {/* KPIs */}
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Box sx={{ bgcolor: "#e3f2fd", borderRadius: 2, p: 2, flex: 1, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ color: "#2f70aa", fontWeight: "bold" }}>Proyectos</Typography>
                    <ProjectsOverviewKPI />
                  </Box>
                  <Box sx={{ bgcolor: "#fce4ec", borderRadius: 2, p: 2, flex: 1, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ color: "#c2185b", fontWeight: "bold" }}>Tareas</Typography>
                    <TasksOverviewKPI />
                  </Box>
                </Box>
              </Box>
              {/* Sección Proyectos */}
              <Box sx={{ flex: 2, bgcolor: "white", borderRadius: 2, p: 3, boxShadow: 1 }}>
                <Typography variant="h5" sx={{ color: "#1e4976", fontWeight: "bold", mb: 2 }}>
                  Proyectos recientes
                </Typography>
                <ProjectsOverview limit={3} />
              </Box>
            </Box>
            {/* Sección Tareas */}
            <Box sx={{ bgcolor: "white", borderRadius: 2, p: 3, boxShadow: 1 }}>
              <Typography variant="h5" sx={{ color: "#1e4976", fontWeight: "bold", mb: 2 }}>
                Tareas asignadas {user ? `(${user.name})` : ''}
              </Typography>
              <TasksOverview limit={6} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
