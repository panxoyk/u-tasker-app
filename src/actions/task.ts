'use server';

import { AddTaskFormData, TaskData } from '@/types/task';
import { createClient } from '@/utils/supabase/server';

export const getTasksPendiente = async (
  course_id?: number,
): Promise<{ success: boolean; data?: TaskData[]; error?: string }> => {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('task')
      .select('id, course_id, title, description, due_date, course(name)')
      .eq('status', 1);

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    const { data: tasks, error } = await query;

    if (error) {
      console.error('Error getting tasks pendiente:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: tasks };
  } catch (e: any) {
    console.error('Unexpected error getting tasks pendiente:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const getTasksEnProceso = async (
  course_id?: number,
): Promise<{ success: boolean; data?: TaskData[]; error?: string }> => {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('task')
      .select('id, course_id, title, description, due_date, course(name)')
      .eq('status', 2);

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    const { data: tasks, error } = await query;

    if (error) {
      console.error('Error getting tasks en proceso:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: tasks };
  } catch (e: any) {
    console.error('Unexpected error getting tasks en proceso:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const getTasksEntregada = async (
  course_id?: number,
): Promise<{ success: boolean; data?: TaskData[]; error?: string }> => {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('task')
      .select('id, course_id, title, description, due_date, course(name)')
      .eq('status', 3);

    if (course_id) {
      query = query.eq('course_id', course_id);
    }
    const { data: tasks, error } = await query;

    if (error) {
      console.error('Error getting tasks entregada:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: tasks };
  } catch (e: any) {
    console.error('Unexpected error getting tasks entregada:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const getTasksVencida = async (
  course_id?: number,
): Promise<{ success: boolean; data?: TaskData[]; error?: string }> => {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('task')
      .select('id, course_id, title, description, due_date, course(name)')
      .eq('status', 4);

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    const { data: tasks, error } = await query;

    if (error) {
      console.error('Error getting tasks vencida:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: tasks };
  } catch (e: any) {
    console.error('Unexpected error getting tasks vencida:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const addTask = async (formData: AddTaskFormData) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('task')
      .insert([
        {
          course_id: formData.course_id,
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date,
          status: 1,
        },
      ])
      .select();

    if (error) {
      console.error('Error adding task:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data };
  } catch (e: any) {
    console.error('Unexpected error adding task:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const deleteTask = async (id: number) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('task').delete().eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e: any) {
    console.error('Unexpected error deleting task:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};
