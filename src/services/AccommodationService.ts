import axios from 'axios';

export interface AccommodationSearchParams {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  budget?: number;
}

export interface AccommodationResult {
  name: string;
  type: 'hotel' | 'apartment' | 'hostel';
  price: number;
  currency: string;
  rating: number;
  address: string;
  amenities: string[];
  imageUrl?: string;
}

export class AccommodationService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.BOOKING_API_KEY || '';
  }

  async searchAccommodation(params: AccommodationSearchParams): Promise<AccommodationResult[]> {
    try {
      // Replace with actual Booking.com or Airbnb API integration
      const response = await axios.get('https://api.example-booking.com/search', {
        params: {
          city: params.city,
          checkin: params.checkIn,
          checkout: params.checkOut,
          guests: params.guests,
          max_price: params.budget,
          apikey: this.apiKey
        }
      });

      return response.data.hotels.map((hotel: any) => ({
        name: hotel.name,
        type: hotel.type,
        price: hotel.price,
        currency: hotel.currency,
        rating: hotel.rating,
        address: hotel.address,
        amenities: hotel.amenities,
        imageUrl: hotel.imageUrl
      }));

    } catch (error) {
      console.error('Accommodation API error:', error);
      return this.getMockAccommodationData(params);
    }
  }

  private getMockAccommodationData(params: AccommodationSearchParams): AccommodationResult[] {
    return [
      {
        name: 'Hotel Europa',
        type: 'hotel',
        price: 120,
        currency: 'USD',
        rating: 4.2,
        address: 'Via Roma 123, Rome, Italy',
        amenities: ['WiFi', 'Breakfast', 'Air Conditioning']
      },
      {
        name: 'Central Apartment',
        type: 'apartment',
        price: 85,
        currency: 'USD',
        rating: 4.5,
        address: 'Trastevere District, Rome, Italy',
        amenities: ['WiFi', 'Kitchen', 'Washing Machine']
      }
    ];
  }
}