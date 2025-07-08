import {
  getTasksEnProceso,
  getTasksEntregada,
  getTasksPendiente,
  getTasksVencida,
} from '@/actions/task';
import { Container } from '@mui/material';
import TaskCarousel from '@/app/tasks/TaskCarousel';

export default async function TasksPage() {
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
        <TaskCarousel
          tasksPendiente={tasksPendiente}
          tasksEnProceso={tasksEnProceso}
          tasksEntregada={tasksEntregada}
          tasksVencida={tasksVencida}
        />
      </Container>
    </div>
  );
}
