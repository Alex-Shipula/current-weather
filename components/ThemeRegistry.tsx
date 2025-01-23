'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0A1128',
      paper: '#1B2541',
    },
    primary: {
      main: '#FF9D42',
    },
    secondary: {
      main: '#42A4FF',
    },
    text: {
      primary: '#ffffff',
      secondary: '#A1B3D0',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'inherit',
  },
});

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}