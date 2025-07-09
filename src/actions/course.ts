'use server';

import { AddCourseFormData, CourseData } from '@/types/course';
import { createClient } from '@/utils/supabase/server';

export const addCourse = async (formData: AddCourseFormData) => {
  try {
    const supabase = await createClient();

    const { data: periods, error: periodError } = await supabase
      .from('period')
      .select('id')
      .eq('status', 1);

    if (periodError) {
      console.error('Error al buscar el período activo:', periodError);
      return { success: false, error: periodError.message };
    }

    if (!periods || periods.length === 0) {
      console.error('No se encontró un período activo o válido para el usuario.');
      return { success: false, error: 'No active period found for the user.' };
    }

    const { data: course, error: insertError } = await supabase
      .from('course')
      .insert([
        {
          name: formData.course,
          ...(formData.code && { code: formData.code }),
          ...(formData.credits && { credits: Number(formData.credits) }),
          period_id: periods[0].id,
        },
      ])
      .select();

    if (insertError) {
      console.error('Error al insertar el curso:', insertError);
      return { success: false, error: insertError.message };
    }

    return { success: true, data: course };
  } catch (e: any) {
    console.error('Error inesperado en la función addCourse:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const getAllCoursesFromActivePeriod = async (): Promise<{
  success: boolean;
  data?: CourseData[];
  error?: string;
}> => {
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
      console.error('No active periods found with status 1. Cannot fetch courses.');
      return { success: false, error: 'No active period found' };
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
    console.error('Error inesperado en la función getAllCoursesFromActivePeriod:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};
