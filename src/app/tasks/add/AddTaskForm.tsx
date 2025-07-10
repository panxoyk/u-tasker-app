'use client';

import { addTask } from '@/actions/task';
import { CourseData } from '@/types/course';
import { AddTaskFormData } from '@/types/task';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

interface AddTaskFormProps {
  courses: CourseData[];
  coursesError?: string | null;
}

export default function AddTaskForm({ courses, coursesError }: AddTaskFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddTaskFormData>({
    defaultValues: {
      title: '',
      course_id: courses[0]?.id,
      due_date: '',
      description: '',
    },
  });

  const onSubmit = async (formData: AddTaskFormData) => {
    const { success } = await addTask(formData);

    if (success) {
      reset();
    }
  };

  return (
    <Box
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flexGrow: 1,
        overflowY: 'auto',
        mt: { xs: 10, sm: 11 },
      }}
    >
      <Controller
        name="title"
        control={control}
        rules={{
          required: 'A task is required',
          minLength: {
            value: 2,
            message: 'Minimun 2 characters allowed',
          },
          maxLength: {
            value: 50,
            message: 'Maximum 50 characters allowed',
          },
        }}
        render={({ field }) => (
          <FormControl>
            <FormLabel htmlFor="title-add-task">Task</FormLabel>
            <TextField
              {...field}
              id="title-add-task"
              placeholder="My new task"
              autoFocus
              fullWidth
              variant="outlined"
              color="primary"
              error={!!errors.title}
              helperText={errors.title?.message}
              slotProps={{
                htmlInput: {
                  maxLength: 50,
                },
              }}
            />
          </FormControl>
        )}
      />
      <Controller
        name="course_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <FormLabel htmlFor="course-add-task">Course</FormLabel>
            <Select
              {...field}
              labelId="course-add-task"
              id="course"
              variant="outlined"
              error={!!errors.course_id}
              displayEmpty
              inputProps={{ 'aria-label': 'Select course' }}
            >
              {coursesError ? (
                <MenuItem disabled>Error loading courses: {coursesError}</MenuItem>
              ) : courses.length === 0 ? (
                <MenuItem disabled>No courses for this period</MenuItem>
              ) : (
                courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.course_id && (
              <Typography color="error" variant="caption">
                {errors.course_id.message}
              </Typography>
            )}
          </FormControl>
        )}
      />
      <Controller
        name="due_date"
        control={control}
        render={({ field }) => (
          <FormControl>
            <FormLabel htmlFor="due_date-add-task">Due Date</FormLabel>
            <TextField
              {...field}
              id="due_date-add-task"
              type="datetime-local"
              fullWidth
              variant="outlined"
              color="primary"
              error={!!errors.due_date}
              helperText={errors.due_date?.message}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </FormControl>
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <FormControl>
            <FormLabel htmlFor="description-add-task">Description</FormLabel>
            <TextField
              {...field}
              id="description-add-task"
              placeholder="..."
              fullWidth
              variant="outlined"
              color="primary"
              error={!!errors.description}
              helperText={errors.description?.message}
              slotProps={{
                htmlInput: {
                  maxLength: 150,
                },
              }}
            />
          </FormControl>
        )}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        startIcon={<CheckOutlinedIcon />}
      >
        Add Task
      </Button>
      <Divider> Or </Divider>
      <Link href="/tasks">
        <Button variant="outlined" fullWidth>
          View Tasks
        </Button>
      </Link>
    </Box>
  );
}
