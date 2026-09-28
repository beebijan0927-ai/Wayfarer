export type TransportMode = 'flight' | 'train' | 'bus' | 'ferry';

export interface RouteStop {
  id: string;
  name: string;
  country: string;
  code: string;
  lat: number;
  lng: number;
  arrivalDate: string;
  departureDate: string;
  nights: number;
  description: string;
  image?: string;
  highlights: string[];
}

export interface TransportOption {
  id: string;
  mode: TransportMode;
  provider: string;
  operatorNumber: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  price: number;
  currency: string;
  co2Kg: number;
  distanceKm: number;
  transfers: number;
  seatClass: 'Economy' | 'Premium' | 'First' | 'Business' | 'Sleeper';
  amenities: string[];
  baggagePolicy: string;
  isRecommended?: boolean;
  isEcoFriendly?: boolean;
}

export interface TransportSegment {
  id: string;
  fromStopId: string;
  toStopId: string;
  fromName: string;
  toName: string;
  selectedOptionId: string;
  options: TransportOption[];
  isBooked: boolean;
  bookingRef?: string;
  pnr?: string;
  seatAssigned?: string;
  pathCoordinates: [number, number][];
}

export interface Hotel {
  id: string;
  stopId: string;
  cityName: string;
  name: string;
  stars: number;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  currency: string;
  address: string;
  distanceToTransit: string;
  coordinates: [number, number];
  roomType: string;
  breakfastIncluded: boolean;
  freeCancellation: boolean;
  image: string;
  amenities: string[];
  isBooked: boolean;
  bookingRef?: string;
}

export interface TripItinerary {
  id: string;
  title: string;
  tagline: string;
  region: string;
  totalDays: number;
  totalDistanceKm: number;
  stops: RouteStop[];
  segments: TransportSegment[];
  hotels: Hotel[];
}

export interface ToolComparison {
  id: string;
  name: string;
  category: string;
  visualMapScore: number; // 1 - 5
  multiModalScore: number;
  unifiedBookingScore: number;
  hotelIntegrationScore: number;
  bestFor: string;
  websiteUrl: string;
  keyStrengths: string[];
  notableLimitations: string[];
  supportedModes: ('Flight' | 'Train' | 'Bus' | 'Ferry' | 'Car')[];
  hasDirectTicketing: boolean;
}
