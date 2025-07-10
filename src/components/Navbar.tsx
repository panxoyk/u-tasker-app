"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link"; // Import Link
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip } from "@mui/material"; // Import Tooltip for better UX
import { CalendarMonth, Schedule, Assignment, AccountCircle, Home } from "@mui/icons-material";

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

export default function Navbar() {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState(navigationItems[0]);

  // Detect current section based on pathname
  useEffect(() => {
    const current = navigationItems.find((item) => item.path === pathname) || navigationItems[0];
    setCurrentSection(current);
  }, [pathname]);

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
              <Link href={item.path} passHref legacyBehavior>
                <IconButton
                  color="inherit"
                  aria-label={item.label}
                  sx={{
                    opacity: pathname === item.path ? 1 : 0.7,
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  {item.icon}
                </IconButton>
              </Link>
            </Tooltip>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}