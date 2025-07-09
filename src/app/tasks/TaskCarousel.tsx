"use client"

import { useState } from "react"
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  MobileStepper,
  Slide,
  Grid,
  useTheme,
  alpha,
  Fade,
} from "@mui/material"
import { ArrowForwardIos, ArrowBackIosNew, Schedule, PlayArrow, CheckCircle, Error } from "@mui/icons-material"
import type { TaskData } from "@/types/task"

interface TasksCarouselProps {
  tasksPendiente: TaskData[]
  tasksEnProceso: TaskData[]
  tasksEntregada: TaskData[]
  tasksVencida: TaskData[]
}

export default function TaskCarousel({
  tasksPendiente,
  tasksEnProceso,
  tasksEntregada,
  tasksVencida,
}: TasksCarouselProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left")
  const theme = useTheme()

  const sections = [
    {
      key: "pendientes",
      title: "Pendientes",
      tasks: tasksPendiente,
      icon: <Schedule />,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
    },
    {
      key: "en-proceso",
      title: "En Proceso",
      tasks: tasksEnProceso,
      icon: <PlayArrow />,
      color: theme.palette.info.main,
      bgColor: alpha(theme.palette.info.main, 0.1),
    },
    {
      key: "entregadas",
      title: "Entregadas",
      tasks: tasksEntregada,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
    },
    {
      key: "vencidas",
      title: "Vencidas",
      tasks: tasksVencida,
      icon: <Error />,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1),
    },
  ]

  const maxSteps = sections.length
  const currentSection = sections[activeStep]

  const handleNext = () => {
    setSlideDirection("left")
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps)
  }

  const handleBack = () => {
    setSlideDirection("right")
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps)
  }

  const goToStep = (step: number) => {
    setSlideDirection(step > activeStep ? "left" : "right")
    setActiveStep(step)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: currentSection.bgColor,
          transition: "background-color 0.3s ease",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ color: currentSection.color }}>{currentSection.icon}</Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {currentSection.title}
          </Typography>
          <Chip
            label={`${currentSection.tasks.length} tareas`}
            size="small"
            sx={{
              bgcolor: currentSection.color,
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handleBack}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <ArrowBackIosNew />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </Box>

      {/* Stepper */}
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{
          bgcolor: "transparent",
          justifyContent: "center",
          mb: 2,
          "& .MuiMobileStepper-dot": {
            bgcolor: alpha(theme.palette.text.primary, 0.3),
          },
          "& .MuiMobileStepper-dotActive": {
            bgcolor: currentSection.color,
          },
        }}
        nextButton={<div />}
        backButton={<div />}
      />

      {/* Content */}
      <Card
        sx={{
          minHeight: 400,
          bgcolor: currentSection.bgColor,
          transition: "background-color 0.3s ease",
          border: `2px solid ${alpha(currentSection.color, 0.3)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ position: "relative", minHeight: 300, overflow: "hidden" }}>
            {sections.map((section, index) => (
              <Slide
                key={section.key}
                direction={slideDirection}
                in={index === activeStep}
                mountOnEnter
                unmountOnExit
                timeout={300}
              >
                <Box
                  sx={{
                    position: index === activeStep ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  {section.tasks.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography variant="h6" color="text.secondary">
                        No hay tareas en {section.title.toLowerCase()}
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {section.tasks.map((task) => (
                        <Grid item xs={12} sm={6} md={4} key={task.id}>
                          <Card sx={{ height: "100%" }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                {task.title}
                              </Typography>
                              {task.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {task.description}
                                </Typography>
                              )}
                              {task.dueDate && (
                                <Chip
                                  label={`Vence: ${new Date(task.dueDate).toLocaleDateString()}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Slide>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <Fade in timeout={500}>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {sections.map((section, index) => (
            <Grid item xs={6} md={3} key={section.key}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: index === activeStep ? "scale(1.05)" : "scale(1)",
                  border: index === activeStep ? `2px solid ${section.color}` : "2px solid transparent",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: theme.shadows[4],
                  },
                }}
                onClick={() => goToStep(index)}
              >
                <CardContent sx={{ textAlign: "center", py: 2 }}>
                  <Box sx={{ color: section.color, mb: 1 }}>{section.icon}</Box>
                  <Typography variant="caption" display="block" fontWeight="medium">
                    {section.title}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {section.tasks.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Fade>
    </Box>
  )
}
