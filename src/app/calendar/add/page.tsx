import { getAllCoursesFromActivePeriod } from '@/actions/course';
import AddEvaluationForm from '@/app/calendar/AddEvaluationForm';
import { Container, Typography, Box, Paper, Stack } from '@mui/material';
import { redirect } from 'next/navigation';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SchoolIcon from '@mui/icons-material/School';
import Navbar from '@/components/Navbar';

export default async function AddEvaluationPage() {
  const { data: courses, error: coursesError } = await getAllCoursesFromActivePeriod();

  async function handleFormSuccess() {
    'use server';
    redirect('/calendar');
  }

  if (coursesError) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 500, color: 'text.primary', mb: 2 }}
            >
              Error al cargar los cursos
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              {coursesError}
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <SchoolIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 500, color: 'text.primary', mb: 2 }}
            >
              No hay cursos disponibles
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              No hay cursos activos disponibles para añadir una evaluación. Por favor, añade un
              curso primero.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar activePath="/calendar" />
      <Container maxWidth="sm">
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center', pt: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <CalendarTodayIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography
                variant="h4"
                component="h1"
                sx={{ color: 'text.primary', fontWeight: 600, letterSpacing: '-0.025em' }}
              >
                Añadir Nueva Evaluación
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 400, mx: 'auto' }}>
              Programa una nueva evaluación para tus cursos activos
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 4 }}>
              <AddEvaluationForm
                courses={courses || []}
                coursesError={coursesError}
                onSuccess={handleFormSuccess}
              />
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
