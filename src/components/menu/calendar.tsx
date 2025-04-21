"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Typography from "@mui/material/Typography"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { green, blueGrey } from "@mui/material/colors"

// Define un tema de colores personalizado
const theme = createTheme({
  palette: {
    primary: green,
    secondary: blueGrey,
    background: {
      default: "#f4f6f8",
      paper: "#fff",
    },
    text: {
      primary: "#333",
      secondary: "#777",
    },
  },
  typography: {
    h6: {
      fontWeight: 500,
      fontSize: "1.1rem",
    },
    body2: {
      fontSize: "0.9rem",
      color: blueGrey[600],
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0,0,0,0.08)",
          borderRadius: 8,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          backgroundColor: green[50],
          padding: "16px",
        },
        title: {
          color: green[800],
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // Estilos generales del TextField si es necesario
        },
      },
    },
  },
})

export function Calendar() {
  const [date, setDate] = useState<Date | null>(new Date())

  // Eventos de ejemplo
  const events = [
    {
      title: "Reunión de equipo",
      date: new Date(),
      time: "10:00 - 11:30",
    },
    {
      title: "Almuerzo con clientes",
      date: new Date(),
      time: "13:00 - 14:30",
    },
    {
      title: "Revisión de proyecto",
      date: addDays(new Date(), 1),
      time: "15:00 - 16:00",
    },
  ]

  // Filtrar eventos para la fecha seleccionada
  const filteredEvents = events.filter(
    (event) => date && format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"),
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
          <Box sx={{ maxWidth: 320 }}>
            <DatePicker
              label="Selecciona una fecha"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
          </Box>

          {/* Solución alternativa usando Box con flexbox en lugar de Grid */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <Box key={index} sx={{ width: { xs: "100%", sm: "45%", md: "30%" }, flexGrow: 1 }}>
                  <Card sx={{ height: "100%" }}>
                    <CardHeader
                      title={event.title}
                      subheader={event.time}
                      titleTypographyProps={{ variant: "h6" }}
                      subheaderTypographyProps={{ variant: "body2" }}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {format(event.date, "EEEE, d 'de' MMMM", { locale: es })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))
            ) : (
              <Box sx={{ width: "100%" }}>
                <Card>
                  <CardHeader
                    title="No hay eventos"
                    subheader={
                      date
                        ? `No hay eventos programados para ${format(date, "EEEE, d 'de' MMMM", { locale: es })}`
                        : "Selecciona una fecha para ver eventos"
                    }
                    titleTypographyProps={{ variant: "h6" }}
                    subheaderTypographyProps={{ variant: "body2" }}
                  />
                </Card>
              </Box>
            )}
          </Box>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  )
}
