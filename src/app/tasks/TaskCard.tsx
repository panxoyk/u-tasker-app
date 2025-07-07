'use client';

import { TaskData } from '@/types/task';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';

interface TaskCardProps {
  task: TaskData;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.warning', fontSize: 14 }}>
          {task.course.name}
        </Typography>
        <Typography variant="h5" component="div">
          {task.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
          Due date: {task.due_date || 'No'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
      </CardContent>
      {/* Agregar botones de eliminar y mover de stage */}
    </Card>
  );
}
