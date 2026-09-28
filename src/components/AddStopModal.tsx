import React, { useState } from 'react';
import { RouteStop } from '../types/travel';
import { X, MapPin, Plus, Sparkles, Building, Calendar } from 'lucide-react';

interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStop: (stop: RouteStop) => void;
}

const CITY_PRESETS = [
  { name: 'Amsterdam', country: 'Netherlands', code: 'AMS', lat: 52.3676, lng: 4.9041, desc: 'Canal rings, Rijksmuseum, and world-class cycling culture.', highlights: ['Amsterdam Centraal', 'Van Gogh Museum', 'Jordaan'] },
  { name: 'Vienna', country: 'Austria', code: 'VIE', lat: 48.2082, lng: 16.3738, desc: 'Imperial palaces, grand opera, and historic coffeehouse traditions.', highlights: ['Wien Hauptbahnhof', 'Schönbrunn Palace', 'St. Stephen\'s'] },
  { name: 'Barcelona', country: 'Spain', code: 'BCN', lat: 41.3879, lng: 2.1699, desc: 'Gaudí masterpieces, sunny Mediterranean beaches, and Gothic alleys.', highlights: ['Barcelona Sants', 'Sagrada Família', 'Park Güell'] },
  { name: 'Florence', country: 'Italy', code: 'FLR', lat: 43.7696, lng: 11.2558, desc: 'Cradle of the Renaissance, Uffizi masterpieces, and Tuscan culinary heritage.', highlights: ['Santa Maria Novella', 'Duomo', 'Ponte Vecchio'] },
  { name: 'Munich', country: 'Germany', code: 'MUC', lat: 48.1351, lng: 11.5820, desc: 'Bavarian culture, Englischer Garten, and gateway to the Alps.', highlights: ['München Hbf', 'Marienplatz', 'Nymphenburg Palace'] }
];

export const AddStopModal: React.FC<AddStopModalProps> = ({
  isOpen,
  onClose,
  onAddStop
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState<string>('Amsterdam');
  const [country, setCountry] = useState<string>('Netherlands');
  const [code, setCode] = useState<string>('AMS');
  const [lat, setLat] = useState<number>(52.3676);
  const [lng, setLng] = useState<number>(4.9041);
  const [nights, setNights] = useState<number>(2);
  const [description, setDescription] = useState<string>('Historic canals and vibrant art quarters.');

  const handleSelectPreset = (preset: typeof CITY_PRESETS[0]) => {
    setName(preset.name);
    setCountry(preset.country);
    setCode(preset.code);
    setLat(preset.lat);
    setLng(preset.lng);
    setDescription(preset.desc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStop: RouteStop = {
      id: `stop-${Date.now()}`,
      name,
      country,
      code: code.toUpperCase(),
      lat: Number(lat),
      lng: Number(lng),
      arrivalDate: '2026-10-18',
      departureDate: '2026-10-20',
      nights,
      description,
      highlights: ['Central Station', 'Historic Old Town', 'Local Market']
    };
    onAddStop(newStop);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Add Destination Stop to Route</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-2">
              Quick Pick Popular Transit Cities
            </label>
            <div className="flex flex-wrap gap-2">
              {CITY_PRESETS.map(preset => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    name === preset.name
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">City Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Country</label>
              <input
                type="text"
                required
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Station/Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-emerald-500 uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Stay Nights</label>
              <input
                type="number"
                min={1}
                max={14}
                required
                value={nights}
                onChange={e => setNights(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                required
                value={lat}
                onChange={e => setLat(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1">Highlights / Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-emerald-900/40"
            >
              Add to Route Map
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
