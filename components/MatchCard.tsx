'use client';

import React from 'react';
import { OpenMatch, Player } from '../types';
import { LevelBadge } from './LevelBadge';
import { Clock, MapPin, Users, Euro, CheckCircle, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';

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
    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
      {occupiedCount}/4 Jugadores
    </span>
  );

  if (occupiedCount === 3) {
    statusBadge = (
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/50 animate-pulse">
        ¡Falta 1 Plaza!
      </span>
    );
  } else if (occupiedCount === 4) {
    statusBadge = (
      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
        Partido Completo
      </span>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-xl hover:border-yellow-400/40 transition-all duration-200">
      {/* Top Bar: Court & Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {match.courtName}
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              {match.courtType}
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>{match.date}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-white font-mono">{match.time}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {statusBadge}
          <div className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-0.5">
            <Euro className="w-3 h-3 text-yellow-400" />
            <span>{match.pricePerPlayer.toFixed(2)}€</span>
            <span className="text-[10px] text-zinc-500 font-normal">/jugador</span>
          </div>
        </div>
      </div>

      {/* Level Range Restriction */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Nivel Permitido:</span>
          <div className="flex items-center gap-1.5">
            <LevelBadge level={match.minLevel} size="sm" showCategory={false} />
            <span className="text-zinc-500 font-mono text-xs">a</span>
            <LevelBadge level={match.maxLevel} size="sm" showCategory={false} />
          </div>
        </div>

        {isLevelCompatible ? (
          <span className="text-[11px] text-yellow-400 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Nivel Compatible
          </span>
        ) : (
          <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1" title="Tu nivel está fuera del rango ideal">
            <AlertCircle className="w-3.5 h-3.5" /> Desvío de Nivel
          </span>
        )}
      </div>

      {/* Court Representation (4 Slots: Team A vs Team B) */}
      <div className="relative bg-black rounded-2xl border border-zinc-800/80 p-3 mb-4">
        {/* Court Net Line */}
        <div className="absolute left-1/2 top-2 bottom-2 w-0.5 bg-zinc-800 -translate-x-1/2 flex flex-col justify-center items-center z-0">
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 bg-black px-1 py-0.5 rotate-90 rounded">
            RED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          {/* Team A */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-wider px-1">
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
            <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-wider px-1">
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
        <p className="text-xs text-zinc-400 italic mb-4 px-1">
          "{match.notes}"
        </p>
      )}

      {/* Quick Join CTA if not joined */}
      {isUserJoined ? (
        <div className="w-full py-2.5 px-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" /> Ya estás apuntado en este partido
        </div>
      ) : occupiedCount < 4 ? (
        <button
          onClick={() => {
            const firstEmpty = match.slots.find(s => !s.player);
            if (firstEmpty) onJoinSlot(match.id, firstEmpty.position);
          }}
          className="w-full py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-yellow-400/15"
        >
          <UserPlus className="w-4 h-4" /> Unirme a este Partido ({match.pricePerPlayer.toFixed(2)}€)
        </button>
      ) : (
        <div className="w-full py-2 px-4 rounded-xl bg-zinc-900 text-zinc-500 text-xs text-center font-medium">
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
          ? 'bg-yellow-400/10 border-yellow-400/40 text-white'
          : 'bg-zinc-900/90 border-zinc-800 text-zinc-200'
      }`}>
        <img
          src={slot.player.avatar}
          alt={slot.player.name}
          className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold truncate flex items-center gap-1">
            {slot.player.name}
            {isMe && <span className="text-[10px] text-yellow-400 font-mono font-bold">(Tú)</span>}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] font-mono font-bold text-zinc-400">
              Niv. {slot.player.level.toFixed(1)}
            </span>
            <span className="text-[10px] text-zinc-500">• {slot.player.sidePreference}</span>
            {slot.player.levelCertifiedByClub && (
              <span title="Nivel certificado por Spadel Club" className="text-yellow-400 ml-0.5">
                <ShieldCheck className="w-3 h-3 fill-yellow-400/20" />
              </span>
            )}
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
      className="w-full p-2.5 rounded-xl border border-dashed border-zinc-800 hover:border-yellow-400/70 bg-zinc-950 hover:bg-yellow-400/5 text-zinc-500 hover:text-yellow-400 flex items-center justify-center gap-1.5 transition group"
    >
      <UserPlus className="w-3.5 h-3.5 group-hover:scale-110 transition" />
      <span className="text-xs font-semibold">+ Plaza Libre</span>
    </button>
  );
};
