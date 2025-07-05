'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { AddCourseFormData } from '@/app/onboarding/add-course/types';

/**
 * Agrega un nuevo curso para el usuario autenticado en su período activo.
 * @param formData Los datos del formulario del curso (nombre, código, créditos).
 */
export const addCourse = async (formData: AddCourseFormData) => {
    try {
        // Inicializa el cliente de Supabase.
        const supabase = await createClient();

        // 1. Obtener el usuario autenticado.
        const { data: { user } } = await supabase.auth.getUser();

        // Si no hay un usuario autenticado, redirige inmediatamente a la página de error.
        if (!user) {
            redirect('/error');
        }

        // 2. Buscar el ID del período activo del usuario.
        // Se busca un período con status 1 (activo) asociado al user_id.
        const { data: period, error: periodError } = await supabase
            .from('period')
            .select("id")
            .eq('status', 1)
            .eq("user_id", user.id); // Usamos user.id que ya está verificado.

        // Si hay un error al buscar el período, redirige a la página de error.
        if (periodError) {
            console.error('Error al buscar el período activo:', periodError);
            redirect('/error');
        }

        // Si no se encontró ningún período activo para el usuario, redirige a la página de error.
        if (!period || period.length === 0) {
            console.error('No se encontró un período activo o válido para el usuario.');
            redirect('/error');
        }

        // Toma el ID del primer período encontrado (asumiendo que solo debe haber uno activo).
        const activePeriodId = period[0].id;

        // 3. Insertar el nuevo curso en la base de datos.
        const { error: insertError } = await supabase
            .from('course')
            .insert([
                {
                    name: formData.course,
                    ...(formData.code && { code: formData.code }),
                    ...(formData.credits && { credits: Number(formData.credits) }),
                    period_id: activePeriodId, // Usa el ID del período activo encontrado.
                },
            ])

        // Si hay un error al insertar el curso, redirige a la página de error.
        if (insertError) {
            console.error('Error al insertar el curso:', insertError);
            redirect('/error');
        }

        // 4. Revalidar la ruta y redirigir al usuario.
        // Invalida la caché de la página principal (/) y su layout para asegurar que los datos actualizados se muestren.
        revalidatePath('/', 'layout');
        // Redirige al usuario a la página principal después de una inserción exitosa.
        redirect('/');

    } catch (e) {
        // Comprueba si el error es un objeto y si tiene la propiedad 'digest' que empieza con 'NEXT_REDIRECT'.
        if (e && typeof e === 'object' && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith('NEXT_REDIRECT')) {
            throw e; // Relanza el error de redirección para que Next.js lo maneje.
        }
        // Captura cualquier otro error inesperado que pueda ocurrir durante la ejecución.
        console.error("Error inesperado en la función addCourse:", e);
        // Redirige a la página de error para cualquier fallo no manejado explícitamente.
        redirect('/error');
    }
};