'use server';

import { createClient } from '@/utils/supabase/server';
import { CreatePeriodFormData } from '@/types/period';
import { PeriodAPIResponse } from '@/types/responses';

export const createPeriod = async ({
  period,
}: CreatePeriodFormData): Promise<PeriodAPIResponse> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('period')
      .insert([
        {
          label: period,
          status: 1,
        },
      ])
      .select();

    if (error) {
      console.error('Error creating period:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data };
  } catch (e: any) {
    console.error('Unexpected error creating period:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};
