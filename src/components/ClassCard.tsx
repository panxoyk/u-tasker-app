'use client';

import type React from 'react';

import { Paper, Typography, Box, Divider, IconButton, Tooltip, Chip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { ClassData } from '@/types/class';
import { cleanTimeFormat, formatTime } from '@/utils/lib';

interface ClassCardProps {
  classData: ClassData;
  onEdit?: (classData: ClassData) => void;
  onDelete?: (classData: ClassData) => void;
}

export default function ClassCard({ classData, onEdit, onDelete }: ClassCardProps) {
  const getClassDuration = (startTime: string, endTime: string) => {
    const start = new Date(`1970-01-01T${cleanTimeFormat(startTime)}`);
    const end = new Date(`1970-01-01T${cleanTimeFormat(endTime)}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error(
        'Error al parsear las horas para la duración. Verificar formato de entrada y cleanTimeFormat.',
        {
          startTime,
          endTime,
          cleanedStart: cleanTimeFormat(startTime),
          cleanedEnd: cleanTimeFormat(endTime),
        },
      );
      return 0;
    }

    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const getTypeInfo = (type: number) => {
    switch (type) {
      case 1:
        return { label: 'Cátedra', color: '#e3f2fd', emoji: '📚' };
      case 2:
        return { label: 'Ayudantía', color: '#f3e5f5', emoji: '💻' };
      case 3:
        return { label: 'Laboratorio', color: '#e8f5e8', emoji: '🔬' };
      default:
        return { label: 'Clase', color: '#f5f5f5', emoji: '📖' };
    }
  };

  const duration = getClassDuration(classData.start_time, classData.end_time);
  const typeInfo = getTypeInfo(classData.type);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(classData);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(classData);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
      >
        {/* Contenedor Izquierdo: Curso y Chip de Tipo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, mr: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {classData.course.name}
          </Typography>
          <Chip
            label={`${typeInfo.emoji} ${typeInfo.label}`}
            sx={{
              backgroundColor: typeInfo.color,
              mt: 0.5,
              fontWeight: 600,
              color: 'text.primary',
              height: 24,
              width: 'fit-content', // Asegura que el chip solo ocupe el ancho necesario
              '& .MuiChip-label': {
                paddingLeft: '6px',
                paddingRight: '6px',
              },
            }}
            size="small"
          />
        </Box>

        {/* Contenedor Derecho: Horas de Inicio y Fin */}
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            {formatTime(cleanTimeFormat(classData.start_time))}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
            }}
          >
            {formatTime(cleanTimeFormat(classData.end_time))}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          {classData.classroom && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                mb: 0.5,
              }}
            >
              📍 {classData.classroom}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            ⏱️ {isNaN(duration) ? 'Duración inválida' : `${duration.toFixed(1)} horas`}
          </Typography>
        </Box>

        {/* Botones de acción (Edit y Delete) */}
        {(onEdit || onDelete) && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onEdit && (
              <Tooltip title="Editar clase">
                <IconButton
                  onClick={handleEdit}
                  size="small"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {onDelete && (
              <Tooltip title="Eliminar clase">
                <IconButton
                  onClick={handleDelete}
                  size="small"
                  sx={{
                    backgroundColor: 'error.main',
                    color: 'error.contrastText',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
