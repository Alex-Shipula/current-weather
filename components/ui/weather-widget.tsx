'use client';

import React from 'react';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import RainIcon from '@mui/icons-material/Grain';
import AirIcon from '@mui/icons-material/Air';
import SnowIcon from '@mui/icons-material/AcUnit';
import OpacityIcon from '@mui/icons-material/Opacity';
import { useWeatherContext } from '@/context/WeatherContext';

interface WeatherWidgetProps {
  size?: 'small' | 'wide' | 'large';
}

export function WeatherWidget({ size = 'small' }: WeatherWidgetProps) {
  const { weatherData, loading, error } = useWeatherContext();

  if (loading) {
    return (
      <Paper sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    );
  }

  if (!weatherData) {
    return (
      <Alert severity="info" sx={{ width: '100%' }}>
        Waiting for weather weatherData...
      </Alert>
    );
  }

  const getWeatherIcon = (main: string) => {
    switch (main.toLowerCase()) {
      case 'clear':
        return <WbSunnyIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
      case 'clouds':
        return <CloudIcon sx={{ fontSize: 40, color: 'secondary.main' }} />;
      case 'rain':
        return <RainIcon sx={{ fontSize: 40, color: 'secondary.main' }} />;
      case 'snow':
        return <SnowIcon sx={{ fontSize: 40, color: 'secondary.main' }} />;
      default:
        return <WbSunnyIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
    }
  };

  const widgetStyles = {
    small: {
      width: '100%',
      maxWidth: 300,
      p: { xs: 2, sm: 3 },
    },
    wide: {
      width: '100%',
      maxWidth: 600,
      p: { xs: 2, sm: 4 },
    },
    large: {
      width: '100%',
      maxWidth: 800,
      p: { xs: 2, sm: 4 },
    },
  };

  return (
    <Paper
      elevation={3}
      sx={{
        ...widgetStyles[size],
        mx: 'auto',
        borderRadius: 2,
        background: 'linear-gradient(145deg, #1a237e 0%, #0d47a1 100%)',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {weatherData.location.name}, {weatherData.location.country}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          {getWeatherIcon(weatherData.current.weather.main)}
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {weatherData.current.temp}°C
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
          {weatherData.current.weather.description}
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        mt: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <OpacityIcon />
          <Typography>
            Humidity: {weatherData.current.humidity}%
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AirIcon />
          <Typography>
            Wind: {weatherData.current.wind_speed} m/s
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WbSunnyIcon />
          <Typography>
            Feels like: {weatherData.current.feels_like}°C
          </Typography>
        </Box>
      </Box>

      {(size === 'wide' || size === 'large') && (
        <Box sx={{
          mt: 4,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          gap: 2
        }}>
          {weatherData.daily.map((day, index) => (
            <Paper
              key={day.dt}
              sx={{
                p: 2,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </Typography>
              {getWeatherIcon(day.weather.main)}
              <Typography variant="body2" sx={{ mt: 1 }}>
                {day.temp.max}° / {day.temp.min}°
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
}