import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import AppTheme from '@/theme/AppTheme';
import HorizontalLinearLabelStepper from '@/components/HorizontalLinearLabelStepper';
import { steps } from '@/app/onboarding/data';
import { useForm } from 'react-hook-form';

const CreatePeriod = (props: { disableCustomTheme?: boolean }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      name: '',
      last_name: '',
    },
  });

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <HorizontalLinearLabelStepper steps={steps} activeStep={1} />
    </AppTheme>
  );
};

export default CreatePeriod;
