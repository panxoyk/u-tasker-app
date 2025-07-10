import { getTasksByStatus } from '@/actions/task';
import { Container } from '@mui/material';
import TaskCarousel from '@/app/tasks/TaskCarousel';
import Navbar from '@/components/Navbar';

export default async function TasksPage() {
  let { data: tasksPendiente = [], error: errorPendiente } = await getTasksByStatus(1);
  let { data: tasksEnProceso = [], error: errorEnProceso } = await getTasksByStatus(2);
  let { data: tasksEntregada = [], error: errorEntregada } = await getTasksByStatus(3);
  let { data: tasksVencida = [], error: errorVencida } = await getTasksByStatus(4);

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
      <Navbar />
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
