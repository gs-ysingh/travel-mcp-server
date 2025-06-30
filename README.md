# Travel MCP Server

A Model Context Protocol (MCP) server for comprehensive travel planning, providing flight search, accommodation booking, currency exchange, weather forecasting, and trip budget calculation capabilities.

## Features

- 🛫 **Flight Search**: Find and compare flights with various options
- 🏨 **Accommodation Search**: Search for hotels, vacation rentals, and other accommodations
- 💱 **Currency Exchange**: Get real-time exchange rates for travel budgeting
- 🌤️ **Weather Forecast**: Check weather conditions for your travel dates
- 💰 **Trip Budget Calculator**: Calculate and plan your travel expenses

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd travel-mcp-server
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys (see [API Keys Setup](#api-keys-setup))

## API Keys Setup

You'll need to obtain API keys from the following services:

1. **Flight API**: Amadeus, Skyscanner, or similar flight data provider
2. **Accommodation API**: Booking.com, Airbnb, or similar accommodation service
3. **Currency Exchange API**: Fixer.io, ExchangeRate-API, or similar service
4. **Weather API**: OpenWeatherMap, WeatherAPI, or similar weather service
5. **Google Places API**: For attractions and restaurant recommendations

Update your `.env` file with these keys:

```properties
FLIGHT_API_KEY=your_flight_api_key
BOOKING_API_KEY=your_booking_api_key
EXCHANGE_API_KEY=your_exchange_api_key
WEATHER_API_KEY=your_weather_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

## Usage

### Development

Run the server in development mode with hot reload:

```bash
npm run dev
```

### Production

Build and start the server:

```bash
npm run build
npm start
```

### Watch Mode

Run with automatic restart on file changes:

```bash
npm run watch
```

## Available Tools

The MCP server provides the following tools:

### 1. Search Flights (`search_flights`)

Search for flights between destinations with customizable options.

**Parameters:**

- `origin`: Departure airport/city
- `destination`: Arrival airport/city
- `departureDate`: Departure date
- `returnDate`: Return date (optional for one-way)
- `passengers`: Number of passengers
- `class`: Flight class (economy, business, first)

### 2. Search Accommodation (`search_accommodation`)

Find hotels, vacation rentals, and other accommodation options.

**Parameters:**

- `destination`: City or location
- `checkIn`: Check-in date
- `checkOut`: Check-out date
- `guests`: Number of guests
- `rooms`: Number of rooms
- `type`: Accommodation type (hotel, apartment, etc.)

### 3. Get Exchange Rate (`get_exchange_rate`)

Get current exchange rates between currencies.

**Parameters:**

- `from`: Source currency code (e.g., USD)
- `to`: Target currency code (e.g., EUR)
- `amount`: Amount to convert (optional)

### 4. Get Weather Forecast (`get_weather_forecast`)

Check weather conditions for your travel destination.

**Parameters:**

- `location`: City or location
- `date`: Date for forecast
- `days`: Number of days to forecast (optional)

### 5. Calculate Trip Budget (`calculate_trip_budget`)

Calculate estimated trip costs including flights, accommodation, and daily expenses.

**Parameters:**

- `destination`: Travel destination
- `duration`: Trip duration in days
- `travelers`: Number of travelers
- `category`: Budget category (budget, mid-range, luxury)

## Project Structure

```text
travel-mcp-server/
├── src/
│   ├── index.ts              # Main server entry point
│   └── services/
│       ├── FlightService.ts       # Flight search functionality
│       ├── AccommodationService.ts # Accommodation search
│       ├── CurrencyService.ts     # Currency exchange
│       └── WeatherService.ts      # Weather forecasting
├── dist/                     # Compiled TypeScript output
├── package.json             # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── .env                    # Environment variables (not in repo)
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Integration with MCP Clients

This server can be used with any MCP-compatible client such as:

- Claude Desktop
- Other AI assistants supporting MCP
- Custom MCP client applications

Add the server to your MCP client configuration:

```json
{
  "mcpServers": {
    "travel-planner": {
      "command": "npx",
      "args": ["travel-mcp-server"]
    }
  }
}
```

## Development Guide

### Tech Stack

- **TypeScript**: Type-safe JavaScript development
- **Node.js**: Runtime environment
- **MCP SDK**: Model Context Protocol implementation
- **Axios**: HTTP client for API requests
- **Zod**: Schema validation
- **dotenv**: Environment variable management

### Adding New Services

1. Create a new service class in `src/services/`
2. Implement the required methods
3. Register the service in `src/index.ts`
4. Add corresponding tools and handlers

### Running Tests

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed information
3. Provide logs and reproduction steps

## Roadmap

- [ ] Add more travel service integrations
- [ ] Implement caching for API responses
- [ ] Add travel itinerary planning
- [ ] Support for group travel coordination
- [ ] Integration with calendar services
- [ ] Mobile app companion

---

**Note**: Remember to keep your API keys secure and never commit them to version control. Always use environment variables for sensitive configuration.
