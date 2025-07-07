import TaskCard from '@/app/tasks/TaskCard';
import {
  getTasksEnProceso,
  getTasksEntregada,
  getTasksPendiente,
  getTasksVencida,
} from '@/actions/task';
import { TaskData } from '@/types/task';
import { Box, Container, Stack, Typography } from '@mui/material';

export default async function TaskList() {
  let { data: tasksPendiente = [], error: errorPendiente } = await getTasksPendiente();
  let { data: tasksEnProceso = [], error: errorEnProceso } = await getTasksEnProceso();
  let { data: tasksEntregada = [], error: errorEntregada } = await getTasksEntregada();
  let { data: tasksVencida = [], error: errorVencida } = await getTasksVencida();

  if (errorPendiente) {
    console.error('Error fetching tasks pendiente:', errorPendiente);
    return <p> Error al cargar tareas pendientes: {errorPendiente} </p>;
  }

  if (errorEnProceso) {
    console.error('Error fetching tasks en proceso:', errorEnProceso);
    return <p> Error al cargar tareas en proceso {errorEnProceso} </p>;
  }

  if (errorEntregada) {
    console.error('Error fetching tasks entregada:', errorEntregada);
    return <p> Error al cargar tareas entregada: {errorEntregada} </p>;
  }

  if (errorVencida) {
    console.error('Error fetching tasks vencida:', errorVencida);
    return <p> Error al cargar tareas vencida: {errorVencida} </p>;
  }

  return (
    <div>
      <Container maxWidth="sm">
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Tareas Pendientes
            </Typography>
            {tasksPendiente.map((taskPendiente: TaskData) => (
              <TaskCard key={taskPendiente.id} task={taskPendiente} />
            ))}
          </Box>
          <Box>
            <Typography variant="h4" gutterBottom>
              Tareas En Proceso
            </Typography>
            {tasksEnProceso.map((taskEnProceso: TaskData) => (
              <TaskCard key={taskEnProceso.id} task={taskEnProceso} />
            ))}
          </Box>
          <Box>
            <Typography variant="h4" gutterBottom>
              Tareas Entregadas
            </Typography>
            {tasksEntregada.map((taskEntregada: TaskData) => (
              <TaskCard key={taskEntregada.id} task={taskEntregada} />
            ))}
          </Box>
          <Box>
            <Typography variant="h4" gutterBottom>
              Tareas Vencidas
            </Typography>
            {tasksVencida.map((taskVencida: TaskData) => (
              <TaskCard key={taskVencida.id} task={taskVencida} />
            ))}
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
