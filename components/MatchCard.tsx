'use client';

import React from 'react';
import { OpenMatch, Player } from '../types';
import { LevelBadge } from './LevelBadge';
import { Clock, MapPin, Users, Euro, CheckCircle, UserPlus, AlertCircle } from 'lucide-react';

interface MatchCardProps {
  match: OpenMatch;
  currentUser: Player;
  onJoinSlot: (matchId: string, position: 1 | 2 | 3 | 4) => void;
  onLeaveSlot: (matchId: string, position: 1 | 2 | 3 | 4) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  currentUser,
  onJoinSlot,
  onLeaveSlot,
}) => {
  const occupiedSlots = match.slots.filter(s => s.player !== undefined);
  const occupiedCount = occupiedSlots.length;
  const isUserJoined = match.slots.some(s => s.player?.id === currentUser.id);

  // Check level compatibility
  const isLevelCompatible = currentUser.level >= match.minLevel - 0.2 && currentUser.level <= match.maxLevel + 0.2;

  // Status tag
  let statusBadge = (
    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
      {occupiedCount}/4 Jugadores
    </span>
  );

  if (occupiedCount === 3) {
    statusBadge = (
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
        ¡Falta 1 Plaza!
      </span>
    );
  } else if (occupiedCount === 4) {
    statusBadge = (
      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        Partido Completo
      </span>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-slate-700/80 transition-all duration-200">
      {/* Top Bar: Court & Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {match.courtName}
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {match.courtType}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{match.date}</span>
            <span className="text-slate-500">•</span>
            <span className="text-white font-mono">{match.time}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {statusBadge}
          <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-0.5">
            <Euro className="w-3 h-3 text-emerald-400" />
            <span>{match.pricePerPlayer.toFixed(2)}€</span>
            <span className="text-[10px] text-slate-500 font-normal">/jugador</span>
          </div>
        </div>
      </div>

      {/* Level Range Restriction */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Nivel Permitido:</span>
          <div className="flex items-center gap-1.5">
            <LevelBadge level={match.minLevel} size="sm" showCategory={false} />
            <span className="text-slate-600 font-mono text-xs">a</span>
            <LevelBadge level={match.maxLevel} size="sm" showCategory={false} />
          </div>
        </div>

        {isLevelCompatible ? (
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Nivel Compatible
          </span>
        ) : (
          <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1" title="Tu nivel está fuera del rango ideal">
            <AlertCircle className="w-3.5 h-3.5" /> Desvío de Nivel
          </span>
        )}
      </div>

      {/* Court Representation (4 Slots: Team A vs Team B) */}
      <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-3 mb-4">
        {/* Court Net Line */}
        <div className="absolute left-1/2 top-2 bottom-2 w-0.5 bg-slate-800 -translate-x-1/2 flex flex-col justify-center items-center z-0">
          <span className="text-[9px] uppercase tracking-widest text-slate-600 bg-slate-950 px-1 py-0.5 rotate-90 rounded">
            RED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          {/* Team A */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider px-1">
              PAREJA A
            </div>
            {match.slots.filter(s => s.team === 'A').map(slot => (
              <PlayerSlotCard
                key={slot.position}
                slot={slot}
                currentUser={currentUser}
                onJoin={() => onJoinSlot(match.id, slot.position)}
                onLeave={() => onLeaveSlot(match.id, slot.position)}
              />
            ))}
          </div>

          {/* Team B */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider px-1">
              PAREJA B
            </div>
            {match.slots.filter(s => s.team === 'B').map(slot => (
              <PlayerSlotCard
                key={slot.position}
                slot={slot}
                currentUser={currentUser}
                onJoin={() => onJoinSlot(match.id, slot.position)}
                onLeave={() => onLeaveSlot(match.id, slot.position)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Match Notes / Footer */}
      {match.notes && (
        <p className="text-xs text-slate-400 italic mb-4 px-1">
          "{match.notes}"
        </p>
      )}

      {/* Quick Join CTA if not joined */}
      {isUserJoined ? (
        <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" /> Ya estás apuntado en este partido
        </div>
      ) : occupiedCount < 4 ? (
        <button
          onClick={() => {
            const firstEmpty = match.slots.find(s => !s.player);
            if (firstEmpty) onJoinSlot(match.id, firstEmpty.position);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/15"
        >
          <UserPlus className="w-4 h-4" /> Unirme a este Partido ({match.pricePerPlayer.toFixed(2)}€)
        </button>
      ) : (
        <div className="w-full py-2 px-4 rounded-xl bg-slate-800 text-slate-400 text-xs text-center font-medium">
          Partido Completo (4/4 Jugadores)
        </div>
      )}
    </div>
  );
};

interface PlayerSlotCardProps {
  slot: { position: 1 | 2 | 3 | 4; player?: Player; team: 'A' | 'B' };
  currentUser: Player;
  onJoin: () => void;
  onLeave: () => void;
}

const PlayerSlotCard: React.FC<PlayerSlotCardProps> = ({
  slot,
  currentUser,
  onJoin,
  onLeave,
}) => {
  const isMe = slot.player?.id === currentUser.id;

  if (slot.player) {
    return (
      <div className={`p-2 rounded-xl border flex items-center gap-2.5 transition ${
        isMe
          ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
          : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        <img
          src={slot.player.avatar}
          alt={slot.player.name}
          className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold truncate flex items-center gap-1">
            {slot.player.name}
            {isMe && <span className="text-[10px] text-emerald-400 font-mono">(Tú)</span>}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] font-mono font-bold text-slate-400">
              Niv. {slot.player.level.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-500">• {slot.player.sidePreference}</span>
          </div>
        </div>
        {isMe && (
          <button
            onClick={onLeave}
            className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20"
            title="Dejar mi plaza"
          >
            Salir
          </button>
        )}
      </div>
    );
  }

  // Empty Slot
  return (
    <button
      onClick={onJoin}
      className="w-full p-2.5 rounded-xl border border-dashed border-slate-700/80 hover:border-emerald-500/60 bg-slate-900/40 hover:bg-emerald-500/5 text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-1.5 transition group"
    >
      <UserPlus className="w-3.5 h-3.5 group-hover:scale-110 transition" />
      <span className="text-xs font-medium">+ Plaza Libre</span>
    </button>
  );
};
