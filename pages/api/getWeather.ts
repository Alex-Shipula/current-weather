import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

if (!API_KEY) {
  throw new Error('Missing OpenWeather API key in environment variables.');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { lat, lon } = req.body;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required.' });
  }

  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      )
    ]);

    if (!weatherResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data.');
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    const dailyForecasts = forecastData.list.reduce(
      (acc: any[], item: { dt: number; main: any; weather: any[] }) => {
        const date = new Date(item.dt * 1000).setHours(0, 0, 0, 0);
        if (!acc.find((forecast) => new Date(forecast.dt * 1000).setHours(0, 0, 0, 0) === date)) {
          acc.push({
            dt: item.dt,
            temp: {
              min: Math.round(item.main.temp_min),
              max: Math.round(item.main.temp_max),
              day: Math.round(item.main.temp),
            },
            weather: {
              main: item.weather[0].main,
              description: item.weather[0].description,
              icon: item.weather[0].icon,
            },
          });
        }
        return acc;
      },
      []
    ).slice(0, 5);

    const response = {
      location: {
        name: weatherData.name,
        country: weatherData.sys.country,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
      },
      current: {
        temp: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        wind_speed: weatherData.wind.speed,
        weather: {
          main: weatherData.weather[0].main,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
        },
      },
      daily: dailyForecasts,
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
}
