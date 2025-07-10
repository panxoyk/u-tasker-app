import { getAllCoursesFromActivePeriod } from '@/actions/course';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import AddTaskForm from './AddTaskForm';
import Navbar from '@/components/Navbar';

export default async function AddTaskPage() {
  const { data: courses, error } = await getAllCoursesFromActivePeriod();

  return (
    <div>
      <Navbar />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <AppBar position="fixed" color="primary" sx={{ top: 0, bottom: 'auto' }}>
            <Toolbar>
              <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                Tasks
              </Typography>
            </Toolbar>
          </AppBar>
          <AddTaskForm courses={courses || []} coursesError={error} />
        </Box>
      </Container>
    </div>
  );
}
