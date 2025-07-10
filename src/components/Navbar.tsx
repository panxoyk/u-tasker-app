// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip } from "@mui/material";
import { CalendarMonth, Schedule, Assignment, AccountCircle, Home } from "@mui/icons-material";

// Define la interfaz para las props de Navbar
interface NavbarProps {
  activePath?: string; // Ahora activePath puede ser un string o undefined
}

const navigationItems = [
  {
    label: "Inicio",
    path: "/",
    icon: <Home />,
    color: "#2196f3", // Light Blue
  },
  {
    label: "Calendario de evaluaciones",
    path: "/calendar",
    icon: <CalendarMonth />,
    color: "#1976d2", // Blue
  },
  {
    label: "Horario de clases",
    path: "/timetable",
    icon: <Schedule />,
    color: "#388e3c", // Green
  },
  {
    label: "Tareas",
    path: "/tasks",
    icon: <Assignment />,
    color: "#f57c00", // Orange
  },
  {
    label: "Cuenta",
    path: "/account",
    icon: <AccountCircle />,
    color: "#7b1fa2", // Purple
  },
];

// Asigna la interfaz a las props del componente
export default function Navbar({ activePath }: NavbarProps) {
  const pathname = usePathname();
  // Usamos el 'activePath' si se provee, de lo contrario, usamos el 'pathname' real
  const currentPathForNavbar = activePath || pathname;

  const [currentSection, setCurrentSection] = useState(navigationItems[0]);

  // Detect current section based on currentPathForNavbar
  useEffect(() => {
    const current = navigationItems.find((item) => item.path === currentPathForNavbar) || navigationItems[0];
    setCurrentSection(current);
  }, [currentPathForNavbar]); // Dependencia del useEffect

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: currentSection.color,
        transition: "background-color 0.3s ease-in-out",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar>
        {/* Current Section Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>{currentSection.icon}</Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: "medium" }}>
            {currentSection.label}
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {navigationItems.map((item) => (
            <Tooltip title={item.label} key={item.path}>
              <IconButton
                component={Link}
                href={item.path}
                color="inherit"
                aria-label={item.label}
                sx={{
                  // Comparamos con el 'currentPathForNavbar' para el resaltado
                  opacity: currentPathForNavbar === item.path ? 1 : 0.7,
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}