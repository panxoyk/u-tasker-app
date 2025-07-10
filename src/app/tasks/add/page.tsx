// app/tareas/add/page.jsx (o donde sea que esté tu AddTaskPage)
import { getAllCoursesFromActivePeriod } from '@/actions/course';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import AddTaskForm from './AddTaskForm';
import Navbar from '@/components/Navbar';

export default async function AddTaskPage() {
  const { data: courses, error } = await getAllCoursesFromActivePeriod();

  return (
    <div>
      {/* Pasamos la prop activePath para que la Navbar muestre la sección 'Tareas' */}
      <Navbar activePath="/tasks" />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <AddTaskForm courses={courses || []} coursesError={error} />
        </Box>
      </Container>
    </div>
  );
}
