'use server';

import { createClient } from '@/utils/supabase/server';
import { UpdateFullNameFormData } from '@/types/profile';

export const updateFullName = async (formData: UpdateFullNameFormData) => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('profile')
      .update({
        name: formData.name,
        last_name: formData.last_name,
      })
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error updating full name:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data };
  } catch (e: any) {
    console.error('Unexpected error updating full name:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};
