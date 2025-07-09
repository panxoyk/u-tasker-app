// app/hooks/useTasks.ts
"use client";

import { useState, useCallback, useMemo } from 'react';
import { TaskData } from '@/types/task';
import { getTasksPendiente, getTasksEnProceso, getTasksEntregada, getTasksVencida } from '@/actions/task';

// Define una interfaz para el estado de las tareas
interface TasksState {
  pendiente: TaskData[];
  enProceso: TaskData[];
  entregada: TaskData[];
  vencida: TaskData[];
}

// El hook recibe el estado inicial desde el Server Component
export function useTasks(initialTasks: TasksState) {
  const [tasks, setTasks] = useState<TasksState>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para volver a cargar todas las tareas desde el servidor
  const reFetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        pendientesResult,
        enProcesoResult,
        entregadaResult,
        vencidaResult
      ] = await Promise.all([
        getTasksPendiente(),
        getTasksEnProceso(),
        getTasksEntregada(),
        getTasksVencida(),
      ]);

      const firstError = [pendientesResult, enProcesoResult, entregadaResult, vencidaResult].find(r => r.error)?.error;
      if (firstError) {
        throw new Error(firstError || "Error al actualizar las tareas.");
      }

      setTasks({
        pendiente: pendientesResult.data || [],
        enProceso: enProcesoResult.data || [],
        entregada: entregadaResult.data || [],
        vencida: vencidaResult.data || [],
      });
      return true;
    } catch (err: any) {
      console.error("Error al re-cargar las tareas:", err);
      setError(err.message || "No se pudieron re-cargar las tareas.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculamos el total de tareas, se actualiza solo si `tasks` cambia
  const totalTasks = useMemo(() => {
    // Add || [] to ensure taskArray is always an array before accessing .length
    return Object.values(tasks).reduce((sum, taskArray) => sum + (taskArray || []).length, 0);
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    reFetchTasks,
    totalTasks,
  };
}