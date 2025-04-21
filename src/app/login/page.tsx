"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Alert,
  AlertTitle,
  IconButton,
  CircularProgress,
  Link,
  Box,
} from "@mui/material";
import { MenuBook, Lock, ErrorOutline, Token } from "@mui/icons-material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { amber, deepOrange, teal } from "@mui/material/colors";

// Define un tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: teal[500], // Un verde azulado vibrante
      contrastText: "#fff",
    },
    secondary: {
      main: amber[700], // Un amarillo ámbar llamativo
      contrastText: "#fff",
    },
    error: {
      main: deepOrange[500],
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif", // Una fuente moderna y legible
    h5: {
      fontWeight: 600,
      marginBottom: "8px",
    },
    subtitle1: {
      fontSize: "1.1rem",
      color: teal[300],
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Bordes más redondeados
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Sombra sutil
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          backgroundColor: teal[500],
          padding: "16px 24px",
        },
        title: {
          color: "#fff",
          fontSize: "1.5rem",
        },
        subheader: {
          color: teal[100],
          fontSize: "0.9rem",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "12px 24px",
          fontWeight: 600,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: "16px",
        },
      },
    },
  },
});

const LogoContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

const LogoIcon = styled(MenuBook)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.secondary.main, // Amarillo para el logo
}));

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña");
      return;
    }

    setIsLoading(true);

    try {
      // Simulación de inicio de sesión
      await new Promise((resolve) => setTimeout(resolve, 1500));

      localStorage.setItem("Token", "test")

      // Redireccionar al dashboard después del login exitoso
      router.push("/menu");
  

      // Por ahora, mostraremos un error de demostración
      setError("Funcionalidad en desarrollo. Este es solo un prototipo.");
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: teal[50], // Un fondo muy claro
          padding: (theme) => theme.spacing(3),
        }}
      >
        <Card sx={{ maxWidth: 400 }}>
          <CardHeader
            title={
              <Typography variant="h5" component="div" align="center">
                <LogoContainer>
                  <LogoIcon />
                </LogoContainer>
                UTASKER
              </Typography>
            }
          />
          <CardContent sx={{ padding: (theme) => theme.spacing(3) }}>
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" icon={<ErrorOutline />}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                id="email"
                label="Correo electrónico"
                type="email"
                placeholder="usuario@universidad.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                id="password"
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <Link href="#" variant="body2" color="primary">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Lock />}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
          <CardActions sx={{ flexDirection: "column", alignItems: "center", padding: (theme) => theme.spacing(3) }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              ¿No tienes una cuenta?{" "}
              <Link href="#" variant="subtitle2" color="secondary">
                Regístrate aquí
              </Link>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} UTASKER
            </Typography>
          </CardActions>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;