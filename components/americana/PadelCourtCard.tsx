'use client';

import React from 'react';
import { AmericanaMatch, AmericanaPlayer } from '../../types/americana';
import { Trophy, Plus, Minus } from 'lucide-react';

interface PadelCourtCardProps {
  match: AmericanaMatch;
  matchIndex: number;
  onUpdateScore: (matchId: string, scoreA: number, scoreB: number) => void;
  isTimerRunning: boolean;
}

export const PadelCourtCard: React.FC<PadelCourtCardProps> = ({
  match,
  matchIndex,
  onUpdateScore,
  isTimerRunning,
}) => {
  const scoreA = match.scoreA ?? 0;
  const scoreB = match.scoreB ?? 0;

  const renderPlayerBadge = (player: AmericanaPlayer, side: 'reves' | 'derecha', isTeamA: boolean) => {
    const isReves = player.position === 'reves';
    const isDerecha = player.position === 'derecha';

    return (
      <div
        className={`flex flex-col p-2.5 rounded-xl border transition-all ${
          isTeamA
            ? 'bg-slate-900/90 border-blue-500/30 hover:border-blue-500/60 shadow-sm shadow-blue-500/5'
            : 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/60 shadow-sm shadow-emerald-500/5'
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="font-extrabold text-xs text-white truncate max-w-[110px] sm:max-w-[130px]">
            {player.name}
          </span>
          <span
            className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md ${
              isReves
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : isDerecha
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {side === 'reves' ? 'Revés' : 'Derecha'}
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>{player.pointsWon} pts acum.</span>
          {player.position === 'indiferente' && (
            <span className="text-[9px] text-amber-400 font-mono">Poliv.</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-xl transition-all duration-300 hover:border-slate-700 flex flex-col">
      {/* Court Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-black text-white tracking-wide">
            {match.courtName}
          </h3>
        </div>

        {/* Quick Score Counter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-2.5 py-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Juegos:</span>
          <div className="flex items-center gap-1.5 font-mono font-black text-xs text-white">
            <span className="text-blue-400">{scoreA}</span>
            <span className="text-slate-500">-</span>
            <span className="text-emerald-400">{scoreB}</span>
          </div>
        </div>
      </div>

      {/* Realistic Stylized Padel Court graphic */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div className="relative rounded-2xl bg-gradient-to-b from-sky-950/60 via-blue-900/40 to-sky-950/60 border-2 border-slate-700 p-2 sm:p-3 overflow-hidden shadow-inner">
          {/* Glass wall effect top */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400/30 via-white/40 to-cyan-400/30 pointer-events-none" />

          {/* Court lines */}
          <div className="absolute inset-2 border border-white/20 rounded-lg pointer-events-none" />
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-white/40 pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          {/* Service line top */}
          <div className="absolute inset-x-4 top-[28%] h-px bg-white/20 pointer-events-none" />
          {/* Service line bottom */}
          <div className="absolute inset-x-4 bottom-[28%] h-px bg-white/20 pointer-events-none" />
          {/* Center line */}
          <div className="absolute inset-y-4 left-1/2 -translate-x-1/2 w-px bg-white/20 pointer-events-none" />

          {/* TEAM A (Top half of court) */}
          <div className="relative z-10 mb-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Pareja A
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateScore(match.id, Math.max(0, scoreA - 1), scoreB)}
                  className="w-5 h-5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                  title="Restar juego a Pareja A"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-mono font-bold text-xs text-blue-300">{scoreA}</span>
                <button
                  type="button"
                  onClick={() => onUpdateScore(match.id, scoreA + 1, scoreB)}
                  className="w-5 h-5 rounded-md bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition shadow-sm"
                  title="Sumar juego a Pareja A"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Revés on Left side of court */}
              {renderPlayerBadge(match.teamA.playerReves, 'reves', true)}
              {/* Derecha on Right side of court */}
              {renderPlayerBadge(match.teamA.playerDerecha, 'derecha', true)}
            </div>
          </div>

          {/* NET / RED CENTRAL */}
          <div className="relative z-10 my-2 flex items-center justify-center">
            <div className="w-full flex items-center gap-2 px-1">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-white/20 text-[9px] font-mono uppercase tracking-widest text-slate-300 shadow">
                RED DE PÁDEL
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>

          {/* TEAM B (Bottom half of court) */}
          <div className="relative z-10 mt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Pareja B
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateScore(match.id, scoreA, Math.max(0, scoreB - 1))}
                  className="w-5 h-5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                  title="Restar juego a Pareja B"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-mono font-bold text-xs text-emerald-300">{scoreB}</span>
                <button
                  type="button"
                  onClick={() => onUpdateScore(match.id, scoreA, scoreB + 1)}
                  className="w-5 h-5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition shadow-sm"
                  title="Sumar juego a Pareja B"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Note: In padel, facing the net, Revés is on player's left side (right from camera) or consistent */}
              {renderPlayerBadge(match.teamB.playerReves, 'reves', false)}
              {renderPlayerBadge(match.teamB.playerDerecha, 'derecha', false)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
