'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { LogInFormData, SignUpFormData } from '@/types/auth';

export const login = async (formData: LogInFormData) => {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
};

export const signup = async (formData: SignUpFormData) => {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
};

export async function signout() {
  const supabase = await createClient();

  // Check if a user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Sign out the user
    await supabase.auth.signOut();
  }

  // Revalidate the path and redirect
  revalidatePath('/auth/login', 'layout');
  redirect('/auth/login');
}
