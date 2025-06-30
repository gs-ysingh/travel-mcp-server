import axios from 'axios';

export interface ExchangeRateParams {
  from: string;
  to: string;
  amount: number;
}

export interface ExchangeRateResult {
  from: string;
  to: string;
  rate: number;
  convertedAmount: number;
  lastUpdated: string;
}

export class CurrencyService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.EXCHANGE_API_KEY || '';
  }

  async getExchangeRate(params: ExchangeRateParams): Promise<ExchangeRateResult> {
    try {
      // Example using exchangerate-api.com or similar
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/${this.apiKey}/pair/${params.from}/${params.to}`);
      
      const rate = response.data.conversion_rate;
      const convertedAmount = params.amount * rate;

      return {
        from: params.from,
        to: params.to,
        rate: rate,
        convertedAmount: convertedAmount,
        lastUpdated: response.data.time_last_update_utc
      };

    } catch (error) {
      console.error('Currency API error:', error);
      // Return mock data for demo
      return {
        from: params.from,
        to: params.to,
        rate: 0.85, // Example USD to EUR rate
        convertedAmount: params.amount * 0.85,
        lastUpdated: new Date().toISOString()
      };
    }
  }
}