"use client";

import type { TaskData } from "@/types/task"
import { Box, Paper, Typography, Chip, Button, Stack, Divider } from "@mui/material"
import Link from "next/link"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined"

interface TaskStatsProps {
  tasksData: TaskData[]
}

export default function TaskStats({ tasksData }: TaskStatsProps) {
  const getTasksByStatus = () => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0 }

    tasksData.forEach((task) => {
      if (stats.hasOwnProperty(task.status)) {
        stats[task.status as keyof typeof stats]++
      }
    })

    return stats
  }

  const getUniqueCoursesWithTasks = () => {
    const courses = new Set(tasksData.map((t) => t.course.name))
    return courses.size
  }

  const getPendingTasks = () => {
    return tasksData.filter((task) => task.status === 1).length
  }

  const taskStats = getTasksByStatus()
  const uniqueCourses = getUniqueCoursesWithTasks()
  const pendingTasks = getPendingTasks()
  const totalTasks = tasksData.length

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1:
        return { label: "Pendientes", emoji: "📋", color: "warning" as const }
      case 2:
        return { label: "En Progreso", emoji: "⏳", color: "info" as const }
      case 3:
        return { label: "Completadas", emoji: "✅", color: "success" as const }
      case 4:
        return { label: "Canceladas", emoji: "❌", color: "error" as const }
      default:
        return { label: "Tarea", emoji: "📝", color: "default" as const }
    }
  }

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}>
        Resumen de Tareas
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
            {totalTasks}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "warning.main" }}>
            {pendingTasks}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Pendientes
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
            {uniqueCourses}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Materias
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
        {Object.entries(taskStats).map(([status, count]) => {
          if (count === 0) return null
          const statusInfo = getStatusInfo(Number(status))
          return (
            <Chip
              key={status}
              label={`${statusInfo.emoji} ${statusInfo.label}: ${count}`}
              size="small"
              variant="outlined"
              color={statusInfo.color}
              sx={{ fontSize: "0.7rem" }}
            />
          )
        })}
      </Box>

      <Stack sx={{ mt: 2 }} spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <Link href={"/tasks"}>
            <Button fullWidth variant="outlined" startIcon={<AssignmentOutlinedIcon />}>
              Ver Lista de Tareas
            </Button>
          </Link>
        </Box>
        <Divider />
        <Box sx={{ flexGrow: 1 }}>
          <Link href={"/tasks/add"}>
            <Button fullWidth variant="outlined" startIcon={<AddOutlinedIcon />}>
              Añadir Tarea
            </Button>
          </Link>
        </Box>
      </Stack>
    </Paper>
  )
}