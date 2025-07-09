import { createClient } from '@/utils/supabase/server'; // Se usa el cliente de servidor
import {
  getTasksEnProceso,
  getTasksEntregada,
  getTasksPendiente,
  getTasksVencida,
} from '@/actions/task';
import HomePage from './HomePage';

export default async function Page() {
  const supabase = createClient();
  
  // 1. OBTENCIÓN DE DATOS EN PARALELO
  // Usamos Promise.all para ejecutar todas las promesas simultáneamente.
  const [
    userResponse,
    tasksPendienteResult,
    tasksEnProcesoResult,
    tasksEntregadaResult,
    tasksVencidaResult,
  ] = await Promise.all([
    (await supabase).auth.getUser(), // Obtenemos el usuario en el servidor
    getTasksPendiente(),
    getTasksEnProceso(),
    getTasksEntregada(),
    getTasksVencida(),
  ]);

  // Extraemos los datos y errores de cada resultado
  const { data: { user } } = userResponse;
  const { data: tasksPendiente = [], error: errorPendiente } = tasksPendienteResult;
  const { data: tasksEnProceso = [], error: errorEnProceso } = tasksEnProcesoResult;
  const { data: tasksEntregada = [], error: errorEntregada } = tasksEntregadaResult;
  const { data: tasksVencida = [], error: errorVencida } = tasksVencidaResult;
  
  // 2. MANEJO DE ERRORES CENTRALIZADO
  // Verificamos si alguna de las promesas falló.
  const errors = [errorPendiente, errorEnProceso, errorEntregada, errorVencida].filter(Boolean);
  
  if (errors.length > 0) {
    errors.forEach(error => console.error('Error fetching tasks:', error));
    return (
      <div>
        <p>Hubo un error al cargar las tareas. Por favor, inténtalo de nuevo más tarde.</p>
      </div>
    );
  }

  // 3. PASAMOS TODOS LOS DATOS INICIALES AL CLIENTE
  // Incluimos el usuario y un objeto consolidado de tareas.
  return (
    <HomePage
      initialUser={user}
      initialTasks={{
        pendiente: tasksPendiente,
        enProceso: tasksEnProceso,
        entregada: tasksEntregada,
        vencida: tasksVencida,
      }}
    />
  );
}