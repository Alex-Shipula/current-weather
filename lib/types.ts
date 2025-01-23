
export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  };
  daily: ForecastDay[];
}

export interface ForecastDay {
  dt: number;
  temp: {
    min: number;
    max: number;
    day: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
}

export interface WeatherContextType {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  fetchWeatherData: (lat: number, lon: number) => void;
}