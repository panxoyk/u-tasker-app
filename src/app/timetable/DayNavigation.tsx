"use client"

import type React from "react"

import { Box, Tabs, Tab, Typography, Paper } from "@mui/material"
import { ClassData } from "@/types/class"

interface DayNavigationProps {
  selectedDay: number
  onDayChange: (event: React.SyntheticEvent, newValue: number) => void
  daysOfWeek: Array<{ id: number; name: string; short: string }>
  classesData: { [key: number]: ClassData[] }
}

export default function DayNavigation({ selectedDay, onDayChange, daysOfWeek, classesData }: DayNavigationProps) {
  return (
    <Paper elevation={1} sx={{ mb: 2 }}>
      <Tabs
        value={selectedDay}
        onChange={onDayChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTabs-flexContainer": { // Target the flex container inside Tabs
            display: "flex",
            flexWrap: "nowrap",
            width: "100%", // Ensure the flex container takes full width
          },
          "& .MuiTab-root": {
            minWidth: "auto",
            px: 1,
            flex: 1,
          },
        }}
      >
        {daysOfWeek.map((day, index) => {
          const dayClasses = classesData[day.id] || []
          return (
            <Tab
              key={day.id}
              label={
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {day.short}
                  </Typography>
                </Box>
              }
              sx={{
                opacity: dayClasses.length > 0 ? 1 : 0.6,
              }}
            />
          )
        })}
      </Tabs>
    </Paper>
  )
}