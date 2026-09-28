import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RouteStop, TransportSegment, Hotel } from '../types/travel';
import { 
  Train, 
  Plane, 
  Bus, 
  Hotel as HotelIcon, 
  Maximize2, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Layers
} from 'lucide-react';

interface VisualRouteMapProps {
  stops: RouteStop[];
  segments: TransportSegment[];
  hotels: Hotel[];
  selectedSegmentId: string | null;
  onSelectSegment: (segmentId: string) => void;
  selectedStopId: string | null;
  onSelectStop: (stopId: string) => void;
  onSelectHotel?: (hotel: Hotel) => void;
  onOpenBookTransport: (segment: TransportSegment) => void;
  onOpenBookHotel: (hotel: Hotel) => void;
}

export const VisualRouteMap: React.FC<VisualRouteMapProps> = ({
  stops,
  segments,
  hotels,
  selectedSegmentId,
  onSelectSegment,
  selectedStopId,
  onSelectStop,
  onOpenBookTransport,
  onOpenBookHotel
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  
  const [filterMode, setFilterMode] = useState<'all' | 'train' | 'flight' | 'bus' | 'hotels'>('all');
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(false);
  const [currentTourIndex, setCurrentTourIndex] = useState<number>(0);
  const tourTimerRef = useRef<any>(null);

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Use CartoDB Dark Matter / Voyager for a premium, high-legibility travel map
    const map = L.map(mapContainerRef.current, {
      center: stops.length > 0 ? [stops[0].lat, stops[0].lng] : [48.8566, 2.3522],
      zoom: 5,
      zoomControl: false,
      attributionControl: true
    });

    // Add CartoDB Voyager tiles (crisp, beautiful contrast, elegant typography)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    // Initial bounds fit
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }

    return () => {
      if (tourTimerRef.current) clearInterval(tourTimerRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Map Layers whenever stops, segments, hotels, or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Route Segments
    segments.forEach((segment) => {
      const selectedOption = segment.options.find(o => o.id === segment.selectedOptionId) || segment.options[0];
      const mode = selectedOption ? selectedOption.mode : 'train';

      // Check mode filter
      if (filterMode !== 'all' && filterMode !== 'hotels' && filterMode !== mode) {
        return;
      }

      const isSelected = selectedSegmentId === segment.id;
      
      let lineColor = '#059669'; // default emerald for train
      let dashArray: string | undefined = undefined;
      let weight = isSelected ? 5 : 3.5;
      let opacity = isSelected ? 1 : 0.85;

      if (mode === 'flight') {
        lineColor = '#0284c7'; // Sky blue for flights
        dashArray = '6, 8';
      } else if (mode === 'bus') {
        lineColor = '#d97706'; // Amber for buses
        dashArray = '3, 4';
      } else if (mode === 'train') {
        lineColor = '#059669'; // Emerald for trains
        dashArray = undefined;
      }

      // Draw shadow / glow line under selected
      if (isSelected) {
        L.polyline(segment.pathCoordinates, {
          color: lineColor,
          weight: 10,
          opacity: 0.25,
          lineCap: 'round'
        }).addTo(layerGroup);
      }

      const polyline = L.polyline(segment.pathCoordinates, {
        color: lineColor,
        weight,
        opacity,
        dashArray,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup);

      // Midpoint icon marker for mode
      const midCoordIndex = Math.floor(segment.pathCoordinates.length / 2);
      const midCoord = segment.pathCoordinates[midCoordIndex];
      if (midCoord) {
        const modeBadgeHtml = `
          <div class="cursor-pointer transition-transform hover:scale-110 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold shadow-lg border ${
            mode === 'train' 
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' 
              : mode === 'flight'
              ? 'bg-sky-950/90 text-sky-300 border-sky-500/40'
              : 'bg-amber-950/90 text-amber-300 border-amber-500/40'
          }">
            <span>${mode === 'train' ? '🚆' : mode === 'flight' ? '✈️' : '🚌'}</span>
            <span>${selectedOption.duration}</span>
          </div>
        `;

        const midMarker = L.marker(midCoord, {
          icon: L.divIcon({
            html: modeBadgeHtml,
            className: 'custom-segment-badge',
            iconSize: [85, 24],
            iconAnchor: [42, 12]
          })
        }).addTo(layerGroup);

        midMarker.on('click', () => {
          onSelectSegment(segment.id);
        });
      }

      // Segment interactive popup & click
      polyline.on('click', () => {
        onSelectSegment(segment.id);
      });

      polyline.bindPopup(`
        <div class="p-1 min-w-[220px]">
          <div class="flex items-center justify-between pb-1.5 border-b border-neutral-800">
            <span class="text-xs font-semibold text-neutral-200">${segment.fromName} → ${segment.toName}</span>
            <span class="text-[11px] font-mono text-emerald-400 font-bold">$${selectedOption.price}</span>
          </div>
          <div class="py-2 text-xs text-neutral-300 space-y-1">
            <div class="flex justify-between">
              <span class="text-neutral-400">Carrier:</span>
              <span class="font-medium text-neutral-100">${selectedOption.provider}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400">Duration:</span>
              <span class="font-mono text-neutral-200">${selectedOption.duration}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400">Carbon Footprint:</span>
              <span class="font-mono text-emerald-400">${selectedOption.co2Kg} kg CO₂</span>
            </div>
          </div>
          <button id="popup-book-btn-${segment.id}" class="w-full mt-1.5 py-1.5 text-center bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors">
            ${segment.isBooked ? '✓ View Booked Ticket' : 'Compare & Book Leg'}
          </button>
        </div>
      `);

      polyline.on('popupopen', () => {
        const btn = document.getElementById(`popup-book-btn-${segment.id}`);
        if (btn) {
          btn.onclick = () => {
            onOpenBookTransport(segment);
          };
        }
      });
    });

    // 2. Draw Destination Stops Markers
    stops.forEach((stop, index) => {
      const isSelected = selectedStopId === stop.id;
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${isSelected ? '<div class="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping"></div>' : ''}
          <div class="relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xl transition-transform group-hover:scale-110 ${
            isSelected 
              ? 'bg-emerald-500 text-neutral-950 ring-4 ring-emerald-500/30 font-black' 
              : 'bg-neutral-900 text-white border-2 border-emerald-500/70'
          }">
            ${index + 1}
          </div>
          <div class="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-900/90 backdrop-blur-sm text-neutral-100 px-2 py-0.5 rounded text-[11px] font-semibold border border-neutral-700 shadow-md">
            ${stop.name}
          </div>
        </div>
      `;

      const marker = L.marker([stop.lat, stop.lng], {
        icon: L.divIcon({
          html: markerHtml,
          className: 'custom-stop-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        }),
        zIndexOffset: isSelected ? 1000 : 500
      }).addTo(layerGroup);

      marker.on('click', () => {
        onSelectStop(stop.id);
      });

      marker.bindPopup(`
        <div class="p-1 min-w-[240px]">
          <div class="flex items-center justify-between pb-1 border-b border-neutral-800">
            <span class="text-sm font-bold text-white">${stop.name}, ${stop.country}</span>
            <span class="text-[10px] font-mono bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">Stop ${index + 1}</span>
          </div>
          <p class="text-xs text-neutral-300 py-1.5 leading-relaxed">${stop.description}</p>
          <div class="text-[11px] text-neutral-400 space-y-0.5 pb-2">
            <div><strong class="text-neutral-300">Dates:</strong> ${stop.arrivalDate} · ${stop.nights} nights</div>
            <div><strong class="text-neutral-300">Hub:</strong> ${stop.highlights[0] || 'Central Station'}</div>
          </div>
          <div class="flex gap-1.5">
            <button id="popup-stop-details-${stop.id}" class="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded transition-colors text-center">
              View Itinerary
            </button>
          </div>
        </div>
      `);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-stop-details-${stop.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectStop(stop.id);
          };
        }
      });
    });

    // 3. Draw Hotels if filter is 'all' or 'hotels'
    if (filterMode === 'all' || filterMode === 'hotels') {
      hotels.forEach((hotel) => {
        const hotelHtml = `
          <div class="cursor-pointer group flex items-center gap-1 bg-indigo-950/90 text-indigo-200 border border-indigo-500/60 px-2 py-0.5 rounded-md shadow-lg text-[11px] font-medium transition-transform group-hover:scale-110">
            <span>🏨</span>
            <span class="font-mono font-bold text-white">$${hotel.pricePerNight}</span>
          </div>
        `;

        const hotelMarker = L.marker(hotel.coordinates, {
          icon: L.divIcon({
            html: hotelHtml,
            className: 'custom-hotel-pin',
            iconSize: [60, 22],
            iconAnchor: [30, 11]
          }),
          zIndexOffset: 300
        }).addTo(layerGroup);

        hotelMarker.bindPopup(`
          <div class="p-1 min-w-[230px]">
            <div class="flex items-center justify-between pb-1 border-b border-neutral-800">
              <span class="text-xs font-bold text-white line-clamp-1">${hotel.name}</span>
              <span class="text-[11px] text-amber-400 font-bold">★ ${hotel.rating}</span>
            </div>
            <div class="py-1.5 text-xs text-neutral-300 space-y-1">
              <div class="text-[11px] text-neutral-400">${hotel.distanceToTransit}</div>
              <div class="text-[11px] font-mono text-emerald-400 font-semibold">$${hotel.pricePerNight} / night · Free cancellation</div>
            </div>
            <button id="popup-hotel-book-${hotel.id}" class="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-colors text-center">
              ${hotel.isBooked ? '✓ Reserved Room Details' : 'Reserve Room'}
            </button>
          </div>
        `);

        hotelMarker.on('popupopen', () => {
          const btn = document.getElementById(`popup-hotel-book-${hotel.id}`);
          if (btn) {
            btn.onclick = () => {
              onOpenBookHotel(hotel);
            };
          }
        });
      });
    }

  }, [stops, segments, hotels, selectedSegmentId, selectedStopId, filterMode]);

  // Fit bounds helper
  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    if (!map || stops.length === 0) return;
    const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 7 });
  };

  // Focus on selected stop
  useEffect(() => {
    if (!selectedStopId) return;
    const stop = stops.find(s => s.id === selectedStopId);
    const map = mapInstanceRef.current;
    if (stop && map) {
      map.flyTo([stop.lat, stop.lng], 9, { duration: 1.2 });
    }
  }, [selectedStopId]);

  // Focus on selected segment
  useEffect(() => {
    if (!selectedSegmentId) return;
    const segment = segments.find(s => s.id === selectedSegmentId);
    const map = mapInstanceRef.current;
    if (segment && map && segment.pathCoordinates.length > 0) {
      const bounds = L.latLngBounds(segment.pathCoordinates);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 9 });
    }
  }, [selectedSegmentId]);

  // Interactive Tour Simulator
  const toggleTour = () => {
    if (isTourPlaying) {
      if (tourTimerRef.current) clearInterval(tourTimerRef.current);
      setIsTourPlaying(false);
    } else {
      setIsTourPlaying(true);
      runTourStep(currentTourIndex);
    }
  };

  const runTourStep = (index: number) => {
    const map = mapInstanceRef.current;
    if (!map || stops.length === 0) return;

    const stop = stops[index % stops.length];
    onSelectStop(stop.id);
    map.flyTo([stop.lat, stop.lng], 8, { duration: 1.5 });

    if (tourTimerRef.current) clearInterval(tourTimerRef.current);

    tourTimerRef.current = setInterval(() => {
      setCurrentTourIndex(prev => {
        const next = (prev + 1) % stops.length;
        const nextStop = stops[next];
        onSelectStop(nextStop.id);
        map.flyTo([nextStop.lat, nextStop.lng], 8, { duration: 1.5 });
        return next;
      });
    }, 4500);
  };

  const resetTour = () => {
    if (tourTimerRef.current) clearInterval(tourTimerRef.current);
    setIsTourPlaying(false);
    setCurrentTourIndex(0);
    handleFitBounds();
  };

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950 flex flex-col">
      {/* Top Map HUD Controls */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2 bg-neutral-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-neutral-800 shadow-lg text-xs">
        <span className="text-neutral-400 font-medium flex items-center gap-1.5 mr-1">
          <Layers className="w-3.5 h-3.5 text-neutral-300" />
          <span>Layer:</span>
        </span>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            filterMode === 'all'
              ? 'bg-neutral-100 text-neutral-950 font-semibold'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
          }`}
        >
          All Routes
        </button>
        <button
          onClick={() => setFilterMode('train')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            filterMode === 'train'
              ? 'bg-emerald-500 text-neutral-950 font-bold'
              : 'text-emerald-400 hover:text-emerald-300 hover:bg-neutral-800'
          }`}
        >
          <Train className="w-3 h-3" />
          <span>Rail</span>
        </button>
        <button
          onClick={() => setFilterMode('flight')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            filterMode === 'flight'
              ? 'bg-sky-500 text-neutral-950 font-bold'
              : 'text-sky-400 hover:text-sky-300 hover:bg-neutral-800'
          }`}
        >
          <Plane className="w-3 h-3" />
          <span>Flights</span>
        </button>
        <button
          onClick={() => setFilterMode('bus')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            filterMode === 'bus'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-amber-400 hover:text-amber-300 hover:bg-neutral-800'
          }`}
        >
          <Bus className="w-3 h-3" />
          <span>Buses</span>
        </button>
        <button
          onClick={() => setFilterMode('hotels')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            filterMode === 'hotels'
              ? 'bg-indigo-500 text-white font-bold'
              : 'text-indigo-400 hover:text-indigo-300 hover:bg-neutral-800'
          }`}
        >
          <HotelIcon className="w-3 h-3" />
          <span>Hotels</span>
        </button>
      </div>

      {/* Top Right HUD: Fit Bounds & Journey Simulator */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2">
        <button
          onClick={toggleTour}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border shadow-lg transition-all ${
            isTourPlaying
              ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
              : 'bg-neutral-900/90 text-neutral-200 border-neutral-700 hover:bg-neutral-800'
          }`}
          title="Play interactive journey walkthrough"
        >
          {isTourPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Tour</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate Journey</span>
            </>
          )}
        </button>
        
        {isTourPlaying && (
          <button
            onClick={resetTour}
            className="p-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-lg shadow-md transition-colors"
            title="Reset Tour"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={handleFitBounds}
          className="p-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-lg shadow-md transition-colors"
          title="Fit whole itinerary to map"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Bottom Map Legend Bar */}
      <div className="bg-neutral-900/95 border-t border-neutral-800 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 gap-3 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block"></span>
            <span className="text-neutral-300">High-Speed Rail</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-sky-500 border-b border-dashed border-sky-300 rounded-full inline-block"></span>
            <span className="text-neutral-300">Air Corridor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-500 rounded-full inline-block"></span>
            <span className="text-neutral-300">Intercity Coach</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm inline-block"></span>
            <span className="text-neutral-300">Transit Hotel</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-neutral-300">
          <span>{stops.length} stops</span>
          <span>·</span>
          <span>{segments.length} travel legs</span>
          <span>·</span>
          <span className="text-emerald-400">
            {segments.filter(s => s.isBooked).length}/{segments.length} booked
          </span>
        </div>
      </div>
    </div>
  );
};
