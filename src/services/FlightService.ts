import axios from 'axios';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
}

export interface FlightResult {
  airline: string;
  price: number;
  currency: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
}

export class FlightService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.FLIGHT_API_KEY || '';
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightResult[]> {
    try {
      // Example using a hypothetical flight API
      // Replace with actual API integration (Amadeus, Skyscanner, etc.)
      
      const response = await axios.get('https://api.example-flights.com/search', {
        params: {
          origin: params.origin,
          destination: params.destination,
          departDate: params.departDate,
          returnDate: params.returnDate,
          passengers: params.passengers,
          apikey: this.apiKey
        }
      });

      // Transform API response to our format
      return response.data.flights.map((flight: any) => ({
        airline: flight.airline,
        price: flight.price,
        currency: flight.currency,
        departure: flight.departureTime,
        arrival: flight.arrivalTime,
        duration: flight.duration,
        stops: flight.stops
      }));

    } catch (error) {
      // For demo purposes, return mock data
      console.error('Flight API error:', error);
      return this.getMockFlightData(params);
    }
  }

  private getMockFlightData(params: FlightSearchParams): FlightResult[] {
    return [
      {
        airline: 'Lufthansa',
        price: 450,
        currency: 'USD',
        departure: '2024-07-15T10:30:00Z',
        arrival: '2024-07-15T14:45:00Z',
        duration: '2h 15m',
        stops: 0
      },
      {
        airline: 'KLM',
        price: 380,
        currency: 'USD',
        departure: '2024-07-15T08:15:00Z',
        arrival: '2024-07-15T13:30:00Z',
        duration: '4h 15m',
        stops: 1
      }
    ];
  }
}