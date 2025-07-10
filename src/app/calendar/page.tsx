import { getEvaluationsByCourse } from '@/actions/evaluation';
import { getAllCoursesFromActivePeriod } from '@/actions/course';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import CircleIcon from '@mui/icons-material/Circle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { EvaluationData } from '@/types/evaluation';
import Navbar from '@/components/Navbar';

export default async function HomePage() {
  const { data: courses, error: coursesError } = await getAllCoursesFromActivePeriod();
  let allEvaluations: EvaluationData[] = [];
  let displayError: string | null = null;

  if (coursesError) {
    console.error('Error al obtener los cursos:', coursesError);
    displayError = `Error al cargar los cursos: ${coursesError}.`;
  } else if (!courses || courses.length === 0) {
    displayError =
      'No hay cursos activos disponibles para gestionar evaluaciones. Por favor, añade un curso primero.';
  } else {
    const evaluationPromises = courses.map((course) => getEvaluationsByCourse(course.id));
    try {
      const results = await Promise.all(evaluationPromises);
      allEvaluations = results.flatMap((result) => {
        if (result.success && result.data) {
          return result.data;
        } else {
          console.error(`Error al obtener evaluaciones para un curso: ${result.error}`);
          return [];
        }
      });
      if (allEvaluations.length === 0 && !displayError) {
        displayError = 'No hay evaluaciones programadas para tus cursos activos.';
      }
    } catch (e: any) {
      console.error('Error inesperado al procesar las evaluaciones:', e);
      displayError = `Ocurrió un error inesperado al cargar las evaluaciones: ${e.message || 'Error desconocido'}.`;
    }
  }

  // Sort evaluations by start_date
  const sortedEvaluations = allEvaluations.sort((a, b) => {
    const dateA = new Date(a.start_date || '');
    const dateB = new Date(b.start_date || '');
    return dateA.getTime() - dateB.getTime();
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatFullDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return 'Sin fechas';
    if (startDate && !endDate) return `Desde ${formatFullDate(startDate)}`;
    if (!startDate && endDate) return `Hasta ${formatFullDate(endDate)}`;

    const start = new Date(startDate!);
    const end = new Date(endDate!);

    if (start.toDateString() === end.toDateString()) {
      return `${formatFullDate(startDate)} (${formatTime(startDate)} - ${formatTime(endDate)})`;
    }

    return `${formatFullDate(startDate)} - ${formatFullDate(endDate)}`;
  };

  const isUpcoming = (startDate?: string) => {
    if (!startDate) return false;
    const now = new Date();
    const evalDate = new Date(startDate);
    const timeDiff = evalDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff <= 24 && hoursDiff > 0;
  };

  const isActive = (startDate?: string, endDate?: string) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return now >= start && now <= end;
    }
    if (start) {
      return now >= start;
    }
    return false;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Page Title and Description */}
        <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              color: '#333333',
              fontWeight: 600,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            Evaluaciones
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666666',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            Gestiona tus evaluaciones académicas
          </Typography>
        </Box>

        {displayError ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                textAlign: 'center',
                maxWidth: 400,
                bgcolor: '#ffffff',
                borderRadius: 2,
                border: 1,
                borderColor: '#e0e0e0',
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 40, color: '#999999', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: '#333333' }}>
                Sin evaluaciones
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666', lineHeight: 1.6 }}>
                {displayError}
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Stack spacing={{ xs: 3, sm: 4 }}>
            {/* Summary */}
            <Box sx={{ textAlign: 'center' }}>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                <Chip
                  label={`${allEvaluations.length} evaluaciones`}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    color: '#666666',
                    borderColor: '#cccccc',
                    bgcolor: '#f8f8f8',
                  }}
                />
                <Chip
                  label={`${courses?.length || 0} cursos`}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    color: '#666666',
                    borderColor: '#cccccc',
                    bgcolor: '#f8f8f8',
                  }}
                />
                {sortedEvaluations.filter((e) => isUpcoming(e.start_date)).length > 0 && (
                  <Chip
                    label={`${sortedEvaluations.filter((e) => isUpcoming(e.start_date)).length} próximas`}
                    size="small"
                    sx={{
                      bgcolor: '#2563eb',
                      color: '#ffffff',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    }}
                  />
                )}
              </Stack>
            </Box>

            {/* Evaluations List */}
            {sortedEvaluations.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, sm: 6 },
                  textAlign: 'center',
                  bgcolor: '#ffffff',
                  borderRadius: 2,
                  border: 1,
                  borderColor: '#e0e0e0',
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 48, color: '#999999', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#333333', mb: 1, fontWeight: 500 }}>
                  Sin evaluaciones
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666' }}>
                  Añade tu primera evaluación para comenzar
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={{ xs: 2, sm: 3 }}>
                {sortedEvaluations.map((evaluation: EvaluationData) => (
                  <Card
                    key={evaluation.id}
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      border: 1,
                      borderColor: '#e0e0e0',
                      bgcolor: '#ffffff',
                      '&:hover': {
                        borderColor: '#2563eb',
                        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Stack spacing={{ xs: 2, sm: 3 }}>
                        {/* Header */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: '#333333',
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                mb: 0.5,
                              }}
                            >
                              {evaluation.title}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <SchoolIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#666666',
                                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                }}
                              >
                                {evaluation.course.name}
                              </Typography>
                            </Stack>
                          </Box>

                          <Stack direction="row" spacing={1}>
                            {isActive(evaluation.start_date, evaluation.end_date) && (
                              <Chip
                                icon={
                                  <CircleIcon
                                    sx={{ fontSize: '12px !important', color: '#10b981' }}
                                  />
                                }
                                label="Activa"
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                                  color: '#10b981',
                                  fontSize: '0.75rem',
                                  height: 24,
                                  border: 1,
                                  borderColor: 'rgba(16, 185, 129, 0.3)',
                                }}
                              />
                            )}
                            {isUpcoming(evaluation.start_date) && (
                              <Chip
                                label="Próxima"
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(37, 99, 235, 0.1)',
                                  color: '#2563eb',
                                  fontSize: '0.75rem',
                                  height: 24,
                                  border: 1,
                                  borderColor: 'rgba(37, 99, 235, 0.3)',
                                }}
                              />
                            )}
                          </Stack>
                        </Box>

                        <Divider sx={{ borderColor: '#e0e0e0' }} />

                        {/* Date and Time Info */}
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <EventIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                            <Box>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 500,
                                  color: '#333333',
                                  fontSize: { xs: '0.9rem', sm: '1rem' },
                                }}
                              >
                                {formatDate(evaluation.start_date)}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#666666',
                                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                                }}
                              >
                                {formatDateRange(evaluation.start_date, evaluation.end_date)}
                              </Typography>
                            </Box>
                          </Box>

                          {formatTime(evaluation.start_date) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <AccessTimeIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#666666',
                                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                }}
                              >
                                {formatTime(evaluation.start_date)}
                                {evaluation.end_date &&
                                  evaluation.start_date !== evaluation.end_date &&
                                  ` - ${formatTime(evaluation.end_date)}`}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </Container>

      {/* Floating Action Button for Add Evaluation - Now stuck to the very bottom */}
      {courses && courses.length > 0 && !coursesError && (
        <Link href="/calendar/add" passHref>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              position: 'fixed',
              bottom: 16, // Changed from 80 to 16 to be closer to the bottom edge
              right: 16,
              borderRadius: '28px',
              padding: '10px 24px',
              zIndex: 1100,
              textTransform: 'none',
              fontWeight: 500,
              bgcolor: '#2563eb',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              '&:hover': {
                bgcolor: '#1d4ed8',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
              },
            }}
          >
            Añadir Evaluación
          </Button>
        </Link>
      )}
    </Box>
  );
}