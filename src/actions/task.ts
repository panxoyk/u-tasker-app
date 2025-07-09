'use server';

import { GenericAPIResponse, TaskArrayAPIResponse } from '@/types/responses';
import {
  AddTaskFormData,
  DeleteTaskFormData,
  GetTasksByStatus,
  UpdateTaskStatusFormData,
} from '@/types/task';
import { convertDateTimeToTimestampz } from '@/utils/lib';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const getTasksByStatus = async ({
  status = 1,
  course_id,
}: GetTasksByStatus): Promise<TaskArrayAPIResponse> => {
  try {
    const supabase = await createClient();

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

    return { success: true, data: tasks };
  } catch (e: any) {
    console.error(`Unexpected error getting tasks by status ${status}:`, e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const addTask = async ({
  course_id,
  title,
  due_date,
  description,
}: AddTaskFormData): Promise<TaskArrayAPIResponse> => {
  try {
    const supabase = await createClient();

    const dueDateISO = convertDateTimeToTimestampz(due_date);

    const { data: task, error } = await supabase
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
      .select();

    if (error) {
      console.error('Error adding task:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/tasks', 'layout');
    return { success: true, data: task };
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
    const supabase = await createClient();

    const { data: task, error } = await supabase
      .from('task')
      .update({ status: status })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating task status:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/tasks', 'layout');
    return { success: true, data: task };
  } catch (e: any) {
    console.error('Unexpected error updating task status:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const deleteTask = async ({ id }: DeleteTaskFormData): Promise<GenericAPIResponse> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('task').delete().eq('id', id);

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
