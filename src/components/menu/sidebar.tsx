"use client"

import { useRouter } from "next/navigation"
// Ya no necesitamos useState para el índice seleccionado aquí
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
import PeopleIcon from "@mui/icons-material/People" // Asegúrate de tener estos si los usas
import SettingsIcon from "@mui/icons-material/Settings" // Asegúrate de tener estos si los usas
import LogoutIcon from "@mui/icons-material/Logout"

// --- 1. Definición del Tipo (Asegúrate que coincida con Home.tsx) ---
// Puedes importarlo desde Home si lo defines allí, o definirlo aquí.
// Es importante que sea consistente.
type SelectedView = 'inicio' | 'calendario' | null;
// Nota: Agregué 'clientes' y 'configuracion' como ejemplos, ajústalos a tus necesidades.

// --- 2. Definición de Items del Menú ---
// Añadimos un campo 'type' para diferenciar si cambia la vista o navega.
const menuItems = [
    {
        title: "Inicio",
        icon: HomeIcon,
        // href: "/menu", // El href puede ser opcional si solo cambia la vista
        key: "inicio" as SelectedView, // Usamos 'key' como identificador único
        type: "view" // Este item cambia la vista dentro de Home
    },
    {
        title: "Calendario",
        icon: CalendarMonthIcon,
        // href: "/menu",
        key: "calendario" as SelectedView,
        type: "view"
    },
    // --- Agrega aquí otros items que cambian la vista ---
    // {
    //     title: "Clientes",
    //     icon: PeopleIcon,
    //     key: "clientes" as SelectedView,
    //     type: "view"
    // },
    // {
    //     title: "Configuración",
    //     icon: SettingsIcon,
    //     key: "configuracion" as SelectedView,
    //     type: "view"
    // },
    // --- Items de navegación ---
    {
        title: "Cerrar sesión",
        icon: LogoutIcon,
        href: "/login", // Este sí necesita un href para navegar
        key: "cerrar-sesion", // No necesita ser del tipo SelectedView necesariamente
        type: "navigation" // Este item navega a otra página
    },
]

const drawerWidth = 240

// --- 3. Props del Componente ---
interface SidebarProps {
    onSelectItem: (view: SelectedView) => void; // Función para notificar al padre
    currentSelection: SelectedView | null;        // Vista seleccionada actualmente (viene del padre)
}

// --- 4. Componente Sidebar Modificado ---
export function Sidebar({ onSelectItem, currentSelection }: SidebarProps) {
  const router = useRouter()
  // Ya no usamos useState para selectedIndex

  // --- 5. Manejador de Clic Modificado ---
  const handleListItemClick = (item: typeof menuItems[0]) => {
    if (item.type === "view") {
      // Si es un item de vista, llama a la función del padre
      onSelectItem(item.key as SelectedView); // Aseguramos el tipo aquí
      // Opcional: Si quieres que la URL cambie también (sin recargar la página)
      // podrías usar router.push('/menu?view=' + item.key, undefined, { shallow: true });
      // o simplemente dejar que el padre maneje todo.
    } else if (item.type === "navigation" && item.href) {
      // Si es un item de navegación, usa el router para ir a la página
      router.push(item.href);
    }
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
          UTASKER
        </Typography>
        <List component="nav" aria-label="main mailbox folders">
          {menuItems.map((item) => {
            // --- 6. Determinar si está seleccionado usando la prop ---
            // Solo los items tipo 'view' pueden estar seleccionados en este contexto
            const isSelected = item.type === 'view' && currentSelection === item.key;

            return (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  // Usar isSelected para la prop 'selected'
                  selected={isSelected}
                  onClick={() => handleListItemClick(item)} // Llama al manejador modificado
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    "&.Mui-selected": {
                      backgroundColor: "primary.light", // O el color que prefieras
                      "&:hover": {
                        backgroundColor: "primary.light", // Mantener color al hacer hover si está seleccionado
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    {/* Colorear el icono basado en isSelected */}
                    <item.icon color={isSelected ? "primary" : "inherit"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      // Colorear el texto basado en isSelected
                      color: isSelected ? "primary" : "inherit",
                      fontWeight: isSelected ? 'bold' : 'normal', // Opcional: poner en negrita
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  )
}