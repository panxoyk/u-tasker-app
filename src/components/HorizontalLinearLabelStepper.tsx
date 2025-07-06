import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

interface HorizontalLinearLabelStepperProps {
  activeStep: number;
  steps: string[];
}

export default function HorizontalLinearLabelStepper({
  activeStep,
  steps,
}: HorizontalLinearLabelStepperProps) {
  return (
    <Box sx={{ width: '100%', mt: 8 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
