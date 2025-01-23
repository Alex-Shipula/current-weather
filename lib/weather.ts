import { ForecastDay } from "./types";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export async function fetchWeatherData(lat: number, lon: number) {
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
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    const dailyForecasts: ForecastDay[] = forecastData.list.reduce((acc: ForecastDay[],
      item: {
        dt: number; main: { temp_min: number; temp_max: number; temp: number };
        weather: { main: string; description: string; icon: string }[]
      }) => {
      const date = new Date(item.dt * 1000).setHours(0, 0, 0, 0);
      if (!acc.find((forecast) => new Date(forecast.dt * 1000).setHours(0, 0, 0, 0) === date)) {
        acc.push({
          dt: item.dt,
          temp: {
            min: Math.round(item.main.temp_min),
            max: Math.round(item.main.temp_max),
            day: Math.round(item.main.temp)
          },
          weather: {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon
          }
        });
      }
      return acc;
    }, []).slice(0, 5);

    return {
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
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw new Error('Failed to fetch weather data');
  }
}