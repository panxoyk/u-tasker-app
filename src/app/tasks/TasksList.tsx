'use client';

import { TaskData } from '@/types/task';
import { Box, Typography, Divider, Stack } from '@mui/material';
import TaskCard from './TaskCard';

interface TasksListProps {
  title: string;
  tasks: TaskData[];
}

export default function TasksList({ title, tasks }: TasksListProps) {
  return (
    <Box>
      <Typography variant="h4" component={'div'} gutterBottom sx={{ mt: 2, flexGrow: 1 }}>
        {title}
      </Typography>
      <Divider />
      <Stack spacing={2} sx={{ mt: 2 }}>
        {tasks.map((task: TaskData) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Stack>
    </Box>
  );
}
