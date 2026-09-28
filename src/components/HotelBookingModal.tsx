import React, { useState } from 'react';
import { Hotel } from '../types/travel';
import { 
  X, 
  Hotel as HotelIcon, 
  Star, 
  MapPin, 
  Coffee, 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  Bed, 
  CreditCard 
} from 'lucide-react';

interface HotelBookingModalProps {
  hotel: Hotel | null;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  onClose: () => void;
  onConfirmReservation: (hotelId: string, roomType: string) => void;
}

export const HotelBookingModal: React.FC<HotelBookingModalProps> = ({
  hotel,
  checkInDate,
  checkOutDate,
  nights,
  onClose,
  onConfirmReservation
}) => {
  if (!hotel) return null;

  const [selectedRoom, setSelectedRoom] = useState<string>(hotel.roomType);
  const [guestName, setGuestName] = useState<string>('Alex Rivera');
  const [specialRequest, setSpecialRequest] = useState<string>('High floor, quiet side requested');
  const [isReservedSuccess, setIsReservedSuccess] = useState<boolean>(false);

  const roomOptions = [
    {
      name: hotel.roomType,
      bed: '1 King Bed',
      sqm: '28 m²',
      priceModifier: 0,
      description: 'Soundproofed with direct city view, rain shower, and ergonomic desk.'
    },
    {
      name: 'Executive Panoramic Suite',
      bed: '1 King Bed + Lounge',
      sqm: '42 m²',
      priceModifier: 65,
      description: 'Includes lounge access, complimentary afternoon tea, and prime skyline vista.'
    }
  ];

  const activeRoom = roomOptions.find(r => r.name === selectedRoom) || roomOptions[0];
  const totalPrice = (hotel.pricePerNight + activeRoom.priceModifier) * (nights || 1);

  const handleReserve = () => {
    onConfirmReservation(hotel.id, selectedRoom);
    setIsReservedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div>
            <div className="flex items-center gap-2">
              <HotelIcon className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">{hotel.name}</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              <span>{hotel.address} · {hotel.distanceToTransit}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {hotel.isBooked && !isReservedSuccess ? (
            /* Confirmed Voucher View */
            <div className="bg-neutral-950 border border-indigo-500/40 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Confirmed Hotel Reservation Voucher
                  </span>
                </div>
                <span className="font-mono text-xs text-neutral-400">
                  Ref: <strong className="text-neutral-100">{hotel.bookingRef || 'HTL-88219'}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400">Check-in:</span>
                  <div className="font-mono font-semibold text-neutral-100 text-sm mt-0.5">{checkInDate} (15:00)</div>
                </div>
                <div>
                  <span className="text-neutral-400">Check-out:</span>
                  <div className="font-mono font-semibold text-neutral-100 text-sm mt-0.5">{checkOutDate} (11:00)</div>
                </div>
              </div>

              <div className="bg-neutral-900/80 p-3 rounded-lg border border-neutral-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Reserved Room:</span>
                  <span className="font-bold text-neutral-200">{hotel.roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Stay Duration:</span>
                  <span className="font-mono text-neutral-200">{nights} Nights</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Breakfast:</span>
                  <span className="text-emerald-400 font-medium">Included Daily for 2 Guests</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Free cancellation until 24 hours before check-in</span>
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
            /* Room Selection View */
            <>
              {/* Hotel Rating & Transit proximity banner */}
              <div className="flex items-center justify-between bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-800/50 px-2 py-1 rounded text-amber-300 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hotel.rating}</span>
                  </div>
                  <div className="text-xs">
                    <div className="text-neutral-200 font-semibold">{hotel.stars}-Star Transit Oasis</div>
                    <div className="text-neutral-400">{hotel.reviewsCount} verified traveler reviews</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-400 font-mono">Transit Hub</div>
                  <div className="text-xs text-emerald-400 font-medium">{hotel.distanceToTransit}</div>
                </div>
              </div>

              {/* Stay Dates Banner */}
              <div className="grid grid-cols-2 gap-3 bg-neutral-950/60 p-3 rounded-lg border border-neutral-800 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <div>
                    <span className="text-neutral-500 text-[10px] block">CHECK-IN</span>
                    <span className="font-mono font-medium text-neutral-200">{checkInDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <div>
                    <span className="text-neutral-500 text-[10px] block">CHECK-OUT</span>
                    <span className="font-mono font-medium text-neutral-200">{checkOutDate} ({nights} nights)</span>
                  </div>
                </div>
              </div>

              {/* Available Rooms */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Select Room Type
                </h4>
                {roomOptions.map((room) => {
                  const isSelected = selectedRoom === room.name;
                  const roomPricePerNight = hotel.pricePerNight + room.priceModifier;
                  return (
                    <div
                      key={room.name}
                      onClick={() => setSelectedRoom(room.name)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-800/80 border-indigo-500 ring-1 ring-indigo-500/30'
                          : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-sm text-neutral-100">{room.name}</div>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                            <Bed className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{room.bed}</span>
                            <span>·</span>
                            <span>{room.sqm}</span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1.5">{room.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-base font-bold text-neutral-100">
                            ${roomPricePerNight}
                          </div>
                          <div className="text-[11px] text-neutral-400">/ night</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Included Amenities
                </h4>
                <div className="flex flex-wrap gap-2 text-xs text-neutral-300">
                  {hotel.amenities.map((am, i) => (
                    <span key={i} className="bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800 flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>{am}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Lead Guest */}
              <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Primary Guest</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Special Requests</label>
                    <input
                      type="text"
                      value={specialRequest}
                      onChange={e => setSpecialRequest(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!hotel.isBooked && (
          <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between">
            <div>
              <div className="text-xs text-neutral-400">Total for {nights} Nights:</div>
              <div className="font-mono text-xl font-black text-neutral-100">
                ${totalPrice}
              </div>
              <span className="text-[11px] text-emerald-400">No deposit required · Free cancellation</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReserve}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-indigo-900/40 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Reserve Room</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
