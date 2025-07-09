'use client';

import { useState } from 'react';
import { Box, Typography, Alert, Snackbar } from '@mui/material';
import { deleteClass } from '@/actions/class';
import { ClassData } from '@/types/class';
import ClassCard from '@/components/ClassCard';
import EditClassModal from './EditClassModal';

interface DayViewProps {
  classes: ClassData[];
  dayName: string;
}

export default function DayView({ classes, dayName }: DayViewProps) {
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const sortedClasses = [...classes].sort((a, b) => a.start_time.localeCompare(b.start_time));

  const handleEditClass = (classData: ClassData) => {
    setEditingClass(classData);
  };

  const handleDeleteClass = async (classData: ClassData) => {
    try {
      const result = await deleteClass(classData.id);

      if (result.success) {
        setDeleteSuccess(`Clase "${classData.course.name}" eliminada correctamente`);
      } else {
        setDeleteError(result.error || 'Error al eliminar la clase');
      }
    } catch (error) {
      setDeleteError('Error inesperado al eliminar la clase');
    }
  };

  const handleCloseEdit = () => {
    setEditingClass(null);
  };

  const handleCloseSnackbar = () => {
    setDeleteSuccess(null);
    setDeleteError(null);
  };

  if (sortedClasses.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
          😴
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Sin clases programadas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Disfruta tu día libre el {dayName}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 2, pb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sortedClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classData={classItem}
              onEdit={handleEditClass}
              onDelete={handleDeleteClass}
            />
          ))}
        </Box>
      </Box>

      {/* Modal de edición */}
      {editingClass && (
        <EditClassModal open={!!editingClass} onClose={handleCloseEdit} classData={editingClass} />
      )}

      {/* Snackbar para feedback de eliminación */}
      <Snackbar
        open={!!deleteSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {deleteSuccess}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!deleteError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {deleteError}
        </Alert>
      </Snackbar>
    </>
  );
}
