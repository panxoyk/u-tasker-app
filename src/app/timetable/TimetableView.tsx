'use client';

import type React from 'react';

import { useState } from 'react';
import { Box, Paper } from '@mui/material';
import type { ClassData } from '@/types/class';
import DayHeader from './DayHeader';
import DayNavigation from './DayNavigation';
import DayView from './DayView';
import WeekStats from './WeekStats';

interface TimetableViewProps {
  classesData: {
    [key: number]: ClassData[];
  };
}

export default function TimetableView({ classesData }: TimetableViewProps) {
  const daysOfWeek = [
    { id: 1, name: 'Lunes', short: 'LUN' },
    { id: 2, name: 'Martes', short: 'MAR' },
    { id: 3, name: 'Miércoles', short: 'MIÉ' },
    { id: 4, name: 'Jueves', short: 'JUE' },
    { id: 5, name: 'Viernes', short: 'VIE' },
    { id: 6, name: 'Sábado', short: 'SÁB' },
    { id: 7, name: 'Domingo', short: 'DOM' },
  ];

  const getCurrentDayIndex = () => {
    const today = new Date().getDay();
    return daysOfWeek.findIndex((day) => day.id === today);
  };

  const [selectedDay, setSelectedDay] = useState(
    getCurrentDayIndex() >= 0 ? getCurrentDayIndex() : 0,
  );

  const handleDayChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedDay(newValue);
  };

  const handlePrevDay = () => {
    setSelectedDay((prev) => (prev > 0 ? prev - 1 : daysOfWeek.length - 1));
  };

  const handleNextDay = () => {
    setSelectedDay((prev) => (prev < daysOfWeek.length - 1 ? prev + 1 : 0));
  };

  const currentDay = daysOfWeek[selectedDay];
  const currentClasses = classesData[currentDay.id] || [];

  return (
    <Box sx={{ width: '100%', maxWidth: '100vw' }}>
      <DayHeader
        currentDay={currentDay}
        classes={currentClasses}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
      />

      <DayNavigation
        selectedDay={selectedDay}
        onDayChange={handleDayChange}
        daysOfWeek={daysOfWeek}
        classesData={classesData}
      />

      <Paper elevation={1} sx={{ minHeight: '400px', borderRadius: 2 }}>
        <DayView classes={currentClasses} dayName={currentDay.name} />
      </Paper>
    </Box>
  );
}
