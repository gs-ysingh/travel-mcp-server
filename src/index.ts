#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import our service classes
import { FlightService } from './services/FlightService';
import { AccommodationService } from './services/AccommodationService';
import { CurrencyService } from './services/CurrencyService';
import { WeatherService } from './services/WeatherService';

class TravelMCPServer {
  private server: Server;
  private flightService: FlightService;
  private accommodationService: AccommodationService;
  private currencyService: CurrencyService;
  private weatherService: WeatherService;

  constructor() {
    this.server = new Server(
      {
        name: 'travel-planner-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize services
    this.flightService = new FlightService();
    this.accommodationService = new AccommodationService();
    this.currencyService = new CurrencyService();
    this.weatherService = new WeatherService();

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_flights',
            description: 'Search for flight prices and schedules',
            inputSchema: {
              type: 'object',
              properties: {
                origin: { type: 'string', description: 'Origin city/airport code' },
                destination: { type: 'string', description: 'Destination city/airport code' },
                departDate: { type: 'string', description: 'Departure date (YYYY-MM-DD)' },
                returnDate: { type: 'string', description: 'Return date (YYYY-MM-DD)', optional: true },
                passengers: { type: 'number', description: 'Number of passengers', default: 1 }
              },
              required: ['origin', 'destination', 'departDate']
            }
          },
          {
            name: 'search_accommodation',
            description: 'Search for hotels and accommodations',
            inputSchema: {
              type: 'object',
              properties: {
                city: { type: 'string', description: 'City name' },
                checkIn: { type: 'string', description: 'Check-in date (YYYY-MM-DD)' },
                checkOut: { type: 'string', description: 'Check-out date (YYYY-MM-DD)' },
                guests: { type: 'number', description: 'Number of guests', default: 1 },
                budget: { type: 'number', description: 'Maximum budget per night in USD', optional: true }
              },
              required: ['city', 'checkIn', 'checkOut']
            }
          },
          {
            name: 'get_exchange_rate',
            description: 'Get current currency exchange rates',
            inputSchema: {
              type: 'object',
              properties: {
                from: { type: 'string', description: 'Source currency code (e.g., USD)' },
                to: { type: 'string', description: 'Target currency code (e.g., EUR)' },
                amount: { type: 'number', description: 'Amount to convert', default: 1 }
              },
              required: ['from', 'to']
            }
          },
          {
            name: 'get_weather_forecast',
            description: 'Get weather forecast for travel dates',
            inputSchema: {
              type: 'object',
              properties: {
                city: { type: 'string', description: 'City name' },
                country: { type: 'string', description: 'Country name' },
                startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' }
              },
              required: ['city', 'country', 'startDate', 'endDate']
            }
          },
          {
            name: 'calculate_trip_budget',
            description: 'Calculate total estimated budget for a trip',
            inputSchema: {
              type: 'object',
              properties: {
                destinations: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'List of destination cities' 
                },
                duration: { type: 'number', description: 'Trip duration in days' },
                travelers: { type: 'number', description: 'Number of travelers', default: 1 },
                budgetLevel: { 
                  type: 'string', 
                  enum: ['budget', 'mid-range', 'luxury'],
                  description: 'Budget level preference'
                }
              },
              required: ['destinations', 'duration', 'budgetLevel']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_flights':
            return await this.handleSearchFlights(args);
          
          case 'search_accommodation':
            return await this.handleSearchAccommodation(args);
          
          case 'get_exchange_rate':
            return await this.handleGetExchangeRate(args);
          
          case 'get_weather_forecast':
            return await this.handleGetWeatherForecast(args);
          
          case 'calculate_trip_budget':
            return await this.handleCalculateTripBudget(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
            }
          ]
        };
      }
    });
  }

  // Tool handler methods
  private async handleSearchFlights(args: any) {
    const results = await this.flightService.searchFlights(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2)
        }
      ]
    };
  }

  private async handleSearchAccommodation(args: any) {
    const results = await this.accommodationService.searchAccommodation(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2)
        }
      ]
    };
  }

  private async handleGetExchangeRate(args: any) {
    const result = await this.currencyService.getExchangeRate(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  private async handleGetWeatherForecast(args: any) {
    const result = await this.weatherService.getWeatherForecast(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  private async handleCalculateTripBudget(args: any) {
    // Combine data from multiple services
    const budget = await this.calculateBudget(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(budget, null, 2)
        }
      ]
    };
  }

  private async calculateBudget(params: any): Promise<any> {
    // This would combine flight, accommodation, and other costs
    // Implementation depends on your specific requirements
    return {
      totalBudget: 2500,
      breakdown: {
        flights: 800,
        accommodation: 1200,
        food: 350,
        activities: 150
      },
      currency: 'USD'
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Travel MCP server running on stdio');
  }
}

// Start the server
const server = new TravelMCPServer();
server.run().catch(console.error);