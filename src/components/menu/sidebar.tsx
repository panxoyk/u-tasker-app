"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import HomeIcon from "@mui/icons-material/Home"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import PeopleIcon from "@mui/icons-material/People"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"

const menuItems = [
  {
    title: "Inicio",
    icon: HomeIcon,
    href: "/",
    active: false,
  },
  {
    title: "Calendario",
    icon: CalendarMonthIcon,
    href: "/",
    active: true,
  },
  {
    title: "Usuarios",
    icon: PeopleIcon,
    href: "/usuarios",
    active: false,
  },
  {
    title: "Configuración",
    icon: SettingsIcon,
    href: "/configuracion",
    active: false,
  },
  {
    title: "Cerrar sesion",
    icon: LogoutIcon,
    href: "/login",
    active: false,
  },
]

const drawerWidth = 240

export function Sidebar() {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(1) // Calendario seleccionado por defecto

  const handleListItemClick = (index: number, href: string) => {
    setSelectedIndex(index)
    router.push(href)
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
          Mi Aplicación
        </Typography>
        <List component="nav" aria-label="main mailbox folders">
          {menuItems.map((item, index) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={() => handleListItemClick(index, item.href)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    "&:hover": {
                      backgroundColor: "primary.light",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <item.icon color={selectedIndex === index ? "primary" : "inherit"} />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    color: selectedIndex === index ? "primary" : "inherit",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}
