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

    // 1. Obtener el usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error al obtener el usuario o el usuario no está logueado:', userError?.message || 'Usuario no autenticado.');
      // Redirigir a una página de login o error de autenticación si el usuario no está logueado.
      // Puedes usar redirect('/login') si quieres que vayan al login.
      return { success: false, error: userError?.message || 'Usuario no autenticado.' };
    }

    // 2. Actualizar la fila del perfil que coincide con el ID del usuario
    const { data: profile, error } = await supabase
      .from('profile')
      .update({
        name: name,
        last_name: last_name,
      })
      .eq('id', user.id) // <-- ¡CRUCIAL! Asegura que solo se actualiza el perfil del usuario logueado
      .select()
      .single();

    if (error) {
      console.error('Error actualizando el nombre completo:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: profile };
  } catch (e: any) {
    console.error('Error inesperado actualizando el nombre completo:', e);
    return { success: false, error: e.message || 'Ocurrió un error inesperado' };
  }
};