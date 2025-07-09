// addtaskform.tsx
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
import { Controller, useForm } from 'react-hook-form';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { useCallback } from 'react'; // Import useCallback

interface AddTaskFormProps {
  courses: CourseData[];
  coursesError?: string | null;
  onTaskAdded: () => void;
  showSnackbar: (message: string, severity: 'success' | 'error' | 'info') => void;
}

export default function AddTaskForm({ courses, coursesError, onTaskAdded, showSnackbar }: AddTaskFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddTaskFormData>({
    defaultValues: {
      title: '',
      course_id: courses.length > 0 ? courses[0].id : undefined, // Set to undefined if no courses
      due_date: '',
      description: '',
    },
  });

  const onSubmit = useCallback(async (formData: AddTaskFormData) => {
    const { success, error } = await addTask(formData);

    if (success) {
      reset(); // Reset the form fields
      showSnackbar('Tarea añadida correctamente.', 'success'); // Show success message
      onTaskAdded(); // Notify the parent component (HomePage)
    } else {
      showSnackbar(`Error al añadir la tarea: ${error || 'Unknown error'}`, 'error'); // Show error message
    }
  }, [reset, showSnackbar, onTaskAdded]); // Add dependencies

  return (
    <Box
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flexGrow: 1,
        // Remove overflowY and mt as HomePage will handle layout
        // overflowY: 'auto',
        // mt: { xs: 10, sm: 11 },
      }}
    >
      <Controller
        name="title"
        control={control}
        rules={{
          required: 'A task is required',
          minLength: {
            value: 2,
            message: 'Minimum 2 characters allowed',
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
              inputProps={{ // Correct prop for input attributes
                maxLength: 50,
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
              InputLabelProps={{ // Correct prop for input label attributes
                shrink: true,
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
              inputProps={{ // Correct prop for input attributes
                maxLength: 150,
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
      {/* Remove the Link to /tasks as we are now within HomePage */}
      {/* <Link href="/tasks"> */}
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            // Optionally, if you want a "Go to Tasks" button in the form
            // when embedded, you can navigate the parent component here.
            // For now, it will simply be removed as navigation is handled by the drawer.
          }}
        >
          View Tasks
        </Button>
      {/* </Link> */}
    </Box>
  );
}