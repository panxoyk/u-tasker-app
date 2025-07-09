'use server';

import {
  UpdateClassClassroomFormData,
  UpdateClassTimeFormData,
  AddClassFormData,
} from '@/types/class';
import { ClassArrayAPIResponse, GenericAPIResponse } from '@/types/responses';
import { convertTimeToTimez } from '@/utils/lib';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const getClassesByDayOfTheWeek = async (
  day_of_the_week: number,
  course_id?: number,
): Promise<ClassArrayAPIResponse> => {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('class')
      .select('id, course_id, day_of_the_week, start_time, end_time, classroom, type, course(name)')
      .eq('day_of_the_week', day_of_the_week)
      .order('start_time');

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    const { data: classes, error } = await query;

    if (error) {
      console.error(`Error getting monday classes by day of the week ${day_of_the_week}:`, error);
      return { success: false, error: error.message };
    }

    // @ts-ignore
    return { success: true, data: classes };
  } catch (e: any) {
    console.error(`Unexpected error getting classes by day of the week ${day_of_the_week}`, e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const addClass = async ({
  course_id,
  day_of_the_week,
  start_time,
  end_time,
  classroom,
  type,
}: AddClassFormData): Promise<ClassArrayAPIResponse> => {
  try {
    const supabase = await createClient();

    const { data: clase, error } = await supabase
      .from('class')
      .insert([
        {
          course_id: course_id,
          day_of_the_week: day_of_the_week,
          start_time: convertTimeToTimez(start_time),
          end_time: convertTimeToTimez(end_time),
          ...(classroom && { classroom: classroom }),
          type: type,
        },
      ])
      .select();

    if (error) {
      console.error('Error adding class:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/timetable', 'layout');
    return { success: true, data: clase };
  } catch (e: any) {
    console.error('Unexpected error adding class', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const updateClassTime = async ({
  id,
  start_time,
  end_time,
}: UpdateClassTimeFormData): Promise<ClassArrayAPIResponse> => {
  try {
    const supabase = await createClient();

    const { data: clase, error } = await supabase
      .from('task')
      .update({
        ...(start_time && { start_time: convertTimeToTimez(start_time) }),
        ...(end_time && { end_time: convertTimeToTimez(end_time) }),
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating class time:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/timetable', 'layout');
    return { success: true, data: clase };
  } catch (e: any) {
    console.error('Unexpected error updating class time:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const updateClassClassroom = async ({
  id,
  classroom,
}: UpdateClassClassroomFormData): Promise<ClassArrayAPIResponse> => {
  try {
    const supabase = await createClient();

    const { data: clase, error } = await supabase
      .from('task')
      .update({ classroom: classroom })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating class time:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/timetable', 'layout');
    return { success: true, data: clase };
  } catch (e: any) {
    console.error('Unexpected error updating class time:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const deleteClass = async (id: number): Promise<GenericAPIResponse> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('class').delete().eq('id', id);

    if (error) {
      console.error('Error deleting class:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/timetable', 'layout');
    return { success: true };
  } catch (e: any) {
    console.error('Unexpected error deleting class:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};
