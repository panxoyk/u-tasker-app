'use client';

import { addClass } from '@/actions/class';
import { AddClassFormData } from '@/types/class';
import { CourseData } from '@/types/course';
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
import Link from 'next/link';

interface AddClassFormProps {
  courses: CourseData[];
  coursesError?: string | null;
}

export default function AddClassForm({ courses, coursesError }: AddClassFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<AddClassFormData>({
    defaultValues: {
      day_of_the_week: 1,
      course_id: courses[0]?.id,
      start_time: '',
      end_time: '',
      classroom: '',
      type: 1,
    },
  });

  const daysOfTheWeek = [
    {
      day: 1,
      name: 'Monday',
    },
    {
      day: 2,
      name: 'Tuesday',
    },
    {
      day: 3,
      name: 'Wednesday',
    },
    {
      day: 4,
      name: 'Thursday',
    },
    {
      day: 5,
      name: 'Friday',
    },
    {
      day: 6,
      name: 'Saturday',
    },
    {
      day: 7,
      name: 'Sunday',
    },
  ];

  const classesTypes = [
    {
      id: 1,
      name: 'Cátedra',
    },
    {
      id: 2,
      name: 'Ayudantía',
    },
    {
      id: 3,
      name: 'Laboratorio',
    },
  ];

  const onSubmit = async (formData: AddClassFormData) => {
    const { success } = await addClass(formData);

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
        mt: 4,
      }}
    >
      <Controller
        name="day_of_the_week"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <FormLabel htmlFor="day_of_the_week-add-class">Day</FormLabel>
            <Select
              {...field}
              labelId="day_of_the_week-add-class"
              id="day_of_the_week"
              variant="outlined"
              autoFocus
              error={!!errors.day_of_the_week}
              displayEmpty
              inputProps={{ 'aria-label': 'Select day' }}
            >
              {daysOfTheWeek.map((day) => (
                <MenuItem key={day.day} value={day.day}>
                  {day.name}
                </MenuItem>
              ))}
            </Select>
            {errors.day_of_the_week && (
              <Typography color="error" variant="caption">
                {errors.day_of_the_week.message}
              </Typography>
            )}
          </FormControl>
        )}
      />
      <Controller
        name="course_id"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <FormLabel htmlFor="course-add-class">Course</FormLabel>
            <Select
              {...field}
              labelId="course-add-class"
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
        name="start_time"
        control={control}
        rules={{
          required: 'Start time is required',
        }}
        render={({ field }) => (
          <FormControl>
            <FormLabel htmlFor="start_time-add-class">Start Time</FormLabel>
            <TextField
              {...field}
              id="start_time-add-class"
              type="time"
              fullWidth
              variant="outlined"
              color="primary"
              error={!!errors.start_time}
              helperText={errors.start_time?.message}
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
        name="end_time"
        control={control}
        rules={{
          required: 'End time is required',
          validate: {
            isAfterStart: (value) => {
              const start_time = getValues('start_time');
              if (!start_time || !value) {
                return true;
              }
              const startDate = new Date(`2000-01-01T${start_time}:00`);
              const endDate = new Date(`2000-01-01T${value}:00`);
              return endDate > startDate || 'La hora de fin debe ser posterior a la hora de inicio';
            },
          },
        }}
        render={({ field }) => (
          <FormControl>
            <FormLabel htmlFor="end_time-add-class">End Time</FormLabel>
            <TextField
              {...field}
              id="end_time-add-class"
              type="time"
              fullWidth
              variant="outlined"
              color="primary"
              error={!!errors.end_time}
              helperText={errors.end_time?.message}
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
        name="type"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <FormLabel htmlFor="type-add-class">Class</FormLabel>
            <Select
              {...field}
              labelId="type-add-class"
              id="type"
              variant="outlined"
              autoFocus
              error={!!errors.type}
              displayEmpty
              inputProps={{ 'aria-label': 'Select Class' }}
            >
              {classesTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
            {errors.type && (
              <Typography color="error" variant="caption">
                {errors.type.message}
              </Typography>
            )}
          </FormControl>
        )}
      />
      <Controller
        name="classroom"
        control={control}
        render={({ field }) => (
          <FormControl>
            <FormLabel htmlFor="classroomo-add-class">Classroom</FormLabel>
            <TextField
              {...field}
              id="classroom-add-task"
              placeholder="K-306"
              fullWidth
              variant="outlined"
              color="primary"
              error={!!errors.classroom}
              helperText={errors.classroom?.message}
              slotProps={{
                htmlInput: {
                  maxLength: 20,
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
        Add Class to Timetable
      </Button>
      <Divider> Or </Divider>
      <Link href="/timetable">
        <Button variant="outlined" fullWidth>
          View Timetable
        </Button>
      </Link>
    </Box>
  );
}
