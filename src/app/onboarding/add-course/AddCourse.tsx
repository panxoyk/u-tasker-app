import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Controller, useForm } from 'react-hook-form';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { steps } from '@/app/onboarding/data';
import { AddCourseFormData } from '@/app/onboarding/add-course/types';
import AppTheme from '@/theme/AppTheme';
import HorizontalLinearLabelStepper from '@/components/HorizontalLinearLabelStepper';
import { addCourse } from '@/app/onboarding/add-course/actions';

const AddCourse = (props: { disableCustomTheme?: boolean }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCourseFormData>({
    defaultValues: {
      course: '',
      code: '',
      credits: '',
    },
  });

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Container maxWidth="xs" sx={{ marginTop: 8 }}>
        <Box
          component={'form'}
          onSubmit={handleSubmit(addCourse)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Add your first course
          </Typography>
          <Controller
            name="course"
            control={control}
            rules={{
              required: 'A name is required',
              minLength: { value: 2, message: 'Minimum 2 characters' },
              maxLength: {
                value: 100,
                message: 'Maximum 100 characters allowed',
              },
            }}
            render={({ field }) => (
              <FormControl>
                <FormLabel htmlFor="name-add-course">Name</FormLabel>
                <TextField
                  {...field}
                  id="name-add-course"
                  placeholder="Physics"
                  autoFocus
                  fullWidth
                  variant="outlined"
                  color="primary"
                  error={!!errors.course}
                  helperText={errors.course?.message}
                  slotProps={{
                    htmlInput: {
                      maxLength: 100,
                    },
                  }}
                />
              </FormControl>
            )}
          />
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel htmlFor="code-setup-name">Code</FormLabel>
                <TextField
                  {...field}
                  id="code-add-course"
                  placeholder="PHY"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  slotProps={{
                    htmlInput: {
                      maxLength: 20,
                    },
                  }}
                />
              </FormControl>
            )}
          />
          <Controller
            name="credits"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel htmlFor="credits-setup-name">Credits</FormLabel>
                <TextField
                  {...field}
                  id="credits-add-course"
                  placeholder="5"
                  fullWidth
                  type="number"
                  variant="outlined"
                  color="primary"
                  slotProps={{
                    htmlInput: {
                      maxLength: 10,
                    },
                  }}
                />
              </FormControl>
            )}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Continue
          </Button>
          <HorizontalLinearLabelStepper steps={steps} activeStep={2} />
        </Box>
      </Container>
    </AppTheme>
  );
};

export default AddCourse;
