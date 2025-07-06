'use server';

import { AddCourseFormData } from '@/types/course';
import { createClient } from '@/utils/supabase/server';

/**
 * Agrega un nuevo curso para el usuario autenticado en su período activo.
 * @param formData Los datos del formulario del curso (nombre, código, créditos).
 */
export const addCourse = async (formData: AddCourseFormData) => {
  try {
    // Inicializa el cliente de Supabase.
    const supabase = await createClient();

    // 1. Obtener el usuario autenticado.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Si no hay un usuario autenticado, retornamos un error.
    if (!user) {
      return { success: false, error: 'User not authenticated.' };
    }

    // 2. Buscar el ID del período activo del usuario.
    // Se busca un período con status 1 (activo) asociado al user_id.
    const { data: period, error: periodError } = await supabase
      .from('period')
      .select('id')
      .eq('status', 1)
      .eq('user_id', user.id); // Usamos user.id que ya está verificado.

    // Si hay un error al buscar el período, retornamos un error.
    if (periodError) {
      console.error('Error al buscar el período activo:', periodError);
      return { success: false, error: periodError.message };
    }

    // Si no se encontró ningún período activo para el usuario, retornamos un error.
    if (!period || period.length === 0) {
      console.error('No se encontró un período activo o válido para el usuario.');
      return { success: false, error: 'No active period found for the user.' };
    }

    // Toma el ID del primer período encontrado (asumiendo que solo debe haber uno activo).
    const activePeriodId = period[0].id;

    // 3. Insertar el nuevo curso en la base de datos.
    const { data: courseData, error: insertError } = await supabase
      .from('course')
      .insert([
        {
          name: formData.course,
          ...(formData.code && { code: formData.code }),
          ...(formData.credits && { credits: Number(formData.credits) }),
          period_id: activePeriodId, // Usa el ID del período activo encontrado.
        },
      ])
      .select(); // Seleccionamos para devolver los datos del curso creado

    if (insertError) {
      console.error('Error al insertar el curso:', insertError);
      return { success: false, error: insertError.message };
    }

    return { success: true, data: courseData ? courseData[0] : null }; // Devolvemos los datos del curso creado si están disponibles.
  } catch (e: any) {
    // Captura cualquier otro error inesperado que pueda ocurrir durante la ejecución.
    console.error('Error inesperado en la función addCourse:', e);
    return { success: false, error: e.message || 'An unexpected error occurred' };
  }
};
