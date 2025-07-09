'use client';

import { Box, Typography, IconButton, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import type { ClassData } from '@/types/class';
import { cleanTimeFormat } from '@/utils/lib';

interface DayHeaderProps {
  currentDay: { name: string; short: string };
  classes: ClassData[];
  onPrevDay: () => void;
  onNextDay: () => void;
}

export default function DayHeader({ currentDay, classes, onPrevDay, onNextDay }: DayHeaderProps) {
  const totalClassesToday = classes.length;
  const totalHoursToday = classes.reduce((total, classItem) => {
    const start = new Date(`1970-01-01T${cleanTimeFormat(classItem.start_time)}`);
    const end = new Date(`1970-01-01T${cleanTimeFormat(classItem.end_time)}`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return total + duration;
  }, 0);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <IconButton onClick={onPrevDay} sx={{ color: 'white' }} size="small">
          <ChevronLeft />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', flex: 1 }}>
          {currentDay.name}
        </Typography>

        <IconButton onClick={onNextDay} sx={{ color: 'white' }} size="small">
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {totalClassesToday}
          </Typography>
          <Typography variant="caption">{totalClassesToday === 1 ? 'Clase' : 'Clases'}</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {totalHoursToday.toFixed(1)}
          </Typography>
          <Typography variant="caption">Horas</Typography>
        </Box>
      </Box>
    </Paper>
  );
}
