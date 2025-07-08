'use client';

import { TaskData } from '@/types/task';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useState } from 'react';
import { deleteTask, updateStatusTask } from '@/actions/task';

interface TaskCardProps {
  task: TaskData;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTask(task.id);
    setIsDeleting(false);
  };

  const handleStart = async () => {
    setIsStarting(true);
    await updateStatusTask(task.id, 2);
    setIsStarting(false);
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    await updateStatusTask(task.id, 3);
    setIsCompleting(false);
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Chip label={task.course.name} sx={{ mb: 0.5 }} />
        <Typography variant="h5" component="div">
          {task.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
          Due date: {task.due_date || 'No'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {task.description}
        </Typography>
      </CardContent>
      <CardActions>
        {task.status === 1 && (
          <>
            <Button
              size="medium"
              color="error"
              variant="contained"
              startIcon={<DeleteOutlineOutlinedIcon />}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete
            </Button>
            <Button
              size="medium"
              color="success"
              variant="contained"
              endIcon={<PlayCircleOutlineOutlinedIcon />}
              onClick={handleStart}
              disabled={isStarting}
            >
              Start
            </Button>
          </>
        )}
        {task.status === 2 && (
          <Button
            size="medium"
            color="success"
            variant="contained"
            startIcon={<CheckCircleOutlineOutlinedIcon />}
            onClick={handleComplete}
            disabled={isCompleting}
          >
            Complete
          </Button>
        )}
        {task.status === 4 && (
          <Button
            size="medium"
            color="error"
            variant="contained"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
