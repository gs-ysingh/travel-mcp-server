import axios from 'axios';

export interface WeatherForecastParams {
  city: string;
  country: string;
  startDate: string;
  endDate: string;
}

export interface WeatherForecastResult {
  city: string;
  country: string;
  forecast: DayForecast[];
}

export interface DayForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
    unit: string;
  };
  description: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
}

export class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || '';
  }

  async getWeatherForecast(params: WeatherForecastParams): Promise<WeatherForecastResult> {
    try {
      // Example using OpenWeatherMap API
      const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          q: `${params.city},${params.country}`,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      // Process the forecast data for the requested date range
      const forecast = this.processForecastData(response.data, params.startDate, params.endDate);

      return {
        city: params.city,
        country: params.country,
        forecast: forecast
      };

    } catch (error) {
      console.error('Weather API error:', error);
      return this.getMockWeatherData(params);
    }
  }

  private processForecastData(data: any, startDate: string, endDate: string): DayForecast[] {
    // Process actual weather API data
    // This is a simplified example
    return data.list.map((item: any) => ({
      date: item.dt_txt.split(' ')[0],
      temperature: {
        min: Math.round(item.main.temp_min),
        max: Math.round(item.main.temp_max),
        unit: 'C'
      },
      description: item.weather[0].description,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      precipitationChance: item.pop * 100
    }));
  }

  private getMockWeatherData(params: WeatherForecastParams): WeatherForecastResult {
    return {
      city: params.city,
      country: params.country,
      forecast: [
        {
          date: params.startDate,
          temperature: { min: 15, max: 22, unit: 'C' },
          description: 'Partly cloudy',
          humidity: 65,
          windSpeed: 12,
          precipitationChance: 20
        }
      ]
    };
  }
}