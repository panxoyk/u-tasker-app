'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { SetupNameFormData } from '@/app/onboarding/setup-name/types';

export const setupName = async (formData: SetupNameFormData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('profile')
    .update({
      name: formData.name,
      last_name: formData.last_name,
    })
    .eq('user_id', user?.id);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/onboarding/create-period');
};
