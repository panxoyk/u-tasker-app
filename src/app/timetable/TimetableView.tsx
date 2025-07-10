'use client';

import type React from 'react';
import { useState } from 'react';
import { Box, Paper, Typography, Container } from '@mui/material'; // Added Container for better overall layout
import type { ClassData } from '@/types/class';
import DayHeader from './DayHeader'; // Assuming this component exists and handles day title/navigation
import DayNavigation from './DayNavigation'; // Assuming this component exists and handles day tabs
import DayView from './DayView'; // Assuming this component exists and displays class details
// import WeekStats from './WeekStats'; // Uncomment and integrate if you plan to use it

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

  // Helper to get today's day index, defaulting to Monday (index 0) if not found
  const getCurrentDayIndex = () => {
    const today = new Date().getDay(); // getDay() returns 0 for Sunday, 1 for Monday...
    // Adjust for your daysOfWeek array where Monday is id 1 (index 0)
    const normalizedToday = today === 0 ? 7 : today; // Map Sunday (0) to 7
    const index = daysOfWeek.findIndex((day) => day.id === normalizedToday);
    return index >= 0 ? index : 0; // Default to Monday if today isn't in your defined list
  };

  const [selectedDay, setSelectedDay] = useState(
    getCurrentDayIndex(),
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
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        minHeight: '100vh',
        bgcolor: 'background.default', // Use theme background color
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Page Title and Description - consistent with other views */}
      <Container maxWidth="md" sx={{ pt: 3, pb: 2, px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            mb: 0.5,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          Horario
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
          }}
        >
          Visualiza y gestiona tus clases por día.
        </Typography>
      </Container>

      {/* Day Navigation Tabs */}
      <DayNavigation
        selectedDay={selectedDay}
        onDayChange={handleDayChange}
        daysOfWeek={daysOfWeek}
        classesData={classesData} // Pass classesData for potential styling based on content
        sx={{
          bgcolor: 'background.paper', // Slightly distinct background for the tabs
          borderBottom: 1,
          borderColor: 'divider', // Subtle border
          boxShadow: 0, // No shadow for tabs bar
        }}
      />

      {/* Main Content Area */}
      <Container
        maxWidth="md"
        sx={{
          flex: 1, // Allow content to grow
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 }, // Spacing between cards/elements
        }}
      >
        {/* Day Header with Navigation Buttons */}
        <DayHeader
          currentDay={currentDay}
          classes={currentClasses}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          sx={{
            bgcolor: 'background.paper', // Consistent with paper elevation
            borderRadius: 2,
            boxShadow: 1, // Subtle shadow for depth
            p: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        />

        {/* Day View (Main Class List) */}
        <Paper elevation={1} sx={{
          minHeight: '400px',
          borderRadius: 2,
          bgcolor: 'background.paper', // Consistent with light theme paper
          p: { xs: 2, sm: 3 }, // Add padding to the paper itself
          flexGrow: 1, // Allow it to expand
          display: 'flex',
          flexDirection: 'column',
        }}>
          <DayView classes={currentClasses} dayName={currentDay.name} />
        </Paper>

        {/* Optional: Week Stats section */}
        {/*
        <Paper elevation={1} sx={{ borderRadius: 2, bgcolor: 'background.paper', p: { xs: 2, sm: 3 } }}>
          <WeekStats classesData={classesData} />
        </Paper>
        */}
      </Container>
    </Box>
  );
}