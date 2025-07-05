'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { CreatePeriodFormData } from '@/app/onboarding/create-period/types';

export const createPeriod = async (formData: CreatePeriodFormData) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from('period')
    .insert([
      {
        label: formData.period,
        status: 1,
      },
    ])
    .select();

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/onboarding/add-course');
};
