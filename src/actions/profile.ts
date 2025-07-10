'use server';

import { createClient } from '@/utils/supabase/server';
import { UpdateFullNameFormData } from '@/types/profile';
import { ProfileAPIResponse } from '@/types/responses';

export const updateFullName = async ({
  name,
  last_name,
}: UpdateFullNameFormData): Promise<ProfileAPIResponse> => {
  try {
    const supabase = await createClient();
    // Check if a user is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile, error } = await supabase
      .from('profile')
      .update({
        name: name,
        last_name: last_name,
      })
      .eq('user_id', user?.id)
      .select();

    if (error) {
      console.error('Error updating full name:', error);
      return { success: false, error: error.message };
    }

    // @ts-ignore
    return { success: true, data: profile };
  } catch (e: any) {
    console.error('Unexpected error updating full name:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};
