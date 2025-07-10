'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Close, Edit, Schedule, Room } from '@mui/icons-material';
import { updateClassTime, updateClassClassroom } from '@/actions/class';
import { ClassData } from '@/types/class';

interface EditClassModalProps {
  open: boolean;
  onClose: () => void;
  classData: ClassData;
}

export default function EditClassModal({ open, onClose, classData }: EditClassModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados para los formularios
  const [timeForm, setTimeForm] = useState({
    start_time: classData.start_time,
    end_time: classData.end_time,
  });

  const [classroomForm, setClassroomForm] = useState({
    classroom: classData.classroom || '',
  });

  const handleUpdateTime = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateClassTime({
        id: classData.id,
        start_time: timeForm.start_time,
        end_time: timeForm.end_time,
      });

      if (result.success) {
        setSuccess('Horario actualizado correctamente');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Error al actualizar el horario');
      }
    } catch (err) {
      setError('Error inesperado al actualizar el horario');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClassroom = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateClassClassroom({
        id: classData.id,
        classroom: classroomForm.classroom,
      });

      if (result.success) {
        setSuccess('Aula actualizada correctamente');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Error al actualizar el aula');
      }
    } catch (err) {
      setError('Error inesperado al actualizar el aula');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    // Convertir de HH:MM:SS a HH:MM para el input
    return time.substring(0, 5);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Editar Clase
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {classData.course.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {classData.type === 1
              ? '📚 Cátedra'
              : classData.type === 2
                ? '💻 Ayudantía'
                : '🔬 Laboratorio'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Sección de Horario */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Schedule sx={{ mr: 1, fontSize: 20 }} />
            Horario
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Hora de inicio"
              type="time"
              value={formatTime(timeForm.start_time)}
              onChange={(e) => setTimeForm({ ...timeForm, start_time: e.target.value + ':00' })}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              size="small"
              fullWidth
            />
            <TextField
              label="Hora de fin"
              type="time"
              value={formatTime(timeForm.end_time)}
              onChange={(e) => setTimeForm({ ...timeForm, end_time: e.target.value + ':00' })}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              size="small"
              fullWidth
            />
          </Box>

          <Button
            variant="outlined"
            onClick={handleUpdateTime}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Edit />}
            size="small"
          >
            Actualizar Horario
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sección de Aula */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Room sx={{ mr: 1, fontSize: 20 }} />
            Aula
          </Typography>

          <TextField
            label="Aula"
            value={classroomForm.classroom}
            onChange={(e) => setClassroomForm({ ...classroomForm, classroom: e.target.value })}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
            placeholder="Ej: A101, Lab 1, Aula Magna"
          />

          <Button
            variant="outlined"
            onClick={handleUpdateClassroom}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Edit />}
            size="small"
          >
            Actualizar Aula
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
