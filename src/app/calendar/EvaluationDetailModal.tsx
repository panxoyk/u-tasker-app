'use client';

import { EvaluationData, UpdateEvaluationDateFormData } from '@/types/evaluation';
import { CourseData } from '@/types/course';
import { deleteEvaluation, updateEvaluationDate } from '@/actions/evaluation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Box
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'; // <-- ¡Revisar esta importación!
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';             // <-- ¡Revisar esta importación!
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';             // <-- ¡Revisar esta importación!

interface EvaluationDetailModalProps {
  evaluation: EvaluationData;
  isOpen: boolean;
  onClose: () => void;
  courses: CourseData[];
}

export default function EvaluationDetailModal({ evaluation, isOpen, onClose, courses }: EvaluationDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const courseName = courses.find(c => c.id === evaluation.course_id)?.name || 'Curso Desconocido';

  const formatDateTimeLocal = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateEvaluationDateFormData>({
    defaultValues: {
      id: evaluation.id,
      start_date: formatDateTimeLocal(evaluation.start_date),
      end_date: formatDateTimeLocal(evaluation.end_date),
    },
  });

  useEffect(() => {
    reset({
      id: evaluation.id,
      start_date: formatDateTimeLocal(evaluation.start_date),
      end_date: formatDateTimeLocal(evaluation.end_date),
    });
    setIsEditing(false);
  }, [evaluation, reset]);

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta evaluación? Esta acción es irreversible.')) {
      setIsDeleting(true);
      const result = await deleteEvaluation(evaluation.id);
      if (result.success) {
        console.log('Evaluación eliminada con éxito!');
        onClose();
      } else {
        console.error('Error al eliminar evaluación:', result.error);
        setIsDeleting(false);
      }
    }
  };

  const handleEditSubmit = async (formData: UpdateEvaluationDateFormData) => {
    const result = await updateEvaluationDate(formData);

    if (result.success) {
      console.log('Fechas de evaluación actualizadas con éxito!');
      setIsEditing(false);
      onClose();
    } else {
      console.error('Error al actualizar fechas de evaluación:', result.error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{evaluation.title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" color="text.secondary">
          Curso: **{courseName}**
        </Typography>
        <Box component="form" onSubmit={handleSubmit(handleEditSubmit)} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isEditing ? (
            <>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <FormLabel htmlFor="start_date-edit">Fecha de Inicio</FormLabel>
                    <TextField
                      {...field}
                      id="start_date-edit"
                      type="datetime-local"
                      fullWidth
                      variant="outlined"
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
                    <FormLabel htmlFor="end_date-edit">Fecha de Fin</FormLabel>
                    <TextField
                      {...field}
                      id="end_date-edit"
                      type="datetime-local"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.end_date}
                      helperText={errors.end_date?.message}
                    />
                  </FormControl>
                )}
              />
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ mt: 1 }}>
                **Inicio:** {evaluation.start_date ? new Date(evaluation.start_date).toLocaleString() : 'No especificado'}
              </Typography>
              <Typography variant="body2">
                **Fin:** {evaluation.end_date ? new Date(evaluation.end_date).toLocaleString() : 'No especificado'}
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        {isEditing ? (
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            disabled={isSubmitting}
            onClick={handleSubmit(handleEditSubmit)}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        ) : (
          <>
            <Button
              onClick={() => setIsEditing(true)}
              color="primary"
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
            >
              Editar Fechas
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              startIcon={<DeleteOutlineOutlinedIcon />}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Evaluación'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}