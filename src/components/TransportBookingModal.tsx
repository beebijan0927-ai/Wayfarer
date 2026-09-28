import React, { useState } from 'react';
import { TransportSegment, TransportOption } from '../types/travel';
import { 
  X, 
  Train, 
  Plane, 
  Bus, 
  Clock, 
  Leaf, 
  Luggage, 
  Wifi, 
  Coffee, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  QrCode,
  Download,
  AlertCircle
} from 'lucide-react';

interface TransportBookingModalProps {
  segment: TransportSegment | null;
  onClose: () => void;
  onConfirmBooking: (segmentId: string, optionId: string, seatChoice: string) => void;
}

export const TransportBookingModal: React.FC<TransportBookingModalProps> = ({
  segment,
  onClose,
  onConfirmBooking
}) => {
  if (!segment) return null;

  const [selectedOptId, setSelectedOptId] = useState<string>(segment.selectedOptionId || segment.options[0]?.id || '');
  const [seatChoice, setSeatChoice] = useState<string>('Window · Quiet Carriage');
  const [passengerName, setPassengerName] = useState<string>('Alex Rivera');
  const [passengerEmail, setPassengerEmail] = useState<string>('alex.rivera@example.com');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const selectedOption = segment.options.find(o => o.id === selectedOptId) || segment.options[0];

  const handleBook = () => {
    onConfirmBooking(segment.id, selectedOptId, seatChoice);
    setBookingSuccess(true);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'flight':
        return <Plane className="w-4 h-4 text-sky-400" />;
      case 'bus':
        return <Bus className="w-4 h-4 text-amber-400" />;
      default:
        return <Train className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">
                {segment.fromName}
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
              <span className="text-base font-bold text-white">
                {segment.toName}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select your preferred transportation mode and instantly reserve your e-ticket
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {segment.isBooked && !bookingSuccess ? (
            /* Active Boarding Pass View */
            <div className="bg-neutral-950 border border-emerald-500/30 rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    Confirmed E-Ticket & Boarding Pass
                  </span>
                </div>
                <span className="font-mono text-xs text-neutral-400">
                  PNR: <strong className="text-neutral-100">{segment.pnr || 'WF9821'}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                <div>
                  <div className="text-[11px] text-neutral-400">Departure Station</div>
                  <div className="text-sm font-semibold text-neutral-100 mt-0.5">{selectedOption?.fromStation}</div>
                  <div className="font-mono text-xs text-emerald-400 mt-1">{selectedOption?.departureTime}</div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    {getModeIcon(selectedOption?.mode || 'train')}
                    <span className="font-mono">{selectedOption?.duration}</span>
                  </div>
                  <div className="w-28 h-0.5 bg-neutral-700 my-2 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-[10px] text-neutral-400">{selectedOption?.provider}</span>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-neutral-400">Arrival Station</div>
                  <div className="text-sm font-semibold text-neutral-100 mt-0.5">{selectedOption?.toStation}</div>
                  <div className="font-mono text-xs text-emerald-400 mt-1">{selectedOption?.arrivalTime}</div>
                </div>
              </div>

              <div className="bg-neutral-900/90 rounded-lg p-3 border border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-400">Seat Assignment: </span>
                  <span className="font-bold text-neutral-100">{segment.seatAssigned || 'Carriage 04, Seat 21'}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Fare Class: </span>
                  <span className="font-semibold text-neutral-100">{selectedOption?.seatClass}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-emerald-400 font-bold">
                  <span>${selectedOption?.price}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded p-1 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-neutral-950" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-white">Apple Wallet & Google Wallet Ready</div>
                    <div className="text-[11px] text-neutral-400 font-mono">Scan at automated station gates</div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Choose Transportation Mode Options */
            <>
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Available Transport Modes & Operators
                </h4>

                <div className="space-y-3">
                  {segment.options.map(opt => {
                    const isCurrent = opt.id === selectedOptId;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedOptId(opt.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-neutral-800/80 border-emerald-500/70 ring-1 ring-emerald-500/30'
                            : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg ${
                              opt.mode === 'train' 
                                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40' 
                                : opt.mode === 'flight'
                                ? 'bg-sky-950/70 text-sky-400 border border-sky-800/40'
                                : 'bg-amber-950/70 text-amber-400 border border-amber-800/40'
                            }`}>
                              {getModeIcon(opt.mode)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-neutral-100">{opt.provider}</span>
                                <span className="text-[11px] font-mono text-neutral-400">({opt.operatorNumber})</span>
                                {opt.isRecommended && (
                                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                                    Recommended Route
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-neutral-400 mt-0.5">
                                {opt.fromStation} → {opt.toStation}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-mono text-lg font-bold text-neutral-100">
                              ${opt.price}
                            </div>
                            <div className="text-[11px] text-neutral-400">per traveler</div>
                          </div>
                        </div>

                        {/* Mid Row: Timing, Duration, Eco Metrics */}
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-neutral-800/60 text-xs">
                          <div>
                            <span className="text-neutral-500">Departure: </span>
                            <span className="font-mono font-semibold text-neutral-200">{opt.departureTime}</span>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-400">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span className="font-mono">{opt.duration}</span>
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            <Leaf className="w-3 h-3 text-emerald-400" />
                            <span className="font-mono text-emerald-400 font-semibold">{opt.co2Kg} kg CO₂</span>
                          </div>
                        </div>

                        {/* Amenities pill list */}
                        <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 text-[11px] text-neutral-400">
                          {opt.amenities.map((am, i) => (
                            <span key={i} className="bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Passenger & Seat Preferences */}
              <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 space-y-4">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Passenger & Seat Customization
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Lead Passenger</label>
                    <input
                      type="text"
                      value={passengerName}
                      onChange={e => setPassengerName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Ticket Delivery Email</label>
                    <input
                      type="email"
                      value={passengerEmail}
                      onChange={e => setPassengerEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1.5">Seating Preference</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {['Window · Quiet Carriage', 'Aisle · Quick Exit', 'Table 4-Seater (Group)'].map(pref => (
                      <button
                        key={pref}
                        onClick={() => setSeatChoice(pref)}
                        className={`px-3 py-2 rounded-lg border text-center transition-colors ${
                          seatChoice === pref
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-neutral-400 flex items-center gap-2 pt-2 border-t border-neutral-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Instant e-ticket generation with carrier-backed QR pass & guaranteed connection protection.</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!segment.isBooked && (
          <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-xs text-neutral-400">Total Ticket Fare:</div>
              <div className="font-mono text-xl font-black text-neutral-100">
                ${selectedOption?.price}
              </div>
              <span className="text-[11px] text-neutral-400">Taxes & seat reservation included</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBook}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-emerald-900/40 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Issue Ticket</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
