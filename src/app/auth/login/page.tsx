'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import Alert from '@mui/material/Alert'; // Import Alert

import ForgotPassword from '@/components/ForgotPassword';
import AppTheme from '@/theme/AppTheme';
import ColorModeSelect from '@/theme/ColorModeSelect';
import { GoogleIcon } from '@/components/CustomIcons';
import { LogInFormData } from '@/types/auth';
import { login } from '@/actions/auth'; // Assuming this is an async function

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const LogInContainer = styled(Stack)(({ theme }) => ({
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

export default function LoginPage() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false); // New state for loading
  const [error, setError] = React.useState(''); // New state for errors

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setFormError, // Function to set specific form field errors
  } = useForm<LogInFormData>({ defaultValues: { email: '', password: '' } });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: LogInFormData) => {
    setLoading(true); // Set loading to true when submission starts
    setError(''); // Clear previous errors
    try {
      const result = await login(data); // Assuming `login` returns a result or throws an error

    } catch (err: any) {
      // Handle unexpected errors (network issues, server errors, etc.)
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred during login. Please try again.');
    } finally {
      setLoading(false); // Set loading to false when submission finishes
    }
  };

  return (
    <div>
      <LogInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: '100%',
              fontSize: 'clamp(2rem, 10vw, 2.15rem)',
            }}
          >
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)} // Use the new onSubmit handler
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            {error && ( // Display general error message if present
              <Alert severity="error">{error}</Alert>
            )}
            <Controller
              name="email"
              control={control}
              rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } }}
              render={({ field }) => (
                <FormControl error={!!errors.email}>
                  <FormLabel htmlFor="email-login">Email</FormLabel>
                  <TextField
                    {...field}
                    id="email-login"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    autoFocus
                    required
                    fullWidth
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
              rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
              render={({ field }) => (
                <FormControl error={!!errors.password}>
                  <FormLabel htmlFor="password-login">Password</FormLabel>
                  <TextField
                    {...field}
                    placeholder="••••••"
                    type="password"
                    id="password-login"
                    autoComplete="current-password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color="primary"
                    helperText={errors.password?.message}
                  />
                </FormControl>
              )}
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading} // Disable button when loading
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} // Show spinner
            >
              {loading ? 'Logging in...' : 'Continue'} {/* Change button text */}
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" variant="body2" sx={{ alignSelf: 'center' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </LogInContainer>
    </div>
  );
}