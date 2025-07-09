'use client';

import { Box } from '@mui/material';
import { useState } from 'react';
import SetUpName from './SetUpName';
import CreatePeriod from './CreatePeriod';
import AddCourse from './AddCourse';

export default function OnBoardingPage() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const steps = [
    'Complete your personal information',
    'Set up your first academic period',
    'Add your first course',
  ];

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <SetUpName handleNext={handleNext} steps={steps} />;
      case 1:
        return <CreatePeriod handleNext={handleNext} steps={steps} />;
      case 2:
        return <AddCourse handleNext={handleNext} steps={steps} />;
    }
  };

  return <Box sx={{ width: '100%' }}>{getStepContent(activeStep)}</Box>;
}
