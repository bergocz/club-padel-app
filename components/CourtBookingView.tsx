'use client';

import React, { useState } from 'react';
import { Court, Player } from '../types';
import { COURTS } from '../data/courts';
import { Calendar, Clock, MapPin, Check, Plus, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

interface CourtBookingViewProps {
  currentUser: Player;
  onOpenCreateMatchWithCourt: (court: Court, time: string, date: string) => void;
}

export const CourtBookingView: React.FC<CourtBookingViewProps> = ({
  currentUser,
  onOpenCreateMatchWithCourt,
}) => {
  const [selectedDate, setSelectedDate] = useState('Hoy, 15 Oct');
  const [filterIndoor, setFilterIndoor] = useState<boolean | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const dates = [
    { label: 'Hoy', date: 'Hoy, 15 Oct' },
    { label: 'Mañana', date: 'Mañana, 16 Oct' },
    { label: 'Viernes', date: 'Viernes, 17 Oct' },
    { label: 'Sábado', date: 'Sábado, 18 Oct' },
    { label: 'Domingo', date: 'Domingo, 19 Oct' },
  ];

  const timeSlots = [
    '09:00 - 10:30',
    '10:30 - 12:00',
    '12:00 - 13:30',
    '16:30 - 18:00',
    '18:00 - 19:30',
    '19:30 - 21:00',
    '21:00 - 22:30',
  ];

  // Mock booked slots
  const isBooked = (courtId: string, slot: string) => {
    if (courtId === 'court-1' && (slot === '18:00 - 19:30' || slot === '19:30 - 21:00')) return true;
    if (courtId === 'court-2' && slot === '19:30 - 21:00') return true;
    if (courtId === 'court-3' && slot === '10:30 - 12:00') return true;
    return false;
  };

  const filteredCourts = COURTS.filter(c => {
    if (filterIndoor === null) return true;
    return c.indoor === filterIndoor;
  });

  const handleBookPrivate = (court: Court, slot: string) => {
    setBookingSuccess(`¡Pista reservada con éxito! ${court.name} para ${selectedDate} a las ${slot}. Confirmación enviada.`);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Date Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            Reserva de Pistas Espadel Club
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Reserva la pista completa para tu grupo privado o ábrela a socios del club para completar plaza
          </p>
        </div>

        {/* Date Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {dates.map(d => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedDate === d.date
                  ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {d.label}
              <span className="block text-[10px] font-normal opacity-80">{d.date.split(',')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Booking Feedback Alert */}
      {bookingSuccess && (
        <div className="p-4 rounded-2xl bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-5 h-5 text-yellow-400 shrink-0" />
          <span>{bookingSuccess}</span>
        </div>
      )}

      {/* Courts List & Timetable Grid */}
      <div className="space-y-6">
        {filteredCourts.map(court => (
          <div
            key={court.id}
            className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl"
          >
            {/* Court Header Bar */}
            <div className="p-4 sm:p-5 border-b border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-zinc-700 shrink-0 relative">
                  <img src={court.image} alt={court.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white">{court.name}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      court.indoor ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {court.indoor ? 'Indoor Climatizada' : 'Outdoor'}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                    <span>{court.surface}</span>
                    <span>•</span>
                    <span className="text-yellow-400 font-bold font-mono">{court.priceHour}€/hora</span>
                  </div>
                </div>
              </div>

              {/* Court Features */}
              <div className="flex flex-wrap gap-1.5">
                {court.features.map((feat, idx) => (
                  <span key={idx} className="text-[10px] bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded-lg border border-zinc-800">
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Timetable slots */}
            <div className="p-4 sm:p-5">
              <div className="text-xs font-semibold text-zinc-400 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                Horarios Disponibles para {selectedDate} (turnos de 90 min):
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {timeSlots.map(slot => {
                  const booked = isBooked(court.id, slot);

                  if (booked) {
                    return (
                      <div
                        key={slot}
                        className="p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-center opacity-50 cursor-not-allowed"
                      >
                        <div className="text-xs font-mono font-medium text-zinc-500 line-through">{slot}</div>
                        <div className="text-[10px] text-zinc-600 font-bold mt-1">Ocupada</div>
                      </div>
                    );
                  }

                  const price90 = Math.round(court.priceHour * 1.5);
                  const pricePerPerson = Math.round(price90 / 4);

                  return (
                    <div
                      key={slot}
                      className="p-2.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-yellow-400/60 hover:bg-zinc-900 transition flex flex-col justify-between group"
                    >
                      <div className="text-xs font-mono font-bold text-white text-center mb-1">
                        {slot.split(' - ')[0]}
                      </div>
                      <div className="text-[10px] text-center text-zinc-400 mb-2">
                        {price90}€ <span className="text-[9px]">({pricePerPerson}€/jug)</span>
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => handleBookPrivate(court, slot)}
                          className="w-full py-1 px-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-[10px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
                          title="Reserva completa para ti y tus 3 amigos"
                        >
                          <ShieldCheck className="w-3 h-3" /> Privada
                        </button>
                        <button
                          onClick={() => onOpenCreateMatchWithCourt(court, slot, selectedDate)}
                          className="w-full py-1 px-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-bold transition flex items-center justify-center gap-1 border border-zinc-700"
                          title="Reserva 1 plaza y abre las otras 3 a socios"
                        >
                          <UserCheck className="w-3 h-3 text-yellow-400" /> Abrir
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
