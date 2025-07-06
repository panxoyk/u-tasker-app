'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Controller, useForm } from 'react-hook-form';

import { redirect } from 'next/navigation';
import { createPeriod } from '@/actions/period';
import { CreatePeriodFormData } from '@/types/period';
import AppTheme from '@/theme/AppTheme';
import HorizontalLinearLabelStepper from '@/components/HorizontalLinearLabelStepper';

interface CreatePeriodOnBoardingProps {
  handleNext: () => void;
  steps: string[];
  disableCustomTheme?: boolean;
}

const CreatePeriodOnBoarding = (props: CreatePeriodOnBoardingProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePeriodFormData>({
    defaultValues: {
      period: '',
    },
  });

  const onSubmit = async (formData: CreatePeriodFormData) => {
    const result = await createPeriod(formData);

    if (result.success) {
      props.handleNext();
    } else {
      redirect('/error');
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Container maxWidth="xs" sx={{ marginTop: 8 }}>
        <Box
          component={'form'}
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Set up your first academic period
          </Typography>
          <Controller
            name="period"
            control={control}
            rules={{
              required: 'A period is required',
              maxLength: {
                value: 20,
                message: 'Maximum 20 characters allowed',
              },
            }}
            render={({ field }) => (
              <FormControl>
                <FormLabel htmlFor="label-create-period">Period</FormLabel>
                <TextField
                  {...field}
                  id="label-create-period"
                  placeholder="2025-1"
                  autoFocus
                  fullWidth
                  variant="outlined"
                  color="primary"
                  error={!!errors.period}
                  helperText={errors.period?.message}
                  slotProps={{
                    htmlInput: {
                      maxLength: 20,
                    },
                  }}
                />
              </FormControl>
            )}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Continue
          </Button>
          <HorizontalLinearLabelStepper steps={props.steps} activeStep={1} />
        </Box>
      </Container>
    </AppTheme>
  );
};

export default CreatePeriodOnBoarding;
