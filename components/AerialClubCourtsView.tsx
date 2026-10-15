'use client';

import React, { useState } from 'react';
import { OpenMatch, Player, MatchSlot } from '../types';
import { ESPADEL_COURTS, AerialCourt } from '../data/courts';
import { TIME_SLOTS_90MIN, TIME_SLOTS_60MIN, SCHEDULE_DATES, CLUB_HOURS } from '../data/schedule';
import { LevelBadge } from './LevelBadge';
import { 
  Users, Plus, CheckCircle, ShieldCheck, MapPin, Sparkles, Clock, 
  AlertCircle, X, ChevronRight, UserPlus, Calendar, Lock, Unlock,
  Check, ArrowRight, Info
} from 'lucide-react';

interface AerialClubCourtsViewProps {
  matches: OpenMatch[];
  currentUser: Player;
  onJoinMatchSlot: (matchId: string, position: 1 | 2 | 3 | 4) => void;
  onLeaveMatchSlot: (matchId: string, position: 1 | 2 | 3 | 4) => void;
  onOpenCreateMatchWithCourtNumber: (courtNumber: number, time?: string, date?: string) => void;
  onBookCourtDirect?: (courtNumber: number, time: string, date: string, isPrivate: boolean) => void;
}

export const AerialClubCourtsView: React.FC<AerialClubCourtsViewProps> = ({
  matches,
  currentUser,
  onJoinMatchSlot,
  onLeaveMatchSlot,
  onOpenCreateMatchWithCourtNumber,
  onBookCourtDirect,
}) => {
  // Date & Duration state
  const [selectedDate, setSelectedDate] = useState<string>('Hoy, 15 Oct');
  const [durationMinutes, setDurationMinutes] = useState<90 | 60>(90);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('19:00 - 20:30');
  const [selectedCourtNumber, setSelectedCourtNumber] = useState<number | null>(null);

  // Quick booking modal for free courts
  const [bookingModalCourt, setBookingModalCourt] = useState<AerialCourt | null>(null);
  const [bookingFeedback, setBookingFeedback] = useState<string | null>(null);

  // Time slot list according to duration
  const activeSlots = durationMinutes === 90 ? TIME_SLOTS_90MIN : TIME_SLOTS_60MIN;

  // Make sure selectedTimeSlot is valid when duration changes
  const handleDurationChange = (duration: 90 | 60) => {
    setDurationMinutes(duration);
    if (duration === 90) {
      setSelectedTimeSlot('19:00 - 20:30');
    } else {
      setSelectedTimeSlot('19:00 - 20:00');
    }
    setSelectedCourtNumber(null);
  };

  // Group courts by Nave
  const naveACourts = ESPADEL_COURTS.filter(c => c.naveId === 'nave-a'); // 1 and 2
  const naveBCourts = ESPADEL_COURTS.filter(c => c.naveId === 'nave-b'); // 3, 4, 5, 6

  // Helper to find match for a court at selected date and time
  const getMatchForCourtAtSlot = (courtNumber: number) => {
    return matches.find(m => {
      const isSameCourt = m.courtName.includes(`Pista ${courtNumber}`);
      const isSameDate = m.date === selectedDate;
      const isSameTime = m.time.startsWith(selectedTimeSlot.split(' - ')[0]);
      return isSameCourt && isSameDate && isSameTime;
    });
  };

  // Summary counts for currently selected time slot
  const currentSlotMatches = ESPADEL_COURTS.map(c => getMatchForCourtAtSlot(c.number)).filter(Boolean) as OpenMatch[];
  const totalOpenSlotsInClub = currentSlotMatches.reduce((acc, m) => acc + m.slots.filter(s => !s.player).length, 0);
  const freeCourtsCount = 6 - currentSlotMatches.length;

  const selectedCourt = ESPADEL_COURTS.find(c => c.number === selectedCourtNumber);
  const selectedMatch = selectedCourtNumber ? getMatchForCourtAtSlot(selectedCourtNumber) : null;

  // Handle Quick Booking of a Free Court
  const handleConfirmCourtBooking = (isPrivate: boolean) => {
    if (!bookingModalCourt) return;
    
    if (isPrivate) {
      const price = durationMinutes === 90 
        ? Math.round(bookingModalCourt.priceHour * 1.5) 
        : bookingModalCourt.priceHour;
      setBookingFeedback(`¡Pista ${bookingModalCourt.number} reservada en exclusiva para el ${selectedDate} de ${selectedTimeSlot}! Total: ${price}€.`);
      setBookingModalCourt(null);
      setTimeout(() => setBookingFeedback(null), 5000);
    } else {
      // Open match creation
      onOpenCreateMatchWithCourtNumber(bookingModalCourt.number, selectedTimeSlot, selectedDate);
      setBookingModalCourt(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. CLUB SCHEDULE & HORARIOS HEADER (07:00 a 23:00) */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4">
        {/* Top line info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
              <span className="text-xs font-mono uppercase tracking-wider text-yellow-400 font-bold">
                Espadel Club • Horario Oficial 07:00 - 23:00
              </span>
              <span className="text-[10px] bg-yellow-400/10 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400/20 font-mono">
                Abierto Ahora
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Visión Aérea de Partidos Abiertos y Horarios Libres
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Haz clic en cualquier <strong>hueco abierto</strong> para apuntarte al partido o en una <strong>pista libre</strong> para reservarla.
            </p>
          </div>

          {/* DURATION SELECTOR TOGGLE (90m habitual vs 60m) */}
          <div className="flex items-center gap-2 bg-black border border-zinc-800 p-1.5 rounded-2xl self-start md:self-center">
            <span className="text-[11px] font-mono text-zinc-400 pl-2 pr-1 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-yellow-400" /> Duración:
            </span>
            <button
              onClick={() => handleDurationChange(90)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                durationMinutes === 90
                  ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>90 min (1h 30m)</span>
              <span className="text-[9px] bg-black/20 text-black px-1.5 py-0.2 rounded font-mono uppercase font-bold">
                Habitual
              </span>
            </button>
            <button
              onClick={() => handleDurationChange(60)}
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

        {/* DATE SELECTOR BAR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono text-zinc-500 flex items-center gap-1 mr-1 shrink-0">
            <Calendar className="w-3.5 h-3.5" /> Día:
          </span>
          {SCHEDULE_DATES.map(d => (
            <button
              key={d.date}
              onClick={() => {
                setSelectedDate(d.date);
                setSelectedCourtNumber(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
                selectedDate === d.date
                  ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/10'
                  : 'bg-zinc-900 border border-zinc-800/80 text-zinc-300 hover:border-yellow-400/40 hover:text-white'
              }`}
            >
              <span>{d.label}</span>
              <span className={`text-[10px] font-mono ${selectedDate === d.date ? 'text-black/80 font-bold' : 'text-zinc-500'}`}>
                {d.date.split(', ')[1]}
              </span>
            </button>
          ))}
        </div>

        {/* TIMELINE HORARIOS SELECTOR (07:00 a 23:00) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-zinc-400 font-semibold flex items-center gap-1.5">
              <span>Franja Horaria ({CLUB_HOURS.open} - {CLUB_HOURS.close}):</span>
              <strong className="text-yellow-400 font-bold">{selectedTimeSlot}</strong>
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <strong className="text-yellow-400 font-bold">{totalOpenSlotsInClub}</strong> huecos abiertos
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <strong className="text-emerald-400 font-bold">{freeCourtsCount}</strong> pistas libres
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {activeSlots.map(slot => {
              // Count open spots in this specific slot
              const slotMatches = ESPADEL_COURTS.map(c => {
                return matches.find(m => {
                  return m.courtName.includes(`Pista ${c.number}`) &&
                         m.date === selectedDate &&
                         m.time.startsWith(slot.startTime);
                });
              }).filter(Boolean) as OpenMatch[];

              const openSpots = slotMatches.reduce((acc, m) => acc + m.slots.filter(s => !s.player).length, 0);
              const freeCourts = 6 - slotMatches.length;
              const isSelected = selectedTimeSlot === slot.time;

              return (
                <button
                  key={slot.id}
                  onClick={() => {
                    setSelectedTimeSlot(slot.time);
                    setSelectedCourtNumber(null);
                  }}
                  className={`px-3 py-2 rounded-2xl transition shrink-0 flex flex-col items-center justify-center min-w-[105px] border ${
                    isSelected
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-yellow-400/40 hover:bg-zinc-850'
                  }`}
                >
                  <span className={`text-xs font-black font-mono tracking-tight ${isSelected ? 'text-black' : 'text-white'}`}>
                    {slot.startTime}
                  </span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-black/80' : 'text-zinc-500'}`}>
                    {slot.endTime}
                  </span>

                  {/* Slot Status Tag */}
                  <div className="mt-1">
                    {openSpots > 0 ? (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        isSelected 
                          ? 'bg-black text-yellow-400 font-mono' 
                          : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                      }`}>
                        {openSpots} {openSpots === 1 ? 'hueco' : 'huecos'}
                      </span>
                    ) : freeCourts === 6 ? (
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                        isSelected 
                          ? 'bg-black/20 text-black font-mono' 
                          : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                      }`}>
                        Libre
                      </span>
                    ) : (
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                        isSelected 
                          ? 'bg-black/20 text-black' 
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {freeCourts} libres
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Feedback Alert */}
      {bookingFeedback && (
        <div className="p-4 rounded-2xl bg-yellow-400/15 border-2 border-yellow-400 text-yellow-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-5 h-5 text-yellow-400 shrink-0" />
          <span>{bookingFeedback}</span>
        </div>
      )}

      {/* QUICK LEGEND & INSTRUCTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-mono text-xs">Posición en pista:</span>
          <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-xl">
            Revés = Izquierda ⬅️
          </span>
          <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-xl">
            Derecha (Drive) = Derecha ➡️
          </span>
        </div>

        <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-2xl">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-yellow-400 bg-yellow-400/20 animate-pulse" />
            <span className="text-yellow-400 font-bold">Hueco Abierto</span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-white bg-zinc-700" />
            <span className="text-zinc-300 font-medium">Jugador</span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-emerald-400 bg-emerald-400/20" />
            <span className="text-emerald-400 font-medium">Pista Libre</span>
          </div>
        </div>
      </div>

      {/* 2. AERIAL BLUEPRINT GRID (6 PISTAS EN AZUL OFICIAL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* NAVE 1 (SALA PRINCIPAL): 2 PISTAS (Pistas 1 y 2 - Horizontales) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-xl border border-yellow-400/20">
                NAVE 1 (SALA PRINCIPAL)
              </span>
              <span className="text-xs text-zinc-400">Pistas 1 y 2 (Horizontales)</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-4 sm:p-5 shadow-xl space-y-5">
            {naveACourts.map(court => {
              const courtMatch = getMatchForCourtAtSlot(court.number);
              return (
                <AerialCourtCanvas
                  key={court.id}
                  court={court}
                  match={courtMatch}
                  selectedTime={selectedTimeSlot}
                  selectedDate={selectedDate}
                  currentUser={currentUser}
                  isSelected={selectedCourtNumber === court.number}
                  onSelect={() => setSelectedCourtNumber(court.number)}
                  onJoinSlot={(pos) => {
                    if (courtMatch) {
                      onJoinMatchSlot(courtMatch.id, pos);
                    } else {
                      setBookingModalCourt(court);
                    }
                  }}
                  onLeaveSlot={(pos) => {
                    if (courtMatch) onLeaveMatchSlot(courtMatch.id, pos);
                  }}
                  onOpenBookingModal={() => setBookingModalCourt(court)}
                />
              );
            })}
          </div>
        </div>

        {/* NAVE 2 (SALA ANEXA): 4 PISTAS (Pistas 4 y 3 a la izquierda; Pistas 6 y 5 a la derecha) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-xl border border-yellow-400/20">
                NAVE 2 (SALA ANEXA)
              </span>
              <span className="text-xs text-zinc-400">4 Pistas Horizontales</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-4 sm:p-5 shadow-xl">
            {/* Grid 2 Columnas para Nave 2:
                Columna Izquierda: Pista 4 (arriba a la izquierda) y Pista 3 (abajo a la izquierda)
                Columna Derecha: Pista 6 (arriba a la derecha) y Pista 5 (en el medio a la derecha)
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Columna Izquierda: Pista 4 (arriba) y Pista 3 (abajo) */}
              <div className="space-y-4">
                {/* Pista 4 (arriba a la izquierda, en el mismo sentido horizontal) */}
                {(() => {
                  const c4 = ESPADEL_COURTS.find(c => c.number === 4)!;
                  return (
                    <AerialCourtCanvas
                      court={c4}
                      match={getMatchForCourtAtSlot(4)}
                      selectedTime={selectedTimeSlot}
                      selectedDate={selectedDate}
                      currentUser={currentUser}
                      isSelected={selectedCourtNumber === 4}
                      onSelect={() => setSelectedCourtNumber(4)}
                      onJoinSlot={(pos) => {
                        const m = getMatchForCourtAtSlot(4);
                        if (m) onJoinMatchSlot(m.id, pos);
                        else setBookingModalCourt(c4);
                      }}
                      onLeaveSlot={(pos) => {
                        const m = getMatchForCourtAtSlot(4);
                        if (m) onLeaveMatchSlot(m.id, pos);
                      }}
                      onOpenBookingModal={() => setBookingModalCourt(c4)}
                    />
                  );
                })()}

                {/* Pista 3 (abajo a la izquierda, en la misma dirección) */}
                {(() => {
                  const c3 = ESPADEL_COURTS.find(c => c.number === 3)!;
                  return (
                    <AerialCourtCanvas
                      court={c3}
                      match={getMatchForCourtAtSlot(3)}
                      selectedTime={selectedTimeSlot}
                      selectedDate={selectedDate}
                      currentUser={currentUser}
                      isSelected={selectedCourtNumber === 3}
                      onSelect={() => setSelectedCourtNumber(3)}
                      onJoinSlot={(pos) => {
                        const m = getMatchForCourtAtSlot(3);
                        if (m) onJoinMatchSlot(m.id, pos);
                        else setBookingModalCourt(c3);
                      }}
                      onLeaveSlot={(pos) => {
                        const m = getMatchForCourtAtSlot(3);
                        if (m) onLeaveMatchSlot(m.id, pos);
                      }}
                      onOpenBookingModal={() => setBookingModalCourt(c3)}
                    />
                  );
                })()}
              </div>

              {/* Columna Derecha: Pista 6 (arriba) y Pista 5 (en el medio a la derecha) */}
              <div className="space-y-4">
                {/* Pista 6 (arriba a la derecha, en la misma dirección) */}
                {(() => {
                  const c6 = ESPADEL_COURTS.find(c => c.number === 6)!;
                  return (
                    <AerialCourtCanvas
                      court={c6}
                      match={getMatchForCourtAtSlot(6)}
                      selectedTime={selectedTimeSlot}
                      selectedDate={selectedDate}
                      currentUser={currentUser}
                      isSelected={selectedCourtNumber === 6}
                      onSelect={() => setSelectedCourtNumber(6)}
                      onJoinSlot={(pos) => {
                        const m = getMatchForCourtAtSlot(6);
                        if (m) onJoinMatchSlot(m.id, pos);
                        else setBookingModalCourt(c6);
                      }}
                      onLeaveSlot={(pos) => {
                        const m = getMatchForCourtAtSlot(6);
                        if (m) onLeaveMatchSlot(m.id, pos);
                      }}
                      onOpenBookingModal={() => setBookingModalCourt(c6)}
                    />
                  );
                })()}

                {/* Pista 5 (en el medio a la derecha, en la misma dirección) */}
                {(() => {
                  const c5 = ESPADEL_COURTS.find(c => c.number === 5)!;
                  return (
                    <AerialCourtCanvas
                      court={c5}
                      match={getMatchForCourtAtSlot(5)}
                      selectedTime={selectedTimeSlot}
                      selectedDate={selectedDate}
                      currentUser={currentUser}
                      isSelected={selectedCourtNumber === 5}
                      onSelect={() => setSelectedCourtNumber(5)}
                      onJoinSlot={(pos) => {
                        const m = getMatchForCourtAtSlot(5);
                        if (m) onJoinMatchSlot(m.id, pos);
                        else setBookingModalCourt(c5);
                      }}
                      onLeaveSlot={(pos) => {
                        const m = getMatchForCourtAtSlot(5);
                        if (m) onLeaveMatchSlot(m.id, pos);
                      }}
                      onOpenBookingModal={() => setBookingModalCourt(c5)}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SELECTED COURT BOTTOM ACTION BAR */}
      {selectedCourt && (
        <div className="bg-zinc-950 border-2 border-yellow-400 rounded-3xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-yellow-400/20">
                {selectedCourt.number}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{selectedCourt.name}</h3>
                  <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                    {selectedCourt.surface}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                  <span>{selectedCourt.nave}</span>
                  <span>•</span>
                  <span>Horario: <strong className="text-yellow-400">{selectedTimeSlot}</strong> ({selectedDate})</span>
                  <span>•</span>
                  <span className="text-white font-mono font-bold">{selectedCourt.priceHour}€/hora</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedMatch ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-zinc-300 font-mono font-bold">
                      {selectedMatch.slots.filter(s => !!s.player).length}/4 Jugadores
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      Nivel {selectedMatch.minLevel.toFixed(1)} - {selectedMatch.maxLevel.toFixed(1)}
                    </div>
                  </div>

                  {selectedMatch.slots.some(s => s.player?.id === currentUser.id) ? (
                    <div className="px-4 py-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Ya estás en esta pista
                    </div>
                  ) : selectedMatch.slots.some(s => !s.player) ? (
                    <button
                      onClick={() => {
                        const targetSide = currentUser.sidePreference;
                        let emptySlot = selectedMatch.slots.find(s => {
                          if (s.player) return false;
                          const posSide = (s.position === 1 || s.position === 3) ? 'Revés' : 'Drive';
                          return targetSide === 'Indiferente' || posSide === targetSide;
                        });
                        if (!emptySlot) emptySlot = selectedMatch.slots.find(s => !s.player);
                        if (emptySlot) onJoinMatchSlot(selectedMatch.id, emptySlot.position);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs shadow-lg shadow-yellow-400/20 transition flex items-center gap-1.5"
                    >
                      <UserPlus className="w-4 h-4" /> 
                      Apuntarme en {currentUser.sidePreference === 'Revés' ? 'Revés (Izquierda)' : 'Derecha (Drive)'} • {selectedMatch.pricePerPlayer}€
                    </button>
                  ) : (
                    <div className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold">
                      Pista Completa
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBookingModalCourt(selectedCourt)}
                    className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs shadow-lg shadow-yellow-400/20 transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Reservar o Abrir Partido
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedCourtNumber(null)}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL RÁPIDO PARA RESERVAR PISTA LIBRE O ABRIR PARTIDO */}
      {bookingModalCourt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-950 border-2 border-yellow-400/60 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setBookingModalCourt(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Pista Disponible
                </span>
              </div>
              <h3 className="text-xl font-black text-white">
                Reservar {bookingModalCourt.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Franja: <strong className="text-yellow-400">{selectedTimeSlot}</strong> ({durationMinutes} min) • {selectedDate}
              </p>
            </div>

            {/* Selection between Open Match vs Private Booking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Option A: Abrir Partido Abierto */}
              <button
                onClick={() => handleConfirmCourtBooking(false)}
                className="group p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-yellow-400 transition text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center mb-3 group-hover:bg-yellow-400 group-hover:text-black transition">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-yellow-400 transition">
                    Abrir Partido
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Te apuntas tú en tu posición ({currentUser.sidePreference}) y dejas <strong>3 huecos abiertos</strong> para que otros socios del club se sumen por nivel.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-yellow-400">
                    Solo pagas tu parte (~{Math.round(bookingModalCourt.priceHour * (durationMinutes / 60) / 4)}€)
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition" />
                </div>
              </button>

              {/* Option B: Reserva Privada Completa */}
              <button
                onClick={() => handleConfirmCourtBooking(true)}
                className="group p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-400 transition text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:bg-emerald-400 group-hover:text-black transition">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                    Reserva Privada
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Reserva la pista completa para tu grupo de 4 amigos. Nadie más podrá unirse desde la app.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Total: {durationMinutes === 90 ? Math.round(bookingModalCourt.priceHour * 1.5) : bookingModalCourt.priceHour}€
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- AERIAL COURT CANVAS (Individual court rendered in blue with player circles) --- */

interface AerialCourtCanvasProps {
  court: AerialCourt;
  match?: OpenMatch;
  selectedTime: string;
  selectedDate: string;
  currentUser: Player;
  isSelected: boolean;
  onSelect: () => void;
  onJoinSlot: (position: 1 | 2 | 3 | 4) => void;
  onLeaveSlot: (position: 1 | 2 | 3 | 4) => void;
  onOpenBookingModal: () => void;
}

const AerialCourtCanvas: React.FC<AerialCourtCanvasProps> = ({
  court,
  match,
  selectedTime,
  selectedDate,
  currentUser,
  isSelected,
  onSelect,
  onJoinSlot,
  onLeaveSlot,
  onOpenBookingModal,
}) => {
  // Extract slots: 1 (Team A Revés), 2 (Team A Drive), 3 (Team B Revés), 4 (Team B Drive)
  const slot1 = match?.slots.find(s => s.position === 1); // Team A Revés (Left)
  const slot2 = match?.slots.find(s => s.position === 2); // Team A Drive (Right)
  const slot3 = match?.slots.find(s => s.position === 3); // Team B Revés (Left)
  const slot4 = match?.slots.find(s => s.position === 4); // Team B Drive (Right)

  const openSpotsCount = match ? match.slots.filter(s => !s.player).length : 4;
  const isFullyBooked = match && openSpotsCount === 0;

  const isVertical = court.orientation === 'vertical';

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-3xl p-3.5 transition-all cursor-pointer ${
        isSelected
          ? 'bg-zinc-900 border-2 border-yellow-400 shadow-xl shadow-yellow-400/10'
          : 'bg-zinc-900/40 border border-zinc-800 hover:border-yellow-400/40 hover:bg-zinc-900/70'
      }`}
    >
      {/* Court Header: Number & Name */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black text-xs shadow-sm">
            {court.number}
          </div>
          <span className="font-bold text-xs text-white truncate">{court.name}</span>
          {isVertical && (
            <span className="text-[9px] font-mono uppercase bg-yellow-400/15 text-yellow-400 px-1.5 py-0.2 rounded border border-yellow-400/30">
              Vertical
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-1.5">
          {match ? (
            openSpotsCount > 0 ? (
              <span className="text-[10px] font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
                {openSpotsCount} {openSpotsCount === 1 ? 'hueco libre' : 'huecos libres'}
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-700">
                Pista Llena (4/4)
              </span>
            )
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenBookingModal();
              }}
              className="text-[10px] font-mono font-bold text-emerald-400 hover:text-black hover:bg-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/30 transition flex items-center gap-1"
            >
              <span>Libre</span>
              <span>• Reservar</span>
            </button>
          )}
        </div>
      </div>

      {/* AERIAL BLUEPRINT (Azul reglamentario WPT) */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border-2 border-sky-400/40 shadow-inner flex flex-col justify-center items-center ${
          isVertical ? 'aspect-[1/1.55] max-h-[340px]' : 'aspect-[2.2/1] min-h-[145px]'
        }`}
        style={{
          backgroundColor: '#1d4ed8', // Official Royal Court Blue
          backgroundImage: 'radial-gradient(ellipse at center, #2563eb 0%, #1e40af 100%)'
        }}
      >
        {/* Court Service Lines (White lines) */}
        {/* Outer Court Border Line */}
        <div className="absolute inset-2 border border-white/60 pointer-events-none" />

        {!isVertical ? (
          /* HORIZONTAL COURT LAYOUT (Lines & Net) */
          <>
            {/* Center Net Line (Vertical) */}
            <div className="absolute top-2 bottom-2 left-1/2 w-1 -translate-x-1/2 bg-white/90 shadow-md flex items-center justify-center pointer-events-none z-10">
              <span className="text-[8px] font-black uppercase text-zinc-900 bg-white px-0.5 py-0.5 rounded -rotate-90">
                RED
              </span>
            </div>

            {/* Service Lines Team A (Left Half) */}
            <div className="absolute top-2 bottom-2 left-[30%] w-px bg-white/40 pointer-events-none" />
            <div className="absolute left-[30%] right-1/2 top-1/2 h-px bg-white/40 pointer-events-none" />

            {/* Service Lines Team B (Right Half) */}
            <div className="absolute top-2 bottom-2 right-[30%] w-px bg-white/40 pointer-events-none" />
            <div className="absolute left-1/2 right-[30%] top-1/2 h-px bg-white/40 pointer-events-none" />

            {/* PLAYER CIRCLES PLACEMENT (HORIZONTAL):
                A la misma altura, a fondo de pista en la mitad:
                - Campo A: Columna en la mitad del fondo izquierdo (Revés arriba, Drive abajo)
                - Campo B: Columna en la mitad del fondo derecho (Drive arriba, Revés abajo)
            */}
            <div className="absolute inset-2 z-20 pointer-events-auto">
              {/* Fondo Campo A (Izquierda): Ambos a la misma altura X en la mitad del fondo */}
              <div className="absolute top-2 bottom-2 left-1 w-[26%] flex flex-col justify-around items-center">
                <PlayerCircle
                  position={1}
                  side="Revés"
                  slot={slot1}
                  currentUser={currentUser}
                  onJoin={() => onJoinSlot(1)}
                  onLeave={() => onLeaveSlot(1)}
                />
                <PlayerCircle
                  position={2}
                  side="Drive"
                  slot={slot2}
                  currentUser={currentUser}
                  onJoin={() => onJoinSlot(2)}
                  onLeave={() => onLeaveSlot(2)}
                />
              </div>

              {/* Fondo Campo B (Derecha): Ambos a la misma altura X en la mitad del fondo */}
              <div className="absolute top-2 bottom-2 right-1 w-[26%] flex flex-col justify-around items-center">
                <PlayerCircle
                  position={4}
                  side="Drive"
                  slot={slot4}
                  currentUser={currentUser}
                  onJoin={() => onJoinSlot(4)}
                  onLeave={() => onLeaveSlot(4)}
                />
                <PlayerCircle
                  position={3}
                  side="Revés"
                  slot={slot3}
                  currentUser={currentUser}
                  onJoin={() => onJoinSlot(3)}
                  onLeave={() => onLeaveSlot(3)}
                />
              </div>
            </div>
          </>
        ) : (
          /* VERTICAL COURT LAYOUT (PISTA 4 EN VERTICAL):
              A la misma altura, a fondo de pista en la mitad:
              - Campo Superior: Fila en la mitad del fondo superior (Drive izquierda, Revés derecha)
              - Campo Inferior: Fila en la mitad del fondo inferior (Revés izquierda, Drive derecha)
          */
          <>
            {/* Center Net Line (Horizontal) */}
            <div className="absolute left-2 right-2 top-1/2 h-1 -translate-y-1/2 bg-white/90 shadow-md flex items-center justify-center pointer-events-none z-10">
              <span className="text-[8px] font-black uppercase text-zinc-900 bg-white px-1 py-0.2 rounded">
                RED
              </span>
            </div>

            {/* Service Lines Team A (Top Half) */}
            <div className="absolute left-2 right-2 top-[30%] h-px bg-white/40 pointer-events-none" />
            <div className="absolute top-[30%] bottom-1/2 left-1/2 w-px bg-white/40 pointer-events-none" />

            {/* Service Lines Team B (Bottom Half) */}
            <div className="absolute left-2 right-2 bottom-[30%] h-px bg-white/40 pointer-events-none" />
            <div className="absolute top-1/2 bottom-[30%] left-1/2 w-px bg-white/40 pointer-events-none" />

            {/* PLAYER CIRCLES PLACEMENT (VERTICAL):
                Ambos jugadores a la MISMA ALTURA Y en la mitad de su zona de fondo:
                - Campo Superior (Team A): Fila en la mitad del fondo superior
                - Campo Inferior (Team B): Fila en la mitad del fondo inferior
            */}
            <div className="absolute inset-2 z-20 pointer-events-auto">
              {/* Fondo Superior (Team A): Ambos a la misma altura Y (Drive a la izquierda, Revés a la derecha desde perspectiva de fondo) */}
              <div className="absolute left-2 right-2 top-1 h-[26%] flex flex-row justify-around items-center">
                <PlayerCircle
                  position={2}
                  side="Drive"
                  slot={slot2}
                  currentUser={currentUser}
                  onJoin={() => onJoinSlot(2)}
                  onLeave={() => onLeaveSlot(2)}
                />
                <PlayerCircle
                  position={1}
                  side="Revés"
                  slot={slot1}
                  currentUser={currentUser}
                  onJoin={() => onJoinSlot(1)}
                  onLeave={() => onLeaveSlot(1)}
                />
              </div>

              {/* Fondo Inferior (Team B): Ambos a la misma altura Y */}
              <div className="absolute left-2 right-2 bottom-1 h-[26%] flex flex-row justify-around items-center">
                <PlayerCircle
                  position={3}
                  side="Revés"
                  slot={slot3}
                  currentUser={currentUser}
                  onJoin={() => onJoinSlot(3)}
                  onLeave={() => onLeaveSlot(3)}
                />
                <PlayerCircle
                  position={4}
                  side="Drive"
                  slot={slot4}
                  currentUser={currentUser}
                  onJoin={() => onJoinSlot(4)}
                  onLeave={() => onLeaveSlot(4)}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Court Bottom Footer with Match Info / Action */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] px-1">
        {match ? (
          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-400">Nivel {match.minLevel.toFixed(1)} - {match.maxLevel.toFixed(1)}</span>
            <span className="text-zinc-600">•</span>
            <span className="font-mono text-yellow-400 font-bold">{match.pricePerPlayer}€/jugador</span>
          </div>
        ) : (
          <div className="text-emerald-400 font-mono flex items-center gap-1">
            <Unlock className="w-3 h-3" /> Pista Disponible a las {selectedTime}
          </div>
        )}

        <div className="text-zinc-400 font-mono text-[10px]">
          {court.nave.split(' ')[0]} {court.nave.split(' ')[1]}
        </div>
      </div>
    </div>
  );
};

/* --- CIRCULITO DEL JUGADOR O HUECO ABIERTO --- */

interface PlayerCircleProps {
  position: 1 | 2 | 3 | 4;
  side: 'Revés' | 'Drive';
  slot?: MatchSlot;
  currentUser: Player;
  onJoin: () => void;
  onLeave: () => void;
}

const PlayerCircle: React.FC<PlayerCircleProps> = ({
  position,
  side,
  slot,
  currentUser,
  onJoin,
  onLeave,
}) => {
  const isOccupied = !!slot?.player;
  const isMe = slot?.player?.id === currentUser.id;

  if (isOccupied && slot?.player) {
    const player = slot.player;
    return (
      <div className="group relative flex flex-col items-center">
        {/* Occupied Player Circle */}
        <div
          className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-lg transition-transform group-hover:scale-110 flex items-center justify-center ${
            isMe
              ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-blue-900 shadow-yellow-400/50'
              : 'ring-2 ring-white ring-offset-1 ring-offset-blue-900'
          }`}
        >
          <img
            src={player.avatar}
            alt={player.name}
            className="w-full h-full object-cover"
          />

          {/* Level mini badge */}
          <div className="absolute -bottom-0.5 right-0 bg-black/90 text-yellow-400 font-black text-[8px] font-mono px-1 rounded-full border border-yellow-400/40">
            {player.level.toFixed(1)}
          </div>
        </div>

        {/* Name and Side Tag Below Circle */}
        <div className="mt-0.5 flex flex-col items-center">
          <span className="text-[9px] font-bold text-white max-w-[65px] truncate drop-shadow-md">
            {isMe ? 'Tú' : player.name.split(' ')[0]}
          </span>
          <span className="text-[7px] font-mono uppercase text-yellow-300 font-bold drop-shadow">
            {side} ({side === 'Revés' ? 'Izq' : 'Der'})
          </span>
        </div>

        {/* Leave tooltip if it's me */}
        {isMe && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLeave();
            }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-[10px] shadow"
            title="Salirme del partido"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  // EMPTY / OPEN SPOT ("HUECO ABIERTO")
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onJoin();
      }}
      className="group relative flex flex-col items-center cursor-pointer"
    >
      {/* Dashed Animated Circle */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-yellow-300 bg-yellow-400/25 hover:bg-yellow-400/45 group-hover:border-yellow-400 flex items-center justify-center shadow-lg transition-all group-hover:scale-110 animate-pulse">
        <Plus className="w-4 h-4 text-yellow-300 group-hover:text-black group-hover:scale-125 transition" strokeWidth={3} />
      </div>

      {/* Side Label */}
      <div className="mt-0.5 flex flex-col items-center">
        <span className="text-[8px] font-mono font-bold text-yellow-300 group-hover:text-white uppercase drop-shadow">
          {side}
        </span>
        <span className="text-[7px] font-mono text-zinc-300">
          {side === 'Revés' ? 'Izquierda' : 'Derecha'}
        </span>
      </div>
    </div>
  );
};
