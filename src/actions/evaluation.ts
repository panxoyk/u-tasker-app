import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { AddEvaluationFormData, UpdateEvaluationDateFormData } from '../types/evaluation';
import { EvaluationArrayAPIResponse, GenericAPIResponse } from '@/types/responses';
import { convertDateTimeToTimestampz } from '@/utils/lib';

export const getEvaluationsByCourse = async (
  course_id: number,
): Promise<EvaluationArrayAPIResponse> => {
  try {
    const supabase = await createClient();

    const { data: evaluations, error } = await supabase
      .from('evaluation')
      .select('id, course_id, course(name), title, start_date, end_date')
      .eq('course_id', course_id);

    if (error) {
      console.error(`Error getting evaluations for course ${course_id}:`, error);
      return { success: false, error: error.message };
    }

    // @ts-ignore
    return { success: true, data: evaluations };
  } catch (e: any) {
    console.error(`Unexpected error getting evaluations for course ${course_id}`, e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const addEvaluation = async ({
  course_id,
  title,
  start_date,
  end_date,
}: AddEvaluationFormData): Promise<EvaluationArrayAPIResponse> => {
  try {
    const supabase = await createClient();

    const startDateISO = convertDateTimeToTimestampz(start_date);
    const endDateISO = convertDateTimeToTimestampz(end_date);

    const { data: evaluation, error } = await supabase
      .from('evaluation')
      .insert([
        {
          title: title,
          course_id: course_id,
          ...(startDateISO && { start_date: startDateISO }),
          ...(endDateISO && { end_date: endDateISO }),
        },
      ])
      .select();

    if (error) {
      console.error('Error adding evaluation:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/calendar', 'layout');
    return { success: true, data: evaluation };
  } catch (e: any) {
    console.error('Unexpected error adding evaluation', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const updateEvaluationDate = async ({
  id,
  start_date,
  end_date,
}: UpdateEvaluationDateFormData): Promise<EvaluationArrayAPIResponse> => {
  try {
    const supabase = await createClient();

    const startDateISO = convertDateTimeToTimestampz(start_date);
    const endDateISO = convertDateTimeToTimestampz(end_date);

    const { data: evaluation, error } = await supabase
      .from('evaluation')
      .update({
        ...(startDateISO && { start_date: startDateISO }),
        ...(endDateISO && { end_date: endDateISO }),
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating evaluation date:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/calendar', 'layout');
    return { success: true, data: evaluation };
  } catch (e: any) {
    console.error('Unexpected error updating evaluation:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};

export const deleteEvaluation = async (id: number): Promise<GenericAPIResponse> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('evaluation').delete().eq('id', id);

    if (error) {
      console.error(`Error deleting evaluation:`, error);
      return { success: false, error: error.message };
    }

    revalidatePath('/calendar', 'layout');
    return { success: true };
  } catch (e: any) {
    console.error('Unexpected error deleting evaluation', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};
