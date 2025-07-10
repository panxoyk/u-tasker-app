import Navbar from '@/components/Navbar';
import WeekStats from './timetable/WeekStats';
import { getClassesByDayOfTheWeek } from '@/actions/class';
import { Box, Container, Stack, Typography } from '@mui/material';
import TaskStats from './tasks/TaskStats';
import { getTasksByStatus } from '@/actions/task';

export default async function Page() {
  const daysOfWeek = [1, 2, 3, 4, 5, 6, 7];

  const classesPromises = daysOfWeek.map((day) => getClassesByDayOfTheWeek(day));
  const classesResults = await Promise.all(classesPromises);

  const classesData: { [key: number]: any[] } = {};

  daysOfWeek.forEach((day, index) => {
    const result = classesResults[index];
    classesData[day] = result.success ? result.data || [] : [];
  });
    
  let { data: tasksPendiente = [] } = await getTasksByStatus(1);
  let { data: tasksEnProceso = [] } = await getTasksByStatus(2);
  let { data: tasksEntregada = [] } = await getTasksByStatus(3);
  let { data: tasksVencida = [] } = await getTasksByStatus(4);

  const allTasks = tasksPendiente.concat(tasksEnProceso, tasksEntregada, tasksVencida);

  return (
    <div>
      <Navbar />
      <Container maxWidth="sm">
        <Stack spacing={2}>
          <Box>
            <WeekStats classesData={classesData} />
          </Box>
          <Box>
            <TaskStats tasksData={allTasks || []} />
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
