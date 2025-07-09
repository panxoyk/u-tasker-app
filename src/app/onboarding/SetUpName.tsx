'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Controller, useForm } from 'react-hook-form';

import { redirect } from 'next/navigation';
import HorizontalLinearLabelStepper from '@/components/HorizontalLinearLabelStepper';
import { UpdateFullNameFormData } from '@/types/profile';
import { updateFullName } from '@/actions/profile';

interface SetUpnameOnBoardingProps {
  handleNext: () => void;
  steps: string[];
}

export default function SetUpNameOnBoarding(props: SetUpnameOnBoardingProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFullNameFormData>({
    defaultValues: {
      name: '',
      last_name: '',
    },
  });

  const onSubmit = async (formData: UpdateFullNameFormData) => {
    const result = await updateFullName(formData);

    if (result.success) {
      props.handleNext();
    } else {
      redirect('/error');
    }
  };

  return (
    <div>
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
            Complete your personal information
          </Typography>
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'First name is required',
              minLength: { value: 2, message: 'Minimum 2 characters' },
              maxLength: {
                value: 50,
                message: 'Maximum 50 characters allowed',
              },
            }}
            render={({ field }) => (
              <FormControl>
                <FormLabel htmlFor="name-setup-name">First Name</FormLabel>
                <TextField
                  {...field}
                  id="name-setup-name"
                  autoComplete="name"
                  placeholder="John"
                  autoFocus
                  fullWidth
                  variant="outlined"
                  color="primary"
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
            name="last_name"
            control={control}
            rules={{
              required: 'Last name is required',
              minLength: { value: 2, message: 'Minimum 2 characters' },
              maxLength: {
                value: 50,
                message: 'Maximum 50 characters allowed',
              },
            }}
            render={({ field }) => (
              <FormControl>
                <FormLabel htmlFor="last-name-setup-name">Last Name</FormLabel>
                <TextField
                  {...field}
                  id="last-name-setup-name"
                  autoComplete="family-name"
                  placeholder="Snow"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  slotProps={{
                    htmlInput: {
                      maxLength: 50,
                    },
                  }}
                />
              </FormControl>
            )}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Continue
          </Button>
          <HorizontalLinearLabelStepper steps={props.steps} activeStep={0} />
        </Box>
      </Container>
    </div>
  );
}
