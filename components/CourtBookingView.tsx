'use client';

import React, { useState } from 'react';
import { Court, Player } from '../types';
import { COURTS } from '../data/courts';
import { TIME_SLOTS_90MIN, TIME_SLOTS_60MIN, SCHEDULE_DATES, CLUB_HOURS } from '../data/schedule';
import { Calendar, Clock, MapPin, Check, Plus, ShieldCheck, Sparkles, UserCheck, Lock } from 'lucide-react';

interface CourtBookingViewProps {
  currentUser: Player;
  onOpenCreateMatchWithCourt: (court: Court, time: string, date: string) => void;
}

export const CourtBookingView: React.FC<CourtBookingViewProps> = ({
  currentUser,
  onOpenCreateMatchWithCourt,
}) => {
  const [selectedDate, setSelectedDate] = useState('Hoy, 15 Oct');
  const [durationMinutes, setDurationMinutes] = useState<90 | 60>(90);
  const [filterIndoor, setFilterIndoor] = useState<boolean | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const activeTimeSlots = durationMinutes === 90 ? TIME_SLOTS_90MIN : TIME_SLOTS_60MIN;

  // Mock booked slots for realism
  const isBooked = (courtId: string, slot: string) => {
    if (courtId === 'court-1' && (slot === '19:00 - 20:30' || slot === '20:30 - 22:00')) return true;
    if (courtId === 'court-2' && slot === '19:00 - 20:30') return true;
    if (courtId === 'court-4' && slot === '19:00 - 20:30') return true;
    if (courtId === 'court-3' && slot === '17:30 - 19:00') return true;
    return false;
  };

  const filteredCourts = COURTS.filter(c => {
    if (filterIndoor === null) return true;
    return c.indoor === filterIndoor;
  });

  const handleBookPrivate = (court: Court, slot: string) => {
    const price = durationMinutes === 90 ? Math.round(court.priceHour * 1.5) : court.priceHour;
    setBookingSuccess(`¡Pista reservada con éxito! ${court.name} para ${selectedDate} a las ${slot} (${durationMinutes} min). Total: ${price}€. Confirmación enviada a tu email.`);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Date Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-yellow-400 font-bold">
              Espadel Club • Horario {CLUB_HOURS.open} a {CLUB_HOURS.close}
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            Reserva Directa de Pistas
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Reserva pista privada para tu grupo o ábrela a socios del club para completar plazas
          </p>
        </div>

        {/* Duration toggle */}
        <div className="flex items-center gap-2 bg-black border border-zinc-800 p-1.5 rounded-2xl self-start md:self-center">
          <span className="text-[11px] font-mono text-zinc-400 pl-2 pr-1 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-yellow-400" /> Duración:
          </span>
          <button
            onClick={() => setDurationMinutes(90)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              durationMinutes === 90
                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>90 min (1h 30m)</span>
            <span className="text-[9px] bg-black/20 text-black px-1 rounded uppercase font-mono font-bold">Habitual</span>
          </button>
          <button
            onClick={() => setDurationMinutes(60)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
              durationMinutes === 60
                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>60 min (1h)</span>
          </button>
        </div>
      </div>

      {/* Date Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SCHEDULE_DATES.map(d => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              selectedDate === d.date
                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            {d.label}
            <span className="block text-[10px] font-mono opacity-80">{d.date.split(', ')[1]}</span>
          </button>
        ))}
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
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                      Césped Azul Oficial WPT
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
                <Clock className="w-3.5 h-3.5 text-yellow-400" />
                <span>Horarios Disponibles de {CLUB_HOURS.open} a {CLUB_HOURS.close} ({durationMinutes} min):</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {activeTimeSlots.map(slot => {
                  const booked = isBooked(court.id, slot.time);
                  const price = durationMinutes === 90 ? Math.round(court.priceHour * 1.5) : court.priceHour;

                  if (booked) {
                    return (
                      <div
                        key={slot.id}
                        className="p-3 rounded-2xl bg-zinc-900/30 border border-zinc-900 flex flex-col justify-between opacity-50 cursor-not-allowed"
                      >
                        <div className="text-xs font-mono font-bold text-zinc-500">{slot.time}</div>
                        <span className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Ocupada
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={slot.id}
                      className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-yellow-400 transition flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-white group-hover:text-yellow-400 transition">
                          {slot.time}
                        </span>
                        <span className="text-[10px] font-mono text-yellow-400 font-bold">
                          {price}€
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5">
                        <button
                          onClick={() => handleBookPrivate(court, slot.time)}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-[10px] transition text-center shadow-sm"
                        >
                          Reservar
                        </button>
                        <button
                          onClick={() => onOpenCreateMatchWithCourt(court, slot.time, selectedDate)}
                          className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                          title="Abrir partido en este horario"
                        >
                          <Plus className="w-3.5 h-3.5" />
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
