'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WeatherContextType, WeatherData } from '@/lib/types';

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );

  async function getWeather(lat: number, lon: number) {
    const response = await fetch('/api/getWeather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lon }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    return response.json();
  };

  const fetchData = useCallback((lat: number, lon: number) => {
    setLoading(true);
    getWeather(lat, lon)
      .then((data: WeatherData) => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch((error: Error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          setError('Unable to get location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      getWeather(location.lat, location.lon)
        .then((data: WeatherData) => {
          setWeatherData(data);
          setLoading(false);
        })
        .catch((error: Error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [location, setWeatherData]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        error,
        fetchWeatherData: fetchData,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}