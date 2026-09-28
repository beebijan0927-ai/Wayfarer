import React from 'react';
import { TripItinerary, RouteStop, TransportSegment, Hotel } from '../types/travel';
import { 
  Train, 
  Plane, 
  Bus, 
  Hotel as HotelIcon, 
  MapPin, 
  Calendar, 
  Plus, 
  Check, 
  ChevronRight,
  ArrowDown,
  Sparkles,
  Ticket
} from 'lucide-react';

interface RouteTimelinePanelProps {
  trip: TripItinerary;
  selectedStopId: string | null;
  onSelectStop: (stopId: string) => void;
  selectedSegmentId: string | null;
  onSelectSegment: (segmentId: string) => void;
  onOpenBookTransport: (segment: TransportSegment) => void;
  onOpenBookHotel: (hotel: Hotel) => void;
  onAddNewStop: () => void;
}

export const RouteTimelinePanel: React.FC<RouteTimelinePanelProps> = ({
  trip,
  selectedStopId,
  onSelectStop,
  selectedSegmentId,
  onSelectSegment,
  onOpenBookTransport,
  onOpenBookHotel,
  onAddNewStop
}) => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/90 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Route Timeline</span>
            <span className="text-[11px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
              {trip.stops.length} Cities · {trip.totalDays} Days
            </span>
          </h3>
          <p className="text-[11px] text-neutral-400 mt-0.5">Click any city or transit leg to view details</p>
        </div>

        <button
          onClick={onAddNewStop}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-colors border border-neutral-700"
          title="Add a custom destination stop"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add City</span>
        </button>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {trip.stops.map((stop, index) => {
          const isStopSelected = selectedStopId === stop.id;
          const hotel = trip.hotels.find(h => h.stopId === stop.id);
          const nextSegment = trip.segments.find(s => s.fromStopId === stop.id);

          return (
            <div key={stop.id} className="space-y-3">
              {/* Destination Stop Card */}
              <div
                onClick={() => onSelectStop(stop.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isStopSelected
                    ? 'bg-neutral-800/90 border-emerald-500/70 ring-1 ring-emerald-500/30'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isStopSelected 
                        ? 'bg-emerald-500 text-neutral-950' 
                        : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-100">{stop.name}</span>
                        <span className="text-xs text-neutral-400">({stop.country})</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {stop.arrivalDate} · {stop.nights} {stop.nights === 1 ? 'night' : 'nights'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                      {stop.code}
                    </span>
                  </div>
                </div>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-neutral-800/60 text-[11px] text-neutral-400">
                  {stop.highlights.slice(0, 3).map((hl, i) => (
                    <span key={i} className="bg-neutral-900/90 px-2 py-0.5 rounded text-neutral-300">
                      {hl}
                    </span>
                  ))}
                </div>

                {/* Associated Hotel Tag */}
                {hotel && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenBookHotel(hotel);
                    }}
                    className="mt-2.5 p-2 bg-neutral-900/90 hover:bg-neutral-850 rounded-lg border border-neutral-800 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <HotelIcon className="w-3.5 h-3.5 text-indigo-400" />
                      <div className="line-clamp-1">
                        <span className="font-semibold text-neutral-200">{hotel.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-neutral-300 font-bold">${hotel.pricePerNight}/nt</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        hotel.isBooked 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800/40'
                      }`}>
                        {hotel.isBooked ? 'Reserved' : 'Book Stay'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Transit Leg Between Stops */}
              {nextSegment && (
                <div className="pl-4 relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-800"></div>
                  
                  {(() => {
                    const opt = nextSegment.options.find(o => o.id === nextSegment.selectedOptionId) || nextSegment.options[0];
                    const isSegSelected = selectedSegmentId === nextSegment.id;
                    const mode = opt ? opt.mode : 'train';

                    return (
                      <div
                        onClick={() => {
                          onSelectSegment(nextSegment.id);
                        }}
                        className={`relative z-10 ml-5 p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isSegSelected
                            ? 'bg-neutral-800 border-emerald-500/60 ring-1 ring-emerald-500/20'
                            : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded ${
                              mode === 'train' 
                                ? 'bg-emerald-950 text-emerald-400' 
                                : mode === 'flight'
                                ? 'bg-sky-950 text-sky-400'
                                : 'bg-amber-950 text-amber-400'
                            }`}>
                              {mode === 'train' ? <Train className="w-3.5 h-3.5" /> : mode === 'flight' ? <Plane className="w-3.5 h-3.5" /> : <Bus className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-neutral-200">
                                {opt?.provider}
                              </div>
                              <div className="text-[11px] text-neutral-400 font-mono">
                                {opt?.duration} · {opt?.distanceKm} km
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-neutral-200">
                              ${opt?.price}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenBookTransport(nextSegment);
                              }}
                              className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                                nextSegment.isBooked
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/60'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              {nextSegment.isBooked ? '✓ Booked' : 'Book Leg'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
