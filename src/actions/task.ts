// actions/task.ts
// actions/task.ts
'use server';

import { GenericAPIResponse, TaskArrayAPIResponse } from '@/types/responses';
import { AddTaskFormData, UpdateTaskStatusFormData } from '@/types/task';
import { convertDateTimeToTimestampz } from '@/utils/lib';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const getTasksPendiente = async (
  course_id?: number,
): Promise<TaskArrayAPIResponse> => {
  try {
    const supabase = createClient(); // Await is not needed here as createClient typically returns the client directly

    let query = supabase
      .from('task')
      .select('id, course_id, title, status, description, due_date, course(name)')
      .eq('status', status);

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    const { data: tasks, error } = await query;

    if (error) {
      console.error(`Error getting tasks by status ${status}:`, error);
      return { success: false, error: error.message };
    }

    const processedData = processFetchedTasks(data); // Process data here
    return { success: true, data: processedData };

  } catch (e: any) {
    console.error(`Unexpected error getting tasks by status ${status}:`, e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const getTasksEnProceso = async (
  course_id?: number,
): Promise<{ success: boolean; data?: TaskData[]; error?: string }> => {
  try {
    const supabase = createClient();

    const dueDateISO = convertDateTimeToTimestampz(due_date);

    const { data: task, error } = await (await supabase)
      .from('task')
      .insert([
        {
          course_id: course_id,
          title: title,
          ...(description && { description: description }),
          ...(dueDateISO && { due_date: dueDateISO }),
          status: 1,
        },
      ])
      .select('id, course_id, title, status, description, due_date, course(name)'); // Select the full TaskData shape if you want to return it

    if (error) {
      console.error('Error adding task:', error);
      return { success: false, error: error.message };
    }

    const processedData = processFetchedTasks(task); // Process the returned task
    revalidatePath('/tasks', 'layout'); // Consider revalidating a specific path or tag
    return { success: true, data: processedData };
  } catch (e: any) {
    console.error('Unexpected error adding task:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const updateTaskStatus = async ({
  id,
  status = 1,
}: UpdateTaskStatusFormData): Promise<TaskArrayAPIResponse> => {
  try {
    const supabase = createClient();

    const { data: task, error } = await (await supabase)
      .from('task')
      .update({ status: status })
      .eq('id', id)
      .select('id, course_id, title, status, description, due_date, course(name)'); // Select the full TaskData shape

    if (error) {
      console.error('Error updating task status:', error);
      return { success: false, error: error.message };
    }

    const processedData = processFetchedTasks(task); // Process the returned task
    revalidatePath('/tasks', 'layout');
    return { success: true, data: processedData };
  } catch (e: any) {
    console.error('Unexpected error updating task status:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const deleteTask = async (id: number): Promise<GenericAPIResponse> => {
  try {
    const supabase = createClient();

    const { error } = await (await supabase).from('task').delete().eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/tasks', 'layout');
    return { success: true };
  } catch (e: any) {
    console.error('Unexpected error deleting task:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};