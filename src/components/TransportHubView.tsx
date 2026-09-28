import React, { useState } from 'react';
import { TripItinerary, TransportSegment, TransportOption, TransportMode } from '../types/travel';
import { 
  Train, 
  Plane, 
  Bus, 
  ArrowRight, 
  Clock, 
  Leaf, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal, 
  CheckCircle, 
  Luggage, 
  Wifi, 
  Zap, 
  Ticket,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface TransportHubViewProps {
  trip: TripItinerary;
  onOpenBookingModal: (segment: TransportSegment) => void;
  onConfirmBooking: (segmentId: string, optionId: string, seatChoice: string) => void;
}

export const TransportHubView: React.FC<TransportHubViewProps> = ({
  trip,
  onOpenBookingModal,
  onConfirmBooking,
}) => {
  const [selectedLegFilter, setSelectedLegFilter] = useState<string>('all');
  const [selectedModeFilter, setSelectedModeFilter] = useState<TransportMode | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price' | 'duration' | 'eco'>('recommended');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const bookedCount = trip.segments.filter(s => s.isBooked).length;
  const totalLegs = trip.segments.length;

  // Filter segments
  const filteredSegments = trip.segments.filter(seg => {
    if (selectedLegFilter !== 'all' && seg.id !== selectedLegFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
              <Ticket className="w-3.5 h-3.5" />
              <span>Dedicated Transportation Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Transit & Ticketing Hub
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Compare schedules, transit times, and carbon emissions across European rail networks, regional flights, and express coaches. Reserve seats and generate instant digital boarding passes for every leg of your journey.
            </p>
          </div>

          {/* Booking Progress Tracker */}
          <div className="bg-neutral-950/80 border border-neutral-800 p-4 rounded-xl shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>Transit Status</span>
              <span className="font-mono text-emerald-400 font-bold">
                {bookedCount} of {totalLegs} Booked
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(bookedCount / totalLegs) * 100}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct carrier integration & mobile QR passes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Leg selector, Sorting */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 space-y-4">
        {/* Legs Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mr-2 shrink-0">
            Route Leg:
          </span>
          <button
            onClick={() => setSelectedLegFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedLegFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            All Route Legs ({trip.segments.length})
          </button>
          {trip.segments.map((seg, idx) => (
            <button
              key={seg.id}
              onClick={() => setSelectedLegFilter(seg.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedLegFilter === seg.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              <span>Leg {idx + 1}: {seg.fromName} → {seg.toName}</span>
              {seg.isBooked && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              )}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Mode, Sort, Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-neutral-800/60">
          {/* Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">Mode:</span>
            <div className="inline-flex bg-neutral-950 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setSelectedModeFilter('all')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedModeFilter === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                All Modes
              </button>
              <button
                onClick={() => setSelectedModeFilter('train')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedModeFilter === 'train' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Train className="w-3.5 h-3.5" />
                <span>High-Speed Rail</span>
              </button>
              <button
                onClick={() => setSelectedModeFilter('flight')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedModeFilter === 'flight' ? 'bg-sky-950 text-sky-300 border border-sky-800/50' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Flights</span>
              </button>
              <button
                onClick={() => setSelectedModeFilter('bus')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedModeFilter === 'bus' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>Coaches</span>
              </button>
            </div>
          </div>

          {/* Sort & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="recommended">Best Balance (Recommended)</option>
                <option value="price">Lowest Fare ($)</option>
                <option value="duration">Fastest Transit</option>
                <option value="eco">Lowest Carbon Footprint</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search station or carrier..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Segments & Ticketing Cards */}
      <div className="space-y-8">
        {filteredSegments.map((segment, legIdx) => {
          // Filter options inside this segment based on mode and search
          let visibleOptions = segment.options.filter(opt => {
            if (selectedModeFilter !== 'all' && opt.mode !== selectedModeFilter) return false;
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase();
              const matchesCarrier = opt.provider.toLowerCase().includes(query);
              const matchesStation = opt.fromStation.toLowerCase().includes(query) || opt.toStation.toLowerCase().includes(query);
              if (!matchesCarrier && !matchesStation) return false;
            }
            return true;
          });

          // Sort options
          visibleOptions.sort((a, b) => {
            if (sortBy === 'price') return a.price - b.price;
            if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
            if (sortBy === 'eco') return a.co2Kg - b.co2Kg;
            if (a.isRecommended) return -1;
            if (b.isRecommended) return 1;
            return 0;
          });

          return (
            <div 
              key={segment.id} 
              className={`bg-neutral-900 border rounded-2xl overflow-hidden transition-all shadow-lg ${
                segment.isBooked ? 'border-emerald-500/40 bg-neutral-900/90' : 'border-neutral-800'
              }`}
            >
              {/* Segment Header */}
              <div className="bg-neutral-950/80 px-6 py-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/80 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">
                    0{legIdx + 1}
                  </div>
                  <div>
                    <div className="text-base font-bold text-white flex items-center gap-2">
                      <span>{segment.fromName}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                      <span>{segment.toName}</span>
                    </div>
                    <span className="text-xs text-neutral-400">
                      Direct connection · {segment.options.length} verified operator schedules
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {segment.isBooked ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 rounded-lg text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>E-Ticket Confirmed ({segment.bookingRef})</span>
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-400">
                      Unreserved · Select carrier below
                    </span>
                  )}
                  <button
                    onClick={() => onOpenBookingModal(segment)}
                    className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span>{segment.isBooked ? 'Manage Seat' : 'Compare Modal'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Options Table / List */}
              <div className="divide-y divide-neutral-800/60 p-2 sm:p-4">
                {visibleOptions.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400">
                    No schedules match your current mode or search criteria for this leg.
                  </div>
                ) : (
                  visibleOptions.map(opt => {
                    const isCurrentSelection = segment.selectedOptionId === opt.id;
                    const isTicketIssued = segment.isBooked && isCurrentSelection;

                    return (
                      <div 
                        key={opt.id}
                        className={`p-4 rounded-xl transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 my-1 ${
                          isTicketIssued 
                            ? 'bg-emerald-950/20 border border-emerald-500/30' 
                            : isCurrentSelection 
                            ? 'bg-neutral-800/40 border border-neutral-700/50' 
                            : 'hover:bg-neutral-800/20'
                        }`}
                      >
                        {/* Operator & Timing */}
                        <div className="flex items-start sm:items-center gap-4">
                          <div className={`p-2.5 rounded-xl shrink-0 ${
                            opt.mode === 'train'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                              : opt.mode === 'flight'
                              ? 'bg-sky-950 text-sky-400 border border-sky-800/50'
                              : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                          }`}>
                            {opt.mode === 'train' ? <Train className="w-5 h-5" /> : opt.mode === 'flight' ? <Plane className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{opt.provider}</span>
                              <span className="text-xs font-mono bg-neutral-950 text-neutral-400 px-2 py-0.5 rounded border border-neutral-800">
                                {opt.operatorNumber}
                              </span>
                              {opt.isRecommended && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/60 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> Recommended
                                </span>
                              )}
                            </div>

                            {/* Stations & Schedule */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-300">
                              <div className="flex items-center gap-1">
                                <span className="font-mono font-bold text-white text-sm">{opt.departureTime}</span>
                                <span className="text-neutral-400">({opt.fromStation})</span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                              <div className="flex items-center gap-1">
                                <span className="font-mono font-bold text-white text-sm">{opt.arrivalTime}</span>
                                <span className="text-neutral-400">({opt.toStation})</span>
                              </div>
                            </div>

                            {/* Badges: Amenities, CO2, Baggage */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-neutral-400">
                              <span className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800/80">
                                <Clock className="w-3 h-3 text-neutral-400" />
                                {opt.duration} {opt.transfers === 0 ? '· Direct' : `· ${opt.transfers} transfer`}
                              </span>
                              <span className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800/80">
                                <Leaf className="w-3 h-3 text-emerald-400" />
                                {opt.co2Kg} kg CO₂
                              </span>
                              <span className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800/80">
                                <Luggage className="w-3 h-3 text-neutral-400" />
                                {opt.baggagePolicy}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Booking Trigger */}
                        <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-800">
                          <div className="text-right">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">
                              {opt.seatClass} Class
                            </span>
                            <span className="font-mono text-xl font-black text-white">
                              ${opt.price}
                            </span>
                          </div>

                          {isTicketIssued ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Seat: {segment.seatAssigned || 'Window'}
                              </span>
                              <button
                                onClick={() => onOpenBookingModal(segment)}
                                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition-colors border border-neutral-700"
                              >
                                View QR Pass
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                onConfirmBooking(segment.id, opt.id, 'Window Coach 4');
                              }}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-emerald-950 hover:shadow-emerald-900 flex items-center gap-1.5"
                            >
                              <span>Book Leg</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
