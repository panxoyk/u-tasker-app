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

    let query = (await supabase)
      .from('task') // Your table name 'task'
      .select('id, course_id, title, status, description, due_date, course(name)') // Join with 'course' table
      .eq('status', 1);

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
          course_id: formData.course_id,
          title: formData.title,
          ...(formData.description && { description: formData.description }),
          ...(due_date && { due_date: due_date }),
          status: 1, // Default status for new tasks
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

export const updateStatusTask = async (
  id: number,
  status_id: number = 1, // Default to 1 (pending) if not provided
): Promise<{ success: boolean; data?: TaskData[]; error?: string }> => {
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