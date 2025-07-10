'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { signup } from '@/actions/auth';
import { SignUpFormData } from '@/types/auth';
import ColorModeSelect from '@/theme/ColorModeSelect';
import { Divider } from '@mui/material';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUpPage() {
  const [loading, setLoading] = React.useState(false); // New state for loading
  const [error, setError] = React.useState(''); // New state for general errors
  const [success, setSuccess] = React.useState(''); // New state for success messages

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setFormError, // Function to set specific form field errors
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true); // Set loading to true
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages
    try {
      const result = await signup(data); // Assuming `signup` returns a result or throws an error
    } catch (err: any) {
      // Handle unexpected errors (network issues, server errors)
      console.error('Signup error:', err);
      setError(err.message || 'An unexpected error occurred during signup. Please try again.');
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div>
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)} // Use the new onSubmit handler
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {error && ( // Display general error message if present
              <Alert severity="error">{error}</Alert>
            )}
            {success && ( // Display success message if present
              <Alert severity="success">{success}</Alert>
            )}
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              }}
              render={({ field }) => (
                <FormControl error={!!errors.email}>
                  <FormLabel htmlFor="email-signup">Email</FormLabel>
                  <TextField
                    {...field}
                    autoComplete="email"
                    required
                    type="email"
                    fullWidth
                    id="email-signup"
                    placeholder="your@email.com"
                    variant="outlined"
                    color="primary"
                    helperText={errors.email?.message}
                  />
                </FormControl>
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              }}
              render={({ field }) => (
                <FormControl error={!!errors.password}>
                  <FormLabel htmlFor="password-signup">Password</FormLabel>
                  <TextField
                    {...field}
                    autoComplete="new-password"
                    required
                    type="password"
                    fullWidth
                    placeholder="••••••"
                    id="password-signup"
                    variant="outlined"
                    color="primary"
                    helperText={errors.password?.message}
                  />
                </FormControl>
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading} // Disable button when loading
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} // Show spinner
            >
              {loading ? 'Signing up...' : 'Sign up'} {/* Change button text */}
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href="/auth/login" variant="body2" sx={{ alignSelf: 'center' }}>
                Log in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </div>
  );
}
