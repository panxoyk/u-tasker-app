'use client';

import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function ErrorPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 500,
            color: 'text.primary',
            mb: 2,
          }}
        >
          Algo salió mal
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </Typography>

        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          component={Link}
          href="/"
          sx={{ textTransform: 'none' }}
        >
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
}
