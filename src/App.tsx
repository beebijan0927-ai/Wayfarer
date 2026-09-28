import React, { useState } from 'react';
import { PRESET_TRIPS } from './data/mockRoutes';
import { TripItinerary, TransportSegment, Hotel, RouteStop } from './types/travel';
import { VisualRouteMap } from './components/VisualRouteMap';
import { RouteTimelinePanel } from './components/RouteTimelinePanel';
import { TransportHubView } from './components/TransportHubView';
import { HotelsHubView } from './components/HotelsHubView';
import { TransportBookingModal } from './components/TransportBookingModal';
import { HotelBookingModal } from './components/HotelBookingModal';
import { TripWalletModal } from './components/TripWalletModal';
import { AddStopModal } from './components/AddStopModal';
import { ToolsComparisonSection } from './components/ToolsComparisonSection';
import { 
  Compass, 
  Map as MapIcon, 
  Train, 
  Plane, 
  Bus, 
  Hotel as HotelIcon, 
  Wallet, 
  Plus, 
  ShieldCheck, 
  Leaf, 
  Calendar, 
  Clock, 
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowRight,
  Sparkles,
  Scale
} from 'lucide-react';

type ActiveView = 'map' | 'transport' | 'hotels' | 'comparison';

export default function App() {
  const [currentTripId, setCurrentTripId] = useState<string>(PRESET_TRIPS[0].id);
  const [allTrips, setAllTrips] = useState<TripItinerary[]>(PRESET_TRIPS);
  
  // Navigation view: unmerged separate views as requested
  const [activeView, setActiveView] = useState<ActiveView>('map');

  // Selection states
  const [selectedStopId, setSelectedStopId] = useState<string | null>(PRESET_TRIPS[0].stops[0]?.id || null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(PRESET_TRIPS[0].segments[0]?.id || null);

  // Modals state
  const [activeTransportModalSeg, setActiveTransportModalSeg] = useState<TransportSegment | null>(null);
  const [activeHotelModal, setActiveHotelModal] = useState<Hotel | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isAddStopOpen, setIsAddStopOpen] = useState<boolean>(false);

  // Active trip object
  const currentTrip = allTrips.find(t => t.id === currentTripId) || allTrips[0];

  // Counters
  const bookedSegmentsCount = currentTrip.segments.filter(s => s.isBooked).length;
  const bookedHotelsCount = currentTrip.hotels.filter(h => h.isBooked).length;
  const totalBookedCount = bookedSegmentsCount + bookedHotelsCount;

  // Handle booking confirmation for a transport leg
  const handleConfirmTransportBooking = (segmentId: string, optionId: string, seatChoice: string) => {
    setAllTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id !== currentTrip.id) return trip;
        const updatedSegments = trip.segments.map(seg => {
          if (seg.id === segmentId) {
            return {
              ...seg,
              selectedOptionId: optionId,
              isBooked: true,
              bookingRef: `WF-TKT-${Math.floor(10000 + Math.random() * 90000)}`,
              pnr: `EST${Math.floor(10 + Math.random() * 89)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
              seatAssigned: seatChoice
            };
          }
          return seg;
        });
        return { ...trip, segments: updatedSegments };
      });
    });

    // Update active modal state if open
    setActiveTransportModalSeg(prev => {
      if (prev && prev.id === segmentId) {
        return {
          ...prev,
          selectedOptionId: optionId,
          isBooked: true,
          bookingRef: `WF-TKT-${Math.floor(10000 + Math.random() * 90000)}`,
          pnr: `EST${Math.floor(10 + Math.random() * 89)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
          seatAssigned: seatChoice
        };
      }
      return prev;
    });
  };

  // Handle hotel reservation confirmation
  const handleConfirmHotelReservation = (hotelId: string, roomType: string) => {
    setAllTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id !== currentTrip.id) return trip;
        const updatedHotels = trip.hotels.map(h => {
          if (h.id === hotelId) {
            return {
              ...h,
              roomType,
              isBooked: true,
              bookingRef: `HTL-CONF-${Math.floor(10000 + Math.random() * 90000)}`
            };
          }
          return h;
        });
        return { ...trip, hotels: updatedHotels };
      });
    });

    setActiveHotelModal(prev => {
      if (prev && prev.id === hotelId) {
        return {
          ...prev,
          roomType,
          isBooked: true,
          bookingRef: `HTL-CONF-${Math.floor(10000 + Math.random() * 90000)}`
        };
      }
      return prev;
    });
  };

  // Add custom stop
  const handleAddStop = (newStop: RouteStop) => {
    setAllTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id !== currentTrip.id) return trip;
        const prevLastStop = trip.stops[trip.stops.length - 1];
        const newStops = [...trip.stops, newStop];

        // Create new connecting segment
        let newSegments = [...trip.segments];
        if (prevLastStop) {
          const newSeg: TransportSegment = {
            id: `seg-${prevLastStop.id}-${newStop.id}`,
            fromStopId: prevLastStop.id,
            toStopId: newStop.id,
            fromName: prevLastStop.name,
            toName: newStop.name,
            selectedOptionId: `opt-auto-${Date.now()}`,
            isBooked: false,
            pathCoordinates: [
              [prevLastStop.lat, prevLastStop.lng],
              [(prevLastStop.lat + newStop.lat) / 2 + 0.1, (prevLastStop.lng + newStop.lng) / 2],
              [newStop.lat, newStop.lng]
            ],
            options: [
              {
                id: `opt-auto-${Date.now()}`,
                mode: 'train',
                provider: 'EuroCity Express',
                operatorNumber: 'ECE 820',
                fromStation: `${prevLastStop.name} Central`,
                toStation: `${newStop.name} Centraal`,
                departureTime: '10:15',
                arrivalTime: '13:45',
                duration: '3h 30m',
                durationMinutes: 210,
                price: 68,
                currency: 'USD',
                co2Kg: 4.2,
                distanceKm: 340,
                transfers: 0,
                seatClass: 'Premium',
                amenities: ['Power Sockets', 'Wi-Fi', 'Bistro Coach'],
                baggagePolicy: '2 large bags included',
                isRecommended: true,
                isEcoFriendly: true
              },
              {
                id: `opt-auto-bus-${Date.now()}`,
                mode: 'bus',
                provider: 'FlixBus Intercity',
                operatorNumber: 'FLX 540',
                fromStation: `${prevLastStop.name} Bus Terminal`,
                toStation: `${newStop.name} Station`,
                departureTime: '08:00',
                arrivalTime: '13:15',
                duration: '5h 15m',
                durationMinutes: 315,
                price: 24,
                currency: 'USD',
                co2Kg: 14.5,
                distanceKm: 350,
                transfers: 0,
                seatClass: 'Economy',
                amenities: ['Wi-Fi', 'Reclining Seats'],
                baggagePolicy: '1 checked piece',
                isRecommended: false,
                isEcoFriendly: false
              }
            ]
          };
          newSegments.push(newSeg);
        }

        return {
          ...trip,
          stops: newStops,
          segments: newSegments,
          totalDays: trip.totalDays + newStop.nights
        };
      });
    });

    setSelectedStopId(newStop.id);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-neutral-950">
      
      {/* Top Bar with brand and direct trip controls */}
      <header className="sticky top-0 z-50 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Brand wordmark */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveView('map')}
            className="text-xl font-black tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Wayfarer</span>
          </button>

          {/* Trip preset switcher */}
          <div className="relative hidden sm:block">
            <select
              value={currentTripId}
              onChange={e => {
                setCurrentTripId(e.target.value);
                const t = allTrips.find(trip => trip.id === e.target.value);
                if (t) {
                  setSelectedStopId(t.stops[0]?.id || null);
                  setSelectedSegmentId(t.segments[0]?.id || null);
                }
              }}
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer pr-7 appearance-none"
            >
              {allTrips.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dedicated Unmerged Navigation View Switcher */}
        <nav className="flex items-center gap-1 bg-neutral-900/90 border border-neutral-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'map'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Visual Route</span> Map
          </button>

          <button
            onClick={() => setActiveView('transport')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'transport'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Train className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transport Hub</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-neutral-950 text-neutral-300 font-bold ml-0.5">
              {bookedSegmentsCount}/{currentTrip.segments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('hotels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'hotels'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <HotelIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Hotels</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-neutral-950 text-neutral-300 font-bold ml-0.5">
              {bookedHotelsCount}/{currentTrip.hotels.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'comparison'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Tools</span> Guide
          </button>
        </nav>

        {/* Unified Wallet / Cart button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWalletOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-md shadow-emerald-950 whitespace-nowrap"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Trip Wallet</span>
            {totalBookedCount > 0 && (
              <span className="font-mono bg-neutral-950 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {totalBookedCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container - Changes completely based on active view */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-8">
        
        {/* VIEW 1: DEDICATED VISUAL ROUTE MAP & ITINERARY */}
        {activeView === 'map' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Context Sub-header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/40 border border-neutral-800 p-4 rounded-xl">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  <span>{currentTrip.region}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentTrip.totalDays} Days Travel Itinerary</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{currentTrip.totalDistanceKm} km Route</span>
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight mt-1">
                  {currentTrip.title}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('transport')}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Train className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Go to Transport Hub ({bookedSegmentsCount}/{currentTrip.segments.length})</span>
                </button>
                <button
                  onClick={() => setActiveView('hotels')}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <HotelIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Go to Hotel Center ({bookedHotelsCount}/{currentTrip.hotels.length})</span>
                </button>
              </div>
            </div>

            {/* Split Grid: Live Visual Map (7 cols) + Route Timeline & Stops (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px] items-stretch">
              {/* Left: Visual Route Map Canvas */}
              <div className="lg:col-span-8 h-full">
                <VisualRouteMap
                  stops={currentTrip.stops}
                  segments={currentTrip.segments}
                  hotels={currentTrip.hotels}
                  selectedSegmentId={selectedSegmentId}
                  onSelectSegment={segId => {
                    setSelectedSegmentId(segId);
                    const seg = currentTrip.segments.find(s => s.id === segId);
                    if (seg) setActiveTransportModalSeg(seg);
                  }}
                  selectedStopId={selectedStopId}
                  onSelectStop={stopId => {
                    setSelectedStopId(stopId);
                  }}
                  onOpenBookTransport={seg => setActiveTransportModalSeg(seg)}
                  onOpenBookHotel={hotel => setActiveHotelModal(hotel)}
                />
              </div>

              {/* Right: Day-by-Day Timeline & Transport Links */}
              <div className="lg:col-span-4 h-full">
                <RouteTimelinePanel
                  trip={currentTrip}
                  selectedStopId={selectedStopId}
                  onSelectStop={stopId => setSelectedStopId(stopId)}
                  selectedSegmentId={selectedSegmentId}
                  onSelectSegment={segId => {
                    setSelectedSegmentId(segId);
                    const seg = currentTrip.segments.find(s => s.id === segId);
                    if (seg) setActiveTransportModalSeg(seg);
                  }}
                  onOpenBookTransport={seg => setActiveTransportModalSeg(seg)}
                  onOpenBookHotel={hotel => setActiveHotelModal(hotel)}
                  onAddNewStop={() => setIsAddStopOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: DEDICATED SEPARATE TRANSPORTATION HUB */}
        {activeView === 'transport' && (
          <TransportHubView
            trip={currentTrip}
            onOpenBookingModal={seg => setActiveTransportModalSeg(seg)}
            onConfirmBooking={handleConfirmTransportBooking}
          />
        )}

        {/* VIEW 3: DEDICATED SEPARATE HOTEL RESERVATIONS HUB */}
        {activeView === 'hotels' && (
          <HotelsHubView
            trip={currentTrip}
            onOpenHotelModal={hotel => setActiveHotelModal(hotel)}
            onConfirmReservation={handleConfirmHotelReservation}
          />
        )}

        {/* VIEW 4: DEDICATED INDUSTRY COMPARISON GUIDE */}
        {activeView === 'comparison' && (
          <div className="space-y-6 animate-fadeIn">
            <ToolsComparisonSection />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-8 px-4 sm:px-8 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Wayfarer</span>
            <span>· All-in-One Visual Route Planning & Multi-Modal Booking Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveView('comparison')} 
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Industry Tools Comparison
            </button>
            <button 
              onClick={() => setIsWalletOpen(true)}
              className="text-emerald-400 hover:underline"
            >
              Open Trip Wallet ({totalBookedCount})
            </button>
          </div>
        </div>
      </footer>

      {/* Active Modals */}
      <TransportBookingModal
        segment={activeTransportModalSeg}
        onClose={() => setActiveTransportModalSeg(null)}
        onConfirmBooking={handleConfirmTransportBooking}
      />

      <HotelBookingModal
        hotel={activeHotelModal}
        checkInDate="2026-10-08"
        checkOutDate="2026-10-11"
        nights={3}
        onClose={() => setActiveHotelModal(null)}
        onConfirmReservation={handleConfirmHotelReservation}
      />

      {isWalletOpen && (
        <TripWalletModal
          trip={currentTrip}
          onClose={() => setIsWalletOpen(false)}
          onSelectSegment={segId => {
            setSelectedSegmentId(segId);
            const seg = currentTrip.segments.find(s => s.id === segId);
            if (seg) setActiveTransportModalSeg(seg);
          }}
          onSelectHotel={hotel => setActiveHotelModal(hotel)}
        />
      )}

      <AddStopModal
        isOpen={isAddStopOpen}
        onClose={() => setIsAddStopOpen(false)}
        onAddStop={handleAddStop}
      />
    </div>
  );
}
