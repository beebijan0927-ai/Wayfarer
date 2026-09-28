import React, { useState } from 'react';
import { TripItinerary, TransportSegment, Hotel } from '../types/travel';
import { 
  X, 
  Wallet, 
  Printer, 
  Download, 
  CheckCircle, 
  Train, 
  Plane, 
  Bus, 
  Hotel as HotelIcon, 
  QrCode, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface TripWalletModalProps {
  trip: TripItinerary;
  onClose: () => void;
  onSelectSegment: (segmentId: string) => void;
  onSelectHotel: (hotel: Hotel) => void;
}

export const TripWalletModal: React.FC<TripWalletModalProps> = ({
  trip,
  onClose,
  onSelectSegment,
  onSelectHotel
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tickets' | 'hotels'>('all');
  const [isExported, setIsExported] = useState<boolean>(false);

  const bookedSegments = trip.segments.filter(s => s.isBooked);
  const bookedHotels = trip.hotels.filter(h => h.isBooked);

  // Financial calculations
  const transportTotal = bookedSegments.reduce((sum, seg) => {
    const opt = seg.options.find(o => o.id === seg.selectedOptionId) || seg.options[0];
    return sum + (opt ? opt.price : 0);
  }, 0);

  const lodgingTotal = bookedHotels.reduce((sum, htl) => {
    const stop = trip.stops.find(s => s.id === htl.stopId);
    const nights = stop ? stop.nights : 2;
    return sum + (htl.pricePerNight * nights);
  }, 0);

  const totalSpent = transportTotal + lodgingTotal;

  const totalCo2 = bookedSegments.reduce((sum, seg) => {
    const opt = seg.options.find(o => o.id === seg.selectedOptionId) || seg.options[0];
    return sum + (opt ? opt.co2Kg : 0);
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    setIsExported(true);
    setTimeout(() => setIsExported(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Trip Wallet & Master Itinerary</h3>
              <p className="text-xs text-neutral-400">{trip.title} · {trip.totalDays} Days · {trip.stops.length} Cities</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors border border-neutral-700"
              title="Print itinerary"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExported ? 'Saved to Device!' : 'Export Pass Bundle'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Financial & Environmental Overview Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-neutral-950/70 border-b border-neutral-800">
          <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block font-medium">TOTAL RESERVED</span>
            <span className="font-mono text-xl font-extrabold text-neutral-100">${totalSpent}</span>
            <span className="text-[10px] text-neutral-500 block mt-0.5">Taxes & fees included</span>
          </div>

          <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block font-medium">TRANSPORT FARE</span>
            <span className="font-mono text-xl font-bold text-emerald-400">${transportTotal}</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">{bookedSegments.length} tickets booked</span>
          </div>

          <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block font-medium">HOTELS & STAYS</span>
            <span className="font-mono text-xl font-bold text-indigo-400">${lodgingTotal}</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">{bookedHotels.length} rooms reserved</span>
          </div>

          <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block font-medium">CARBON EMISSIONS</span>
            <span className="font-mono text-xl font-bold text-emerald-400">{totalCo2.toFixed(1)} kg</span>
            <span className="text-[10px] text-emerald-500/80 block mt-0.5">82% lower via high-speed rail</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 pt-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-emerald-500 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Passes ({bookedSegments.length + bookedHotels.length})
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'tickets'
                  ? 'border-emerald-500 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Transit Tickets ({bookedSegments.length})
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'hotels'
                  ? 'border-emerald-500 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Hotel Vouchers ({bookedHotels.length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {bookedSegments.length === 0 && bookedHotels.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Wallet className="w-12 h-12 text-neutral-600 mx-auto" />
              <div className="text-sm font-semibold text-neutral-300">No tickets or stays booked yet</div>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Explore your visual route on the map, compare transit options (trains, flights, buses), 
                and select station hotels to populate your trip wallet.
              </p>
            </div>
          ) : null}

          {/* Booked Transport Segments */}
          {(activeTab === 'all' || activeTab === 'tickets') && bookedSegments.map(segment => {
            const opt = segment.options.find(o => o.id === segment.selectedOptionId) || segment.options[0];
            return (
              <div
                key={segment.id}
                className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${
                    opt?.mode === 'train' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                      : opt?.mode === 'flight'
                      ? 'bg-sky-950 text-sky-400 border border-sky-800/40'
                      : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                  }`}>
                    {opt?.mode === 'train' ? <Train className="w-5 h-5" /> : opt?.mode === 'flight' ? <Plane className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{segment.fromName} → {segment.toName}</span>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {opt?.provider} ({opt?.operatorNumber})
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 mt-1 flex flex-wrap items-center gap-3">
                      <span>{opt?.fromStation} ({opt?.departureTime}) → {opt?.toStation} ({opt?.arrivalTime})</span>
                      <span>·</span>
                      <span className="font-mono text-neutral-300">{segment.seatAssigned || 'Standard Seat'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-white">${opt?.price}</div>
                    <div className="text-[10px] font-mono text-neutral-400">PNR: {segment.pnr || 'WF8841'}</div>
                  </div>
                  <div className="w-10 h-10 bg-white rounded p-1 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-neutral-950" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Booked Hotels */}
          {(activeTab === 'all' || activeTab === 'hotels') && bookedHotels.map(hotel => {
            const stop = trip.stops.find(s => s.id === hotel.stopId);
            const nights = stop ? stop.nights : 2;
            return (
              <div
                key={hotel.id}
                className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                    <HotelIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{hotel.name}</span>
                      <span className="text-[11px] text-indigo-300 font-medium bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                        {hotel.cityName} · {nights} Nights
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 mt-1 flex items-center gap-3">
                      <span>{hotel.roomType}</span>
                      <span>·</span>
                      <span className="text-emerald-400">Breakfast Included</span>
                      <span>·</span>
                      <span>{hotel.distanceToTransit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-white">${hotel.pricePerNight * nights}</div>
                    <div className="text-[10px] font-mono text-neutral-400">Ref: {hotel.bookingRef || 'HTL-9921'}</div>
                  </div>
                  <div className="w-10 h-10 bg-white rounded p-1 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-neutral-950" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Wayfarer Unified Travel Guarantee · Free amendments on all rail tickets up to 1h before departure</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg transition-colors"
          >
            Close Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
