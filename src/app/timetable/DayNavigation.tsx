'use client';

import type React from 'react';

import { Box, Tabs, Tab, Typography, Paper, SxProps, Theme } from '@mui/material'; // Import SxProps, Theme
import { ClassData } from '@/types/class';

interface DayNavigationProps {
  selectedDay: number;
  onDayChange: (event: React.SyntheticEvent, newValue: number) => void;
  daysOfWeek: Array<{ id: number; name: string; short: string }>;
  classesData: { [key: number]: ClassData[] };
  sx?: SxProps<Theme>; // Add the sx prop here
}

export default function DayNavigation({
  selectedDay,
  onDayChange,
  daysOfWeek,
  classesData,
  sx, // Destructure sx from props
}: DayNavigationProps) {
  return (
    // Apply the sx prop to the root Paper component
    <Paper elevation={0} sx={{ ...sx, mb: 2 }}> {/* Set elevation to 0 here for more control in parent */}
      <Tabs
        value={selectedDay}
        onChange={onDayChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-flexContainer': {
            display: 'flex',
            flexWrap: 'nowrap',
            width: '100%',
          },
          '& .MuiTab-root': {
            minWidth: 'auto',
            px: 1,
            flex: 1,
          },
        }}
      >
        {daysOfWeek.map((day, index) => {
          const dayClasses = classesData[day.id] || [];
          return (
            <Tab
              key={day.id}
              label={
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {day.short}
                  </Typography>
                </Box>
              }
              value={index} // Added value prop for Tab
              sx={{
                opacity: dayClasses.length > 0 ? 1 : 0.6,
                // Consistent text color for tabs
                color: selectedDay === index ? 'primary.main' : 'text.secondary',
              }}
            />
          );
        })}
      </Tabs>
    </Paper>
  );
}