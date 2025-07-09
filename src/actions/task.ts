// actions/task.ts
'use server';

import { AddTaskFormData, TaskData } from '@/types/task';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper function to process fetched task data for consistency
const processFetchedTasks = (tasks: any[] | null): TaskData[] => {
  if (!tasks) return [];
  
  return tasks.map(task => ({
    id: task.id,
    course_id: task.course_id,
    title: task.title,
    status: task.status,
    description: task.description,
    due_date: task.due_date,
    // Ensure 'course' object exists and has a 'name'.
    // Supabase will return `task.course` as the joined object.
    course: task.course && typeof task.course === 'object' && task.course.name 
            ? { name: task.course.name } // Use the actual course name
            : { name: 'Sin Curso' }, // Fallback for missing/null course or name
  })) as TaskData[]; // Assert type after processing
};

export const getTasksPendiente = async (
  course_id?: number,
): Promise<{ success: boolean; data?: TaskData[]; error?: string }> => {
  try {
    const supabase = createClient(); // Await is not needed here as createClient typically returns the client directly

    let query = (await supabase)
      .from('task') // Your table name 'task'
      .select('id, course_id, title, status, description, due_date, course(name)') // Join with 'course' table
      .eq('status', 1);

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting tasks pendiente:', error);
      return { success: false, error: error.message };
    }

    const processedData = processFetchedTasks(data); // Process data here
    return { success: true, data: processedData };

  } catch (e: any) {
    console.error('Unexpected error getting tasks pendiente:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

// Apply the same `processFetchedTasks` helper to getTasksEnProceso, getTasksEntregada, getTasksVencida

export const getTasksEnProceso = async (
  course_id?: number,
): Promise<{ success: boolean; data?: TaskData[]; error?: string }> => {
  try {
    const supabase = createClient();

    let query = (await supabase)
      .from('task')
      .select('id, course_id, title, status, description, due_date, course(name)')
      .eq('status', 2);

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting tasks en proceso:', error);
      return { success: false, error: error.message };
    }

    const processedData = processFetchedTasks(data);
    return { success: true, data: processedData };

  } catch (e: any) {
    console.error('Unexpected error getting tasks en proceso:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const getTasksEntregada = async (
  course_id?: number,
): Promise<{ success: boolean; data?: TaskData[]; error?: string }> => {
  try {
    const supabase = createClient();

    let query = (await supabase)
      .from('task')
      .select('id, course_id, title, status, description, due_date, course(name)')
      .eq('status', 3);

    if (course_id) {
      query = query.eq('course_id', course_id);
    }
    const { data, error } = await query;

    if (error) {
      console.error('Error getting tasks entregada:', error);
      return { success: false, error: error.message };
    }

    const processedData = processFetchedTasks(data);
    return { success: true, data: processedData };

  } catch (e: any) {
    console.error('Unexpected error getting tasks entregada:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const getTasksVencida = async (
  course_id?: number,
): Promise<{ success: boolean; data?: TaskData[]; error?: string }> => {
  try {
    const supabase = createClient();

    let query = (await supabase)
      .from('task')
      .select('id, course_id, title, status, description, due_date, course(name)')
      .eq('status', 4);

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting tasks vencida:', error);
      return { success: false, error: error.message };
    }

    const processedData = processFetchedTasks(data);
    return { success: true, data: processedData };

  } catch (e: any) {
    console.error('Unexpected error getting tasks vencida:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

// The addTask, updateStatusTask, and deleteTask functions are fine as they are,
// as they are primarily sending data or updating, not reading 'course.name'
export const addTask = async (
  formData: AddTaskFormData,
): Promise<{ success: boolean; data?: TaskData[]; error?: string }> => {
  try {
    const supabase = createClient();

    const dueDateFormValue = formData.due_date;
    let due_date: string | null = null; // Use null for optional dates
    if (dueDateFormValue) {
      const dateObj = new Date(dueDateFormValue);
      due_date = dateObj.toISOString();
    }

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
      .update({ status: status_id })
      .eq('id', id)
      .select('id, course_id, title, status, description, due_date, course(name)'); // Select the full TaskData shape

    if (error) {
      console.error('Error updating status task:', error);
      return { success: false, error: error.message };
    }

    const processedData = processFetchedTasks(task); // Process the returned task
    revalidatePath('/tasks', 'layout');
    return { success: true, data: processedData };
  } catch (e: any) {
    console.error('Unexpected error updating status task:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const deleteTask = async (id: number): Promise<{ success: boolean; error?: string }> => {
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