'use server';

import { createClient } from '@/utils/supabase/server';
import { UpdateFullNameFormData } from '@/types/profile';
import { ProfileAPIResponse } from '@/types/responses';
import { ProfileAPIResponse } from '@/types/responses';

export const updateFullName = async ({
  name,
  last_name,
}: UpdateFullNameFormData): Promise<ProfileAPIResponse> => {
export const updateFullName = async ({
  name,
  last_name,
}: UpdateFullNameFormData): Promise<ProfileAPIResponse> => {
  try {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from('profile')
      .update({
        name: name,
        last_name: last_name,
        name: name,
        last_name: last_name,
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating full name:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: profile };
  } catch (e: any) {
    console.error('Unexpected error updating full name:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};
