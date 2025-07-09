'use client';

import type { ClassData } from '@/types/class';
import { cleanTimeFormat } from '@/utils/lib';
import { Box, Paper, Typography, Chip, Button } from '@mui/material';
import Link from 'next/link';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

interface WeekStatsProps {
  classesData: {
    [key: number]: ClassData[];
  };
}

export default function WeekStats({ classesData }: WeekStatsProps) {
  const getAllClasses = () => {
    return Object.values(classesData).flat();
  };

  const getStatsByType = () => {
    const allClasses = getAllClasses();
    const stats = { 1: 0, 2: 0, 3: 0 };

    allClasses.forEach((classItem) => {
      stats[classItem.type as keyof typeof stats]++;
    });

    return stats;
  };

  const getTotalHours = () => {
    const allClasses = getAllClasses();
    return allClasses.reduce((total, classItem) => {
      const start = new Date(`1970-01-01T${cleanTimeFormat(classItem.start_time)}`);
      const end = new Date(`1970-01-01T${cleanTimeFormat(classItem.end_time)}`);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + duration;
    }, 0);
  };

  const getUniqueSubjects = () => {
    const allClasses = getAllClasses();
    const subjects = new Set(allClasses.map((c) => c.course.name));
    return subjects.size;
  };

  const stats = getStatsByType();
  const totalHours = getTotalHours();
  const uniqueSubjects = getUniqueSubjects();
  const totalClasses = getAllClasses().length;

  const getTypeInfo = (type: number) => {
    switch (type) {
      case 1:
        return { label: 'Cátedra', emoji: '📚' };
      case 2:
        return { label: 'Ayudantía', emoji: '💻' };
      case 3:
        return { label: 'Laboratorio', emoji: '🔬' };
      default:
        return { label: 'Clase', emoji: '📖' };
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
        📊 Resumen Semanal
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {totalClasses}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Clases
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
            {uniqueSubjects}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Materias
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
            {totalHours.toFixed(0)}h
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Semanales
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        {Object.entries(stats).map(([type, count]) => {
          const typeInfo = getTypeInfo(Number.parseInt(type));
          return (
            <Chip
              key={type}
              label={`${typeInfo.emoji} ${typeInfo.label}: ${count}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          );
        })}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Link href={'/timetable/add-class'}>
          <Button fullWidth variant="outlined" startIcon={<AddOutlinedIcon />}>
            Añadir clase
          </Button>
        </Link>
      </Box>
    </Paper>
  );
}
