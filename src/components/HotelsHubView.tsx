import React, { useState } from 'react';
import { TripItinerary, Hotel, RouteStop } from '../types/travel';
import { 
  Hotel as HotelIcon, 
  MapPin, 
  Star, 
  CheckCircle, 
  Coffee, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Filter, 
  SlidersHorizontal,
  ArrowRight,
  Calendar,
  BedDouble,
  ExternalLink
} from 'lucide-react';

interface HotelsHubViewProps {
  trip: TripItinerary;
  onOpenHotelModal: (hotel: Hotel) => void;
  onConfirmReservation: (hotelId: string, roomType: string) => void;
}

export const HotelsHubView: React.FC<HotelsHubViewProps> = ({
  trip,
  onOpenHotelModal,
  onConfirmReservation,
}) => {
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [transitOnlyFilter, setTransitOnlyFilter] = useState<boolean>(false);
  const [freeCancelOnly, setFreeCancelOnly] = useState<boolean>(false);
  const [breakfastOnly, setBreakfastOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'rating'>('recommended');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const bookedCount = trip.hotels.filter(h => h.isBooked).length;
  const totalHotels = trip.hotels.length;

  // Filter hotels
  const filteredHotels = trip.hotels.filter(hotel => {
    if (selectedCityFilter !== 'all' && hotel.cityName !== selectedCityFilter) return false;
    if (transitOnlyFilter && !hotel.distanceToTransit.includes('walk') && !hotel.distanceToTransit.includes('mins')) return false;
    if (freeCancelOnly && !hotel.freeCancellation) return false;
    if (breakfastOnly && !hotel.breakfastIncluded) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = hotel.name.toLowerCase().includes(q);
      const matchCity = hotel.cityName.toLowerCase().includes(q);
      const matchAddress = hotel.address.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchAddress) return false;
    }
    return true;
  });

  // Sort hotels
  filteredHotels.sort((a, b) => {
    if (sortBy === 'priceAsc') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'priceDesc') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.rating - a.rating; // recommended default
  });

  const cityOptions = Array.from(new Set(trip.hotels.map(h => h.cityName)));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 text-xs font-semibold">
              <HotelIcon className="w-3.5 h-3.5" />
              <span>Dedicated Accommodation Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Station-Adjacent Hotel Reservations
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Eliminate heavy luggage transfers between terminals. Curated boutique stays, soundproofed executive rooms, and luxury hotels strictly located within walking distance of central rail hubs.
            </p>
          </div>

          {/* Hotel Reservations Tracker */}
          <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-xl shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>Hotel Reservations</span>
              <span className="font-mono text-indigo-400 font-bold">
                {bookedCount} of {totalHotels} Reserved
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(bookedCount / totalHotels) * 100}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Instant digital vouchers & flexible cancellation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: City Filters, Station Proximity, Sort */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 space-y-4">
        {/* City Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mr-2 shrink-0">
            Destination City:
          </span>
          <button
            onClick={() => setSelectedCityFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCityFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950'
                : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            All Cities ({trip.hotels.length})
          </button>
          {cityOptions.map(city => {
            const cityHotels = trip.hotels.filter(h => h.cityName === city);
            const cityReserved = cityHotels.some(h => h.isBooked);
            return (
              <button
                key={city}
                onClick={() => setSelectedCityFilter(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCityFilter === city
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <span>{city}</span>
                {cityReserved && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Proximity & Amenities Quick Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-neutral-800/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">Filter by:</span>
            <button
              onClick={() => setTransitOnlyFilter(!transitOnlyFilter)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                transitOnlyFilter
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700/80'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              }`}
            >
              🚶 Walking Distance to Station
            </button>
            <button
              onClick={() => setFreeCancelOnly(!freeCancelOnly)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                freeCancelOnly
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700/80'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              }`}
            >
              ✓ Free Cancellation
            </button>
            <button
              onClick={() => setBreakfastOnly(!breakfastOnly)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                breakfastOnly
                  ? 'bg-amber-950 text-amber-300 border-amber-700/80'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              }`}
            >
              ☕ Breakfast Included
            </button>
          </div>

          {/* Sort & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="recommended">Highest Guest Rating</option>
                <option value="priceAsc">Lowest Price per Night</option>
                <option value="priceDesc">Highest Price per Night</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hotel or address..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 w-44 sm:w-56"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.length === 0 ? (
          <div className="col-span-full py-16 text-center text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <HotelIcon className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-300">No hotels match your filters</p>
            <p className="text-xs text-neutral-500 mt-1">Try resetting the city or amenities filters above.</p>
          </div>
        ) : (
          filteredHotels.map(hotel => {
            const stop = trip.stops.find(s => s.id === hotel.stopId);
            const nights = stop ? stop.nights : 2;
            const totalPrice = hotel.pricePerNight * nights;

            return (
              <div
                key={hotel.id}
                className={`bg-neutral-900 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-md hover:shadow-xl ${
                  hotel.isBooked
                    ? 'border-indigo-500/50 bg-neutral-900/90'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Photo & Station Badge */}
                <div className="relative h-52 w-full bg-neutral-950 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/25 to-transparent"></div>
                  
                  {/* City & Rating Badges */}
                  <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-white border border-neutral-700/80">
                    {hotel.cityName}
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-950/85 backdrop-blur-md px-2 py-1 rounded-md text-xs font-black text-amber-300 border border-amber-800/60 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{hotel.rating}</span>
                    <span className="text-[10px] text-amber-400 font-normal">({hotel.reviewsCount})</span>
                  </div>

                  {/* Transit proximity strip */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="bg-neutral-950/90 backdrop-blur-md px-2 py-1 rounded-md text-white font-medium border border-neutral-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {hotel.distanceToTransit}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold bg-neutral-950/90 px-2 py-1 rounded-md border border-neutral-800">
                      ${hotel.pricePerNight} <span className="text-neutral-400 font-normal text-[10px]">/ night</span>
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold mb-1">
                      {Array.from({ length: hotel.stars }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                      <span className="text-neutral-400 ml-1">· Official Rating</span>
                    </div>

                    <h3 className="text-base font-bold text-white line-clamp-1">{hotel.name}</h3>
                    <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{hotel.address}</span>
                    </p>

                    <div className="mt-3 bg-neutral-950/70 p-3 rounded-xl border border-neutral-800/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-neutral-300">
                        <span className="flex items-center gap-1.5">
                          <BedDouble className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{hotel.roomType}</span>
                        </span>
                        <span className="text-neutral-400 font-mono">{nights} Nights stay</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                        {hotel.breakfastIncluded && (
                          <span className="text-amber-400 flex items-center gap-1">
                            <Coffee className="w-3 h-3" /> Breakfast Included
                          </span>
                        )}
                        {hotel.freeCancellation && (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Free Cancellation
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amenities Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] text-neutral-400">
                      {hotel.amenities.slice(0, 4).map((am, idx) => (
                        <span key={idx} className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Booking Footer */}
                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">
                        Total for {nights} Nights:
                      </span>
                      <strong className="text-lg font-black font-mono text-white">
                        ${totalPrice}
                      </strong>
                    </div>

                    {hotel.isBooked ? (
                      <button
                        onClick={() => onOpenHotelModal(hotel)}
                        className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-indigo-300 border border-neutral-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                        <span>View Voucher</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onConfirmReservation(hotel.id, hotel.roomType);
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-indigo-950 hover:shadow-indigo-900 flex items-center gap-1.5"
                      >
                        <span>Reserve Room</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
