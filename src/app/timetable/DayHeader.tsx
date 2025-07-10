'use client';

import { Box, Typography, IconButton, Paper, SxProps, Theme } from '@mui/material'; // Import SxProps, Theme
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import type { ClassData } from '@/types/class';
import { cleanTimeFormat } from '@/utils/lib';

interface DayHeaderProps {
  currentDay: { name: string; short: string };
  classes: ClassData[];
  onPrevDay: () => void;
  onNextDay: () => void;
  sx?: SxProps<Theme>; // Add the sx prop here!
}

export default function DayHeader({ currentDay, classes, onPrevDay, onNextDay, sx }: DayHeaderProps) {
  const totalClassesToday = classes.length;
  const totalHoursToday = classes.reduce((total, classItem) => {
    // Ensure that start_time and end_time are valid strings before processing
    if (!classItem.start_time || !classItem.end_time) return total;

    const start = new Date(`1970-01-01T${cleanTimeFormat(classItem.start_time)}`);
    const end = new Date(`1970-01-01T${cleanTimeFormat(classItem.end_time)}`);
    
    // Check for valid Date objects before calculating duration
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn('Invalid time format for class:', classItem);
      return total;
    }

    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return total + duration;
  }, 0);

  return (
    <Paper
      elevation={0} // Set elevation to 0 here to allow parent to control via sx
      sx={{
        p: { xs: 2, sm: 3 }, // Use responsive padding from parent component's sx
        mb: { xs: 2, sm: 3 }, // Consistent margin bottom with main content stack
        ...sx, // Apply the sx prop passed from the parent
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <IconButton onClick={onPrevDay} size="small" sx={{ color: 'text.secondary' }}> {/* Use theme color */}
          <ChevronLeft />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', flex: 1, color: 'text.primary' }}> {/* Use theme color */}
          {currentDay.name}
        </Typography>

        <IconButton onClick={onNextDay} size="small" sx={{ color: 'text.secondary' }}> {/* Use theme color */}
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, sm: 4 } }}> {/* Responsive gap */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}> {/* Use theme color */}
            {totalClassesToday}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}> {/* Use theme color */}
            {totalClassesToday === 1 ? 'Clase' : 'Clases'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}> {/* Use theme color */}
            {totalHoursToday.toFixed(1)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}> {/* Use theme color */}
            Horas
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}