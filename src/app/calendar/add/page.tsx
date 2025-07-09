import { getAllCoursesFromActivePeriod } from '@/actions/course';
import AddEvaluationForm from '@/app/calendar/AddEvaluationForm'; // Reutilizamos el formulario existente
import { Container, Typography, Box } from '@mui/material';
import { redirect } from 'next/navigation'; // Para redirigir después del éxito

// Este es un Server Component que obtendrá los cursos
export default async function AddEvaluationPage() {
  const { data: courses, error: coursesError } = await getAllCoursesFromActivePeriod();

  if (coursesError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" variant="h6" align="center">
          Error al cargar los cursos: {coursesError}
        </Typography>
      </Container>
    );
  }

  // Si no hay cursos o hay un error, el formulario no puede funcionar.
  // Aquí puedes decidir si mostrar un mensaje o redirigir.
  // En este caso, mostraremos un mensaje si no hay cursos para seleccionar.
  if (!courses || courses.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6" align="center">
          No hay cursos disponibles para añadir una evaluación. Por favor, añade un curso primero.
        </Typography>
      </Container>
    );
  }

  // Función para manejar el éxito del formulario.
  // Esta función se pasa al cliente y luego redirige usando un Server Action.
  async function handleFormSuccess() {
    'use server'; // Aseguramos que la redirección ocurre en el servidor
    redirect('/'); // Redirige a la página principal del calendario
  }

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 10, sm: 11 }, mb: 2 }}>
      <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          Añadir Nueva Evaluación
        </Typography>
        <AddEvaluationForm
          courses={courses}
          coursesError={coursesError}
          onSuccess={handleFormSuccess} // Pasamos la función de éxito
        />
      </Box>
    </Container>
  );
}