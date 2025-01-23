'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme'; 
import { WeatherWidget } from '@/components/ui/weather-widget';
import { WeatherProvider } from '@/context/WeatherContext';
import { ThemeRegistry } from '@/components/ThemeRegistry';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <ThemeRegistry>
      <WeatherProvider>
        <Box sx={{ minHeight: '100vh', py: { xs: 2, sm: 4, md: 8 } }}>
          <Container maxWidth="lg">
            {isMobile && <WeatherWidget size="small" />}
            {isTablet && <WeatherWidget size="wide" />}
            {!isMobile && !isTablet && <WeatherWidget size="large" />}
          </Container>
        </Box>
      </WeatherProvider>
    </ThemeRegistry>
  );
}
