import { getAllCoursesFromActivePeriod } from '@/actions/course';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import AddTaskForm from './AddTaskForm';

export default async function AddTaskPage() {
  const { data: courses, error } = await getAllCoursesFromActivePeriod();

  if (error) {
    console.error('Error fetching courses:', error);
    return (
      <Container>
        <Typography variant="h6" color="error">
          Error al cargar los cursos. Por favor, inténtalo de nuevo más tarde.
        </Typography>
      </Container>
    );
  }
}