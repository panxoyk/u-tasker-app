'use client';

import { useState } from 'react';
import { Box, IconButton, AppBar, Toolbar, Typography, Button } from '@mui/material'; // Importamos AppBar y Toolbar
import TasksList from '@/app/tasks/TasksList';
import { TaskData } from '@/types/task';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Link from 'next/link';

interface TasksCarouselProps {
  tasksPendiente: TaskData[];
  tasksEnProceso: TaskData[];
  tasksEntregada: TaskData[];
  tasksVencida: TaskData[];
}

export default function TasksCarousel({
  tasksPendiente,
  tasksEnProceso,
  tasksEntregada,
  tasksVencida,
}: TasksCarouselProps) {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = 4;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const sections = [
    <TasksList key="pendientes" title="Pendientes" tasks={tasksPendiente} />,
    <TasksList key="en-proceso" title="En Proceso" tasks={tasksEnProceso} />,
    <TasksList key="entregadas" title="Entregadas" tasks={tasksEntregada} />,
    <TasksList key="vencidas" title="Vencidas" tasks={tasksVencida} />,
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        {sections.map((section, index) => (
          <div key={index} hidden={index !== activeStep}>
            {section}
          </div>
        ))}
      </Box>
      <AppBar position="fixed" color="transparent" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            aria-label="back"
            onClick={handleBack}
            disabled={activeStep === 0}
            color="inherit"
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton
            aria-label="next"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
            color="inherit"
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
