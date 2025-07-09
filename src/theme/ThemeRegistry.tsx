'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import AppTheme from '@/theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';

export default function ThemeRegistry(props: {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
}) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        {props.children}
      </AppTheme>
    </AppRouterCacheProvider>
  );
}
