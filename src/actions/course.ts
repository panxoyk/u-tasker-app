'use server';

import { AddCourseFormData, CourseData } from '@/types/course';
import { CourseArrayAPIResponse } from '@/types/responses';
import { createClient } from '@/utils/supabase/server';

export const addCourse = async ({
  course,
  code,
  credits,
}: AddCourseFormData): Promise<CourseArrayAPIResponse> => {
  try {
    const supabase = await createClient();

    const { data: periods, error: periodError } = await supabase
      .from('period')
      .select('id')
      .eq('status', 1);

    if (periodError) {
      console.error('Error finding active period:', periodError);
      return { success: false, error: periodError.message };
    }

    if (!periods || periods.length === 0) {
      console.error('Do not have an active period.');
      return { success: false, error: 'No active period found for the user.' };
    }

    const { data: data, error } = await supabase
      .from('course')
      .insert([
        {
          name: course,
          ...(code && { code: code }),
          ...(credits && { credits: Number(credits) }),
          period_id: periods[0].id,
        },
      ])
      .select();

    if (error) {
      console.error('Error adding course:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data };
  } catch (e: any) {
    console.error('Unexpected error adding course:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const getAllCoursesFromActivePeriod = async (): Promise<CourseArrayAPIResponse> => {
  try {
    const supabase = await createClient();

    const { data: periods, error: periodError } = await supabase
      .from('period')
      .select('id')
      .eq('status', 1);

    if (periodError) {
      console.error('Error getting active period:', periodError);
      return { success: false, error: periodError.message };
    }

    if (!periods || periods.length === 0) {
      console.error('Do not have an active period.');
      return { success: false, error: 'No active period found.' };
    }

    const { data: courses, error } = await supabase
      .from('course')
      .select('id, period_id, name, code, credits')
      .eq('period_id', periods[0].id);

    if (error) {
      console.error('Error getting courses from active period:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: courses };
  } catch (e: any) {
    console.error('Unexpected error getting courses from active period:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};
