'use client';

import React, { useState } from 'react';
import { OpenMatch, Player, MatchSlot } from '../types';
import { ESPADEL_COURTS, AerialCourt } from '../data/courts';
import { LevelBadge } from './LevelBadge';
import { Users, Plus, CheckCircle, ShieldCheck, MapPin, Sparkles, Clock, AlertCircle, X, ChevronRight, UserPlus } from 'lucide-react';

interface AerialClubCourtsViewProps {
  matches: OpenMatch[];
  currentUser: Player;
  onJoinMatchSlot: (matchId: string, position: 1 | 2 | 3 | 4) => void;
  onLeaveMatchSlot: (matchId: string, position: 1 | 2 | 3 | 4) => void;
  onOpenCreateMatchWithCourtNumber: (courtNumber: number) => void;
}

export const AerialClubCourtsView: React.FC<AerialClubCourtsViewProps> = ({
  matches,
  currentUser,
  onJoinMatchSlot,
  onLeaveMatchSlot,
  onOpenCreateMatchWithCourtNumber,
}) => {
  const [selectedCourtNumber, setSelectedCourtNumber] = useState<number | null>(null);

  // Group courts by Nave
  const naveACourts = ESPADEL_COURTS.filter(c => c.naveId === 'nave-a'); // 1 and 2
  const naveBCourts = ESPADEL_COURTS.filter(c => c.naveId === 'nave-b'); // 3, 4, 5, 6

  // Helper to get active match for a court
  const getMatchForCourt = (courtNumber: number) => {
    return matches.find(m => m.courtName.includes(`Pista ${courtNumber}`));
  };

  const selectedCourt = ESPADEL_COURTS.find(c => c.number === selectedCourtNumber);
  const selectedMatch = selectedCourtNumber ? getMatchForCourt(selectedCourtNumber) : null;

  return (
    <div className="space-y-6">
      {/* Header and Legend */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black text-xs">
                ⚡
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-yellow-400 font-bold">
                Plano Cenital Oficial • Espadel Club
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Visión Aérea de Pistas (Nave A y Nave B)
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Selecciona cualquier pista interactiva para apuntarte. Si juegas de <strong>Revés</strong>, tu circulito se colocará en la <strong>izquierda</strong> de la pista; si juegas de <strong>Derecha (Drive)</strong>, en la <strong>derecha</strong>.
            </p>
          </div>

          {/* Quick Legend */}
          <div className="flex flex-wrap items-center gap-2.5 bg-black/60 border border-zinc-800 p-3 rounded-2xl text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-yellow-400 bg-yellow-400/20" />
              <span className="text-zinc-300 font-semibold">Tú ({currentUser.sidePreference})</span>
            </div>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white bg-zinc-800" />
              <span className="text-zinc-400">Socio Apuntado</span>
            </div>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border border-dashed border-yellow-400/70" />
              <span className="text-yellow-400 font-medium">Plaza Libre</span>
            </div>
          </div>
        </div>
      </div>

      {/* AERIAL BLUEPRINT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* NAVE A: 2 PISTAS (Pistas 1 y 2 - Horizontales) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-xl border border-yellow-400/20">
                NAVE 1 (SALA PRINCIPAL)
              </span>
              <span className="text-xs text-zinc-400">2 Pistas Horizontales</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-4 sm:p-5 shadow-xl space-y-5">
            {naveACourts.map(court => (
              <AerialCourtCanvas
                key={court.id}
                court={court}
                match={getMatchForCourt(court.number)}
                currentUser={currentUser}
                isSelected={selectedCourtNumber === court.number}
                onSelect={() => setSelectedCourtNumber(court.number)}
                onJoinSlot={(pos) => {
                  const m = getMatchForCourt(court.number);
                  if (m) onJoinMatchSlot(m.id, pos);
                  else onOpenCreateMatchWithCourtNumber(court.number);
                }}
                onLeaveSlot={(pos) => {
                  const m = getMatchForCourt(court.number);
                  if (m) onLeaveMatchSlot(m.id, pos);
                }}
              />
            ))}
          </div>
        </div>

        {/* NAVE B: 4 PISTAS (Pistas 3, 4, 5, 6 - Pista 4 Vertical) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-xl border border-yellow-400/20">
                NAVE 2 (SALA ANEXA)
              </span>
              <span className="text-xs text-zinc-400">4 Pistas (Pista 4 Central Vertical)</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-4 sm:p-5 shadow-xl">
            {/* Layout for Nave B: 
                Left Column: Pista 3 (Horiz) & Pista 5 (Horiz)
                Middle Column: Pista 4 (VERTICAL)
                Right Column: Pista 6 (Horiz) 
            */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* Horizontal Column Left (Pista 3 & Pista 5) */}
              <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
                <AerialCourtCanvas
                  court={naveBCourts[0]} // Pista 3
                  match={getMatchForCourt(3)}
                  currentUser={currentUser}
                  isSelected={selectedCourtNumber === 3}
                  onSelect={() => setSelectedCourtNumber(3)}
                  onJoinSlot={(pos) => {
                    const m = getMatchForCourt(3);
                    if (m) onJoinMatchSlot(m.id, pos);
                    else onOpenCreateMatchWithCourtNumber(3);
                  }}
                  onLeaveSlot={(pos) => {
                    const m = getMatchForCourt(3);
                    if (m) onLeaveMatchSlot(m.id, pos);
                  }}
                />

                <AerialCourtCanvas
                  court={naveBCourts[2]} // Pista 5
                  match={getMatchForCourt(5)}
                  currentUser={currentUser}
                  isSelected={selectedCourtNumber === 5}
                  onSelect={() => setSelectedCourtNumber(5)}
                  onJoinSlot={(pos) => {
                    const m = getMatchForCourt(5);
                    if (m) onJoinMatchSlot(m.id, pos);
                    else onOpenCreateMatchWithCourtNumber(5);
                  }}
                  onLeaveSlot={(pos) => {
                    const m = getMatchForCourt(5);
                    if (m) onLeaveMatchSlot(m.id, pos);
                  }}
                />
              </div>

              {/* Center Column: PISTA 4 (VERTICAL ESPECÍFICA) */}
              <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
                <AerialCourtCanvas
                  court={naveBCourts[1]} // Pista 4 (Vertical)
                  match={getMatchForCourt(4)}
                  currentUser={currentUser}
                  isSelected={selectedCourtNumber === 4}
                  onSelect={() => setSelectedCourtNumber(4)}
                  onJoinSlot={(pos) => {
                    const m = getMatchForCourt(4);
                    if (m) onJoinMatchSlot(m.id, pos);
                    else onOpenCreateMatchWithCourtNumber(4);
                  }}
                  onLeaveSlot={(pos) => {
                    const m = getMatchForCourt(4);
                    if (m) onLeaveMatchSlot(m.id, pos);
                  }}
                />

                <AerialCourtCanvas
                  court={naveBCourts[3]} // Pista 6 (Horizontal)
                  match={getMatchForCourt(6)}
                  currentUser={currentUser}
                  isSelected={selectedCourtNumber === 6}
                  onSelect={() => setSelectedCourtNumber(6)}
                  onJoinSlot={(pos) => {
                    const m = getMatchForCourt(6);
                    if (m) onJoinMatchSlot(m.id, pos);
                    else onOpenCreateMatchWithCourtNumber(6);
                  }}
                  onLeaveSlot={(pos) => {
                    const m = getMatchForCourt(6);
                    if (m) onLeaveMatchSlot(m.id, pos);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Court Detail Bottom Card / Action Drawer */}
      {selectedCourt && (
        <div className="bg-zinc-950 border-2 border-yellow-400/40 rounded-3xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                  <span>{selectedCourt.orientation === 'vertical' ? 'Disposición Vertical' : 'Disposición Horizontal'}</span>
                  <span>•</span>
                  <span className="text-yellow-400 font-bold font-mono">{selectedCourt.priceHour}€/h</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedMatch ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-zinc-300 font-mono font-bold">
                      {selectedMatch.slots.filter(s => !!s.player).length}/4 Jugadores
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      Nivel {selectedMatch.minLevel.toFixed(1)} - {selectedMatch.maxLevel.toFixed(1)}
                    </div>
                  </div>

                  {selectedMatch.slots.some(s => s.player?.id === currentUser.id) ? (
                    <div className="px-4 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Estás apuntado en esta pista
                    </div>
                  ) : selectedMatch.slots.some(s => !s.player) ? (
                    <button
                      onClick={() => {
                        // Join matching position based on user preference
                        const targetSide = currentUser.sidePreference;
                        // Find empty slot matching preference if possible
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
                      <UserPlus className="w-4 h-4" /> Apuntarme en {currentUser.sidePreference === 'Revés' ? 'Revés (Izquierda)' : 'Derecha (Drive)'}
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-semibold">
                      Pista Completa
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onOpenCreateMatchWithCourtNumber(selectedCourt.number)}
                  className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs shadow-lg shadow-yellow-400/20 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Abrir Partido en Pista {selectedCourt.number}
                </button>
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
    </div>
  );
};

/* --- AERIAL COURT CANVAS (Individual court rendered in blue with player circles) --- */

interface AerialCourtCanvasProps {
  court: AerialCourt;
  match?: OpenMatch;
  currentUser: Player;
  isSelected: boolean;
  onSelect: () => void;
  onJoinSlot: (position: 1 | 2 | 3 | 4) => void;
  onLeaveSlot: (position: 1 | 2 | 3 | 4) => void;
}

const AerialCourtCanvas: React.FC<AerialCourtCanvasProps> = ({
  court,
  match,
  currentUser,
  isSelected,
  onSelect,
  onJoinSlot,
  onLeaveSlot,
}) => {
  const isVertical = court.orientation === 'vertical';

  // Extract slots: 1 (Team A Revés), 2 (Team A Drive), 3 (Team B Revés), 4 (Team B Drive)
  const slot1 = match?.slots.find(s => s.position === 1); // Team A Revés (Left)
  const slot2 = match?.slots.find(s => s.position === 2); // Team A Drive (Right)
  const slot3 = match?.slots.find(s => s.position === 3); // Team B Revés (Left)
  const slot4 = match?.slots.find(s => s.position === 4); // Team B Drive (Right)

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
        </div>

        <div className="flex items-center gap-1.5">
          {match ? (
            <span className="text-[10px] font-mono font-bold text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-700">
              {match.slots.filter(s => !!s.player).length}/4
            </span>
          ) : (
            <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
              Libre
            </span>
          )}
        </div>
      </div>

      {/* AERIAL BLUEPRINT (Azul reglamentario WPT) */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border-2 border-sky-400/40 shadow-inner flex flex-col justify-center items-center ${
          isVertical ? 'aspect-[1/1.6] max-h-96' : 'aspect-[2.2/1] min-h-[140px]'
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
            <div className="absolute top-2 bottom-2 left-[28%] w-px bg-white/40 pointer-events-none" />
            <div className="absolute left-2 right-[72%] top-1/2 h-px bg-white/40 pointer-events-none" />

            {/* Service Lines Team B (Right Half) */}
            <div className="absolute top-2 bottom-2 right-[28%] w-px bg-white/40 pointer-events-none" />
            <div className="absolute left-[72%] right-2 top-1/2 h-px bg-white/40 pointer-events-none" />

            {/* PLAYER CIRCLES PLACEMENT (HORIZ):
                Team A (Left side of court):
                  - Upper/Left spot = Revés (Lado izquierdo)
                  - Lower/Right spot = Derecha (Lado derecho)
                Team B (Right side of court):
                  - Upper spot = Derecha
                  - Lower spot = Revés
                To strictly follow user's rule:
                "Si eres derecha, que salga el circulito en la derecha de la pista y si eres revés, en la izquierda de la pista":
                Left side of each quadrant = Revés (Izquierda)
                Right side of each quadrant = Derecha (Derecha)
            */}
            <div className="absolute inset-2 grid grid-cols-2 z-20 pointer-events-auto">
              {/* Team A Half (Left half of court) */}
              <div className="grid grid-rows-2 p-2">
                {/* Spot 1: Revés (Arriba / Izquierda) */}
                <div className="flex items-start justify-start">
                  <PlayerCircle
                    position={1}
                    side="Revés"
                    slot={slot1}
                    currentUser={currentUser}
                    onJoin={() => onJoinSlot(1)}
                    onLeave={() => onLeaveSlot(1)}
                  />
                </div>
                {/* Spot 2: Derecha / Drive (Abajo / Derecha) */}
                <div className="flex items-end justify-end pr-3">
                  <PlayerCircle
                    position={2}
                    side="Drive"
                    slot={slot2}
                    currentUser={currentUser}
                    onJoin={() => onJoinSlot(2)}
                    onLeave={() => onLeaveSlot(2)}
                  />
                </div>
              </div>

              {/* Team B Half (Right half of court) */}
              <div className="grid grid-rows-2 p-2">
                {/* Spot 4: Derecha / Drive (Arriba / Derecha) */}
                <div className="flex items-start justify-end">
                  <PlayerCircle
                    position={4}
                    side="Drive"
                    slot={slot4}
                    currentUser={currentUser}
                    onJoin={() => onJoinSlot(4)}
                    onLeave={() => onLeaveSlot(4)}
                  />
                </div>
                {/* Spot 3: Revés (Abajo / Izquierda) */}
                <div className="flex items-end justify-start pl-3">
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
            </div>
          </>
        ) : (
          /* VERTICAL COURT LAYOUT (Pista 4 - Lines & Net) */
          <>
            {/* Center Net Line (Horizontal) */}
            <div className="absolute left-2 right-2 top-1/2 h-1 -translate-y-1/2 bg-white/90 shadow-md flex items-center justify-center pointer-events-none z-10">
              <span className="text-[8px] font-black uppercase text-zinc-900 bg-white px-1 py-0.2 rounded">
                RED
              </span>
            </div>

            {/* Service Lines Team A (Top Half) */}
            <div className="absolute left-2 right-2 top-[30%] h-px bg-white/40 pointer-events-none" />
            <div className="absolute top-2 bottom-[70%] left-1/2 w-px bg-white/40 pointer-events-none" />

            {/* Service Lines Team B (Bottom Half) */}
            <div className="absolute left-2 right-2 bottom-[30%] h-px bg-white/40 pointer-events-none" />
            <div className="absolute top-[70%] bottom-2 left-1/2 w-px bg-white/40 pointer-events-none" />

            {/* PLAYER CIRCLES PLACEMENT (VERTICAL):
                Left side of court = Revés
                Right side of court = Derecha (Drive)
            */}
            <div className="absolute inset-2 grid grid-rows-2 z-20 pointer-events-auto">
              {/* Team A (Top Half) */}
              <div className="grid grid-cols-2 p-2 items-center">
                {/* Left: Revés */}
                <div className="flex justify-start">
                  <PlayerCircle
                    position={1}
                    side="Revés"
                    slot={slot1}
                    currentUser={currentUser}
                    onJoin={() => onJoinSlot(1)}
                    onLeave={() => onLeaveSlot(1)}
                  />
                </div>
                {/* Right: Derecha */}
                <div className="flex justify-end">
                  <PlayerCircle
                    position={2}
                    side="Drive"
                    slot={slot2}
                    currentUser={currentUser}
                    onJoin={() => onJoinSlot(2)}
                    onLeave={() => onLeaveSlot(2)}
                  />
                </div>
              </div>

              {/* Team B (Bottom Half) */}
              <div className="grid grid-cols-2 p-2 items-center">
                {/* Left: Revés */}
                <div className="flex justify-start">
                  <PlayerCircle
                    position={3}
                    side="Revés"
                    slot={slot3}
                    currentUser={currentUser}
                    onJoin={() => onJoinSlot(3)}
                    onLeave={() => onLeaveSlot(3)}
                  />
                </div>
                {/* Right: Derecha */}
                <div className="flex justify-end">
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
            </div>
          </>
        )}

        {/* Small corner court glass badges */}
        <div className="absolute bottom-1 right-2 text-[9px] font-mono text-white/50 font-semibold pointer-events-none">
          {court.surface.replace(' Oficial', '')}
        </div>
      </div>
    </div>
  );
};

/* --- PLAYER CIRCLE ON AERIAL COURT --- */

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
  const isMe = slot?.player?.id === currentUser.id;

  if (slot?.player) {
    return (
      <div className="relative group/player flex flex-col items-center">
        {/* Avatar Circle */}
        <div
          className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shadow-lg transition-transform hover:scale-110 ${
            isMe
              ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-blue-900 scale-105'
              : 'ring-1 ring-white/80'
          }`}
          title={`${slot.player.name} (${side} · Niv. ${slot.player.level.toFixed(1)})`}
        >
          <img
            src={slot.player.avatar}
            alt={slot.player.name}
            className="w-full h-full object-cover"
          />

          {/* Level Badge in mini dot */}
          <div className="absolute bottom-0 right-0 bg-black/90 text-yellow-400 text-[8px] font-mono font-bold px-1 rounded-tl">
            {slot.player.level.toFixed(1)}
          </div>
        </div>

        {/* Position Label Tag below circle */}
        <span
          className={`text-[8px] font-mono uppercase tracking-tighter px-1 py-0.2 rounded mt-0.5 font-bold shadow ${
            isMe
              ? 'bg-yellow-400 text-black'
              : 'bg-black/80 text-white border border-white/20'
          }`}
        >
          {side === 'Revés' ? 'REVÉS' : 'DRIVE'}
        </span>

        {/* Hover Leave Action if me */}
        {isMe && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLeave();
            }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover/player:opacity-100 transition shadow"
            title="Liberar mi plaza"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  // EMPTY SLOT INTERACTIVE CIRCLE
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onJoin();
      }}
      className="flex flex-col items-center group/slot transition-transform hover:scale-110"
      title={`Apuntarme en ${side === 'Revés' ? 'Revés (Izquierda)' : 'Derecha (Drive)'}`}
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-dashed border-white/70 hover:border-yellow-400 bg-black/30 hover:bg-yellow-400/20 backdrop-blur-sm flex items-center justify-center text-white/80 group-hover/slot:text-yellow-400 shadow transition">
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </div>

      <span className="text-[8px] font-mono uppercase tracking-tighter px-1 py-0.2 rounded mt-0.5 font-semibold bg-black/60 text-white/70 group-hover/slot:bg-yellow-400 group-hover/slot:text-black transition">
        {side === 'Revés' ? 'REVÉS (IZQ)' : 'DERECHA'}
      </span>
    </button>
  );
};
