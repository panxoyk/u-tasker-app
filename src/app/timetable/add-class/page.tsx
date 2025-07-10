import { getAllCoursesFromActivePeriod } from '@/actions/course';
import { Box, Container } from '@mui/material';
import AddClassForm from './AddClassForm';
import Navbar from '@/components/Navbar';

export default async function AddClassPage() {
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
          <AddClassForm courses={courses || []} coursesError={error} />
        </Box>
      </Container>
    </div>
  );
}
