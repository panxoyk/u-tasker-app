"use client";

import { signout } from "@/actions/auth"
import { useCallback, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Divider,
  Stack,
  Alert,
  InputAdornment,
} from "@mui/material"
import {
  Person as PersonIcon,
  Email as EmailIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material"

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState<string | null>(null)
  const [apellido, setApellido] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const obtenerPerfil = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error, status } = await supabase
        .from("profile")
        .select("name, last_name")
        .eq("user_id", user?.id)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        setNombre(data.name)
        setApellido(data.last_name)
      }
    } catch (err) {
      setError("¡Error al cargar los datos del usuario!")
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    obtenerPerfil()
  }, [obtenerPerfil])

  const obtenerIniciales = () => {
    const n = nombre || ""
    const a = apellido || ""
    return `${n.charAt(0)}${a.charAt(0)}`.toUpperCase()
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box maxWidth="md" sx={{ mx: "auto", p: { xs: 2, md: 3 } }}>
      <Card elevation={3}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: "primary.main", width: 64, height: 64, fontSize: "1.5rem" }}
            >
              {obtenerIniciales() || <PersonIcon />}
            </Avatar>
          }
          title={
            <Typography variant="h4" component="h1" gutterBottom>
              Perfil de Cuenta
            </Typography>
          }
          sx={{ pb: 0 }}
        />

        <CardContent>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 , mb: 3 }}>
            Administra la información de tu cuenta personal.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              label="Correo Electrónico"
              value={user?.email || ""}
              disabled
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Nombre"
              value={nombre || ""}
              disabled
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Apellido"
              value={apellido || ""}
              disabled
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Divider sx={{ my: 3 }} />

            <Box display="flex" justifyContent="flex-end">
              <form action={signout}>
                <Button
                  type="submit"
                  variant="outlined"
                  color="error"
                  startIcon={<ExitToAppIcon />}
                  size="large"
                  sx={{
                    minWidth: 140,
                    "&:hover": {
                      backgroundColor: "error.main",
                      color: "white",
                    },
                  }}
                >
                  Cerrar Sesión
                </Button>
              </form>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
