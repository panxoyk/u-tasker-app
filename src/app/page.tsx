import {
  getTasksByStatus }
  from '@/actions/task'; 
import HomePage from './HomePage'; // Asegúrate de que la ruta sea correcta

export default async function Page() {
  // Llama a las Server Actions directamente
  const { data: tasksPendiente = [], error: errorPendiente } = await getTasksByStatus(1);
  const { data: tasksEnProceso = [], error: errorEnProceso } = await getTasksByStatus(2);
  const { data: tasksEntregada = [], error: errorEntregada } = await getTasksByStatus(3);
  const { data: tasksVencida = [], error: errorVencida } = await getTasksByStatus(4);

  // Puedes manejar los errores de forma más sofisticada,
  // por ahora, solo logueamos y mostramos un mensaje simple.
  if (errorPendiente) console.error('Error fetching tasks pendiente:', errorPendiente);
  if (errorEnProceso) console.error('Error fetching tasks en proceso:', errorEnProceso);
  if (errorEntregada) console.error('Error fetching tasks entregada:', errorEntregada);
  if (errorVencida) console.error('Error fetching tasks vencida:', errorVencida);

  // Considera un componente de error más amigable si alguno falla
  if (errorPendiente || errorEnProceso || errorEntregada || errorVencida) {
    return (
      <div>
        <p>Hubo un error al cargar algunas tareas. Por favor, inténtalo de nuevo más tarde.</p>
      </div>
    );
  }

  // Pasa los datos obtenidos a HomePage como props
  return (
    <HomePage
      initialTasksPendiente={tasksPendiente}
      initialTasksEnProceso={tasksEnProceso}
      initialTasksEntregada={tasksEntregada}
      initialTasksVencida={tasksVencida}
    />
  );
}