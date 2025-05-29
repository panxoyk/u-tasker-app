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

import AppTheme from '@/theme/AppTheme';
import ColorModeSelect from '@/theme/ColorModeSelect';
import { GoogleIcon } from '@/components/CustomIcons';
import { signup } from '@/app/auth/signup/actions';
import { SignUpFormData } from '@/app/auth/signup/types';

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

const SignUp = (props: { disableCustomTheme?: boolean }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
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
            onSubmit={handleSubmit(signup)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <FormControl>
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
                  />
                </FormControl>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <FormControl>
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
                  />
                </FormControl>
              )}
            />
            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
              startIcon={<GoogleIcon />}
              disabled // Activar button al implementar auth con Google
            >
              Sign up with Google
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href="/auth/login" variant="body2" sx={{ alignSelf: 'center' }}>
                Log in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
};

export default SignUp;
