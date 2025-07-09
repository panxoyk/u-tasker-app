'use client';

import { addEvaluation } from '@/actions/evaluation';
import { CourseData } from '@/types/course';
import { AddEvaluationFormData } from '@/types/evaluation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useRouter } from 'next/navigation';

interface AddEvaluationFormProps {
  courses: CourseData[];
  coursesError?: string | null;
  onSuccess: () => void;
}

export default function AddEvaluationForm({ courses, coursesError, onSuccess }: AddEvaluationFormProps) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddEvaluationFormData>({
    defaultValues: {
      title: '',
      course_id: courses.length > 0 ? courses[0].id : undefined,
      start_date: '',
      end_date: '',
    },
  });

  const onSubmit = async (formData: AddEvaluationFormData) => {
    const payload = {
      ...formData,
      course_id: Number(formData.course_id),
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
    };

    const { success, error } = await addEvaluation(payload);

    if (success) {
      reset();
      onSuccess(); // Llama a la función onSuccess que viene de la página
    } else {
      console.error('Error al añadir evaluación:', error);
      // Aquí podrías añadir un mensaje de error visible para el usuario.
    }
  };

  const handleCancel = () => {
    // *** MODIFICADO AQUÍ: Redirige a /calendar ***
    router.push('/calendar');
  };

  return (
    <Box
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Controller
        name="title"
        control={control}
        rules={{
          required: 'El título de la evaluación es requerido',
          minLength: {
            value: 3,
            message: 'Mínimo 3 caracteres',
          },
          maxLength: {
            value: 100,
            message: 'Máximo 100 caracteres',
          },
        }}
        render={({ field }) => (
          <FormControl fullWidth>
            <FormLabel htmlFor="title-add-evaluation">Título de la Evaluación</FormLabel>
            <TextField
              {...field}
              id="title-add-evaluation"
              placeholder="Examen Final de Matemáticas"
              autoFocus
              fullWidth
              variant="outlined"
              color="primary"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </FormControl>
        )}
      />

      <Controller
        name="course_id"
        control={control}
        rules={{ required: 'Debes seleccionar un curso' }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.course_id}>
            <FormLabel htmlFor="course-add-evaluation">Curso</FormLabel>
            <Select
              {...field}
              labelId="course-add-evaluation-label"
              id="course-add-evaluation"
              variant="outlined"
              displayEmpty
            >
              {coursesError ? (
                <MenuItem disabled>Error cargando cursos: {coursesError}</MenuItem>
              ) : courses.length === 0 ? (
                <MenuItem disabled>No hay cursos disponibles</MenuItem>
              ) : (
                courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.course_id && (
              <Typography color="error" variant="caption">
                {errors.course_id.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="start_date"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <FormLabel htmlFor="start_date-add-evaluation">Fecha y Hora de Inicio</FormLabel>
            <TextField
              {...field}
              id="start_date-add-evaluation"
              type="datetime-local"
              fullWidth
              variant="outlined"
              color="primary"
              InputLabelProps={{ shrink: true }}
              error={!!errors.start_date}
              helperText={errors.start_date?.message}
            />
          </FormControl>
        )}
      />

      <Controller
        name="end_date"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <FormLabel htmlFor="end_date-add-evaluation">Fecha y Hora de Fin</FormLabel>
            <TextField
              {...field}
              id="end_date-add-evaluation"
              type="datetime-local"
              fullWidth
              variant="outlined"
              color="primary"
              InputLabelProps={{ shrink: true }}
              error={!!errors.end_date}
              helperText={errors.end_date?.message}
            />
          </FormControl>
        )}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
        {/* Botón Cancelar */}
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          startIcon={<CloseOutlinedIcon />}
          onClick={handleCancel}
        >
          Cancelar
        </Button>

        {/* Botón Añadir Evaluación */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<CheckOutlinedIcon />}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Añadiendo...' : 'Añadir Evaluación'}
        </Button>
      </Box>
    </Box>
  );
}