'use client';

import React, { useState } from 'react';
import { Player, SkillCategory } from '../types';
import { LevelBadge } from './LevelBadge';
import { 
  Trophy, Medal, Search, Filter, ShieldCheck, Flame, Users, 
  ArrowUpRight, TrendingUp, Sparkles, CheckCircle, ChevronRight,
  Info, Award, Zap
} from 'lucide-react';

interface ClubRankingViewProps {
  players: Player[];
  currentUser: Player;
  onSelectPlayer: (player: Player) => void;
  onOpenQuiz: () => void;
}

export const ClubRankingView: React.FC<ClubRankingViewProps> = ({
  players,
  currentUser,
  onSelectPlayer,
  onOpenQuiz,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'iniciacion' | 'medio' | 'avanzado'>('all');
  const [showPlaytomicInfo, setShowPlaytomicInfo] = useState(false);

  // Sort players by matches won descending (tiebreak: winRate descending, then level descending)
  const sortedPlayers = [...players].sort((a, b) => {
    const aWon = a.matchesWon ?? Math.round(a.matchesPlayed * (a.winRate / 100));
    const bWon = b.matchesWon ?? Math.round(b.matchesPlayed * (b.winRate / 100));
    if (bWon !== aWon) {
      return bWon - aWon;
    }
    if (b.winRate !== a.winRate) {
      return b.winRate - a.winRate;
    }
    return b.level - a.level;
  });

  // Filtered list
  const filteredPlayers = sortedPlayers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.clubMemberNumber && p.clubMemberNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (categoryFilter !== 'all' && p.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  // Podium (Top 3)
  const top1 = sortedPlayers[0];
  const top2 = sortedPlayers[1];
  const top3 = sortedPlayers[2];

  // Current user's ranking position
  const currentUserRankIndex = sortedPlayers.findIndex(p => p.id === currentUser.id);
  const currentUserRank = currentUserRankIndex >= 0 ? currentUserRankIndex + 1 : null;

  return (
    <div className="space-y-6">
      {/* 1. Header & Playtomic Algorithm Explainer Banner */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Yellow ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10 bg-yellow-400 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black text-xs">
                🏆
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-yellow-400 font-bold">
                Ranking Oficial de Socios • Espadel Club
              </span>
              <span className="text-[10px] bg-yellow-400/10 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400/20 font-mono">
                Por Partidos Ganados
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tabla de Clasificación del Club
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Clasificación actualizada en tiempo real según el número de <strong>partidos ganados</strong> en Espadel Club.
              El nivel se calcula con nuestro sistema dinámico estilo Playtomic.
            </p>
          </div>

          {/* User's quick position pill */}
          {currentUserRank && (
            <div className="flex items-center gap-3 bg-zinc-900 border-2 border-yellow-400/40 p-3 rounded-2xl shrink-0">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black font-black flex items-center justify-center text-sm shadow-md">
                #{currentUserRank}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block font-semibold">Tu Posición</span>
                <span className="text-xs font-bold text-white">{currentUser.name}</span>
                <span className="text-[11px] font-mono text-yellow-400 font-bold block">
                  {currentUser.matchesWon ?? Math.round(currentUser.matchesPlayed * (currentUser.winRate / 100))} victorias ({currentUser.winRate}%)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Playtomic dynamic ELO info drawer trigger */}
        <div className="mt-4 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>
              <strong>Sistema de nivel dinámico (estilo Playtomic):</strong> A más partidos jugados, tu nivel se consolida y cada victoria otorga incrementos más estables y precisos.
            </span>
          </div>
          <button
            onClick={() => setShowPlaytomicInfo(!showPlaytomicInfo)}
            className="text-xs text-yellow-400 hover:text-yellow-300 font-bold underline underline-offset-2 flex items-center gap-1 shrink-0"
          >
            <Info className="w-3.5 h-3.5" />
            {showPlaytomicInfo ? 'Ocultar detalles del algoritmo' : '¿Cómo se calculan los puntos?'}
          </button>
        </div>

        {/* Expandable Explanation Box */}
        {showPlaytomicInfo && (
          <div className="mt-4 p-4 rounded-2xl bg-zinc-900/90 border border-yellow-400/30 text-xs space-y-3 animate-in fade-in duration-200">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" /> Funcionamiento del Algoritmo de Nivel Espadel (Playtomic K-Factor)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-zinc-300">
              <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                <span className="text-yellow-400 font-black block mb-0.5">1. Fase de Calibración (&lt; 10 partidos)</span>
                <p className="text-[11px] text-zinc-400">
                  Fiabilidad baja (20%-50%). K-factor alto: cada victoria suma entre <strong>+0.08 y +0.15 puntos</strong> para encontrar rápidamente tu nivel real.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                <span className="text-yellow-400 font-black block mb-0.5">2. Fase de Consolidación (10 a 50 partidos)</span>
                <p className="text-[11px] text-zinc-400">
                  Fiabilidad media (50%-85%). El nivel se estabiliza y cada victoria aporta entre <strong>+0.03 y +0.06 puntos</strong>.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                <span className="text-yellow-400 font-black block mb-0.5">3. Nivel Consolidado (&gt; 50 partidos)</span>
                <p className="text-[11px] text-zinc-400">
                  Fiabilidad máxima (85%-99%). Tu nivel refleja fielmente tu juego. Cada victoria otorga entre <strong>+0.01 y +0.02 puntos</strong> ajustado a la dificultad de los rivales.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. PODIO TOP 3 (PARTIDOS GANADOS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 2º Lugar - Plata */}
        {top2 && (
          <div
            onClick={() => onSelectPlayer(top2)}
            className="group relative bg-zinc-950 border border-zinc-800 hover:border-zinc-500 rounded-3xl p-5 shadow-xl cursor-pointer transition flex flex-col justify-between order-2 sm:order-1"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-full bg-slate-300 text-black font-black text-sm flex items-center justify-center shadow-md">
                2º
              </span>
              <span className="text-xs font-mono text-zinc-400 font-semibold">Plata</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-slate-400 mb-3 shadow-lg group-hover:scale-105 transition">
                <img src={top2.avatar} alt={top2.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition">{top2.name}</h3>
              <span className="text-xs text-zinc-400 font-mono">{top2.clubMemberNumber}</span>
              <div className="mt-2">
                <LevelBadge level={top2.level} category={top2.category} size="sm" isCertified={top2.levelCertifiedByClub} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
              <div className="text-center flex-1">
                <span className="text-[10px] text-zinc-500 font-mono block">Victorias</span>
                <span className="text-base font-black text-yellow-400 font-mono">{top2.matchesWon ?? Math.round(top2.matchesPlayed * (top2.winRate / 100))}</span>
              </div>
              <div className="w-px h-6 bg-zinc-800" />
              <div className="text-center flex-1">
                <span className="text-[10px] text-zinc-500 font-mono block">Win Rate</span>
                <span className="text-base font-bold text-white font-mono">{top2.winRate}%</span>
              </div>
            </div>
          </div>
        )}

        {/* 1er Lugar - Oro (Destacado en el centro) */}
        {top1 && (
          <div
            onClick={() => onSelectPlayer(top1)}
            className="group relative bg-zinc-950 border-2 border-yellow-400 rounded-3xl p-6 shadow-2xl shadow-yellow-400/10 cursor-pointer transition flex flex-col justify-between order-1 sm:order-2 sm:-translate-y-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-9 h-9 rounded-full bg-yellow-400 text-black font-black text-base flex items-center justify-center shadow-lg shadow-yellow-400/30">
                  1º
                </span>
                <span className="text-xs font-mono text-yellow-400 font-black tracking-wider uppercase">Líder del Club</span>
              </div>
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-yellow-400 ring-offset-2 ring-offset-black mb-3 shadow-xl group-hover:scale-105 transition">
                <img src={top1.avatar} alt={top1.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-yellow-400 transition">{top1.name}</h3>
              <span className="text-xs text-yellow-400/80 font-mono">{top1.clubMemberNumber}</span>
              <div className="mt-2">
                <LevelBadge level={top1.level} category={top1.category} size="md" isCertified={top1.levelCertifiedByClub} />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs bg-yellow-400/5 p-3 rounded-2xl">
              <div className="text-center flex-1">
                <span className="text-[10px] text-zinc-400 font-mono block">Partidos Ganados</span>
                <span className="text-xl font-black text-yellow-400 font-mono">{top1.matchesWon ?? Math.round(top1.matchesPlayed * (top1.winRate / 100))}</span>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="text-center flex-1">
                <span className="text-[10px] text-zinc-400 font-mono block">Win Rate</span>
                <span className="text-xl font-black text-white font-mono">{top1.winRate}%</span>
              </div>
            </div>
          </div>
        )}

        {/* 3er Lugar - Bronce */}
        {top3 && (
          <div
            onClick={() => onSelectPlayer(top3)}
            className="group relative bg-zinc-950 border border-zinc-800 hover:border-amber-700/60 rounded-3xl p-5 shadow-xl cursor-pointer transition flex flex-col justify-between order-3"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center shadow-md">
                3º
              </span>
              <span className="text-xs font-mono text-zinc-400 font-semibold">Bronce</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-amber-700 mb-3 shadow-lg group-hover:scale-105 transition">
                <img src={top3.avatar} alt={top3.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition">{top3.name}</h3>
              <span className="text-xs text-zinc-400 font-mono">{top3.clubMemberNumber}</span>
              <div className="mt-2">
                <LevelBadge level={top3.level} category={top3.category} size="sm" isCertified={top3.levelCertifiedByClub} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
              <div className="text-center flex-1">
                <span className="text-[10px] text-zinc-500 font-mono block">Victorias</span>
                <span className="text-base font-black text-yellow-400 font-mono">{top3.matchesWon ?? Math.round(top3.matchesPlayed * (top3.winRate / 100))}</span>
              </div>
              <div className="w-px h-6 bg-zinc-800" />
              <div className="text-center flex-1">
                <span className="text-[10px] text-zinc-500 font-mono block">Win Rate</span>
                <span className="text-base font-bold text-white font-mono">{top3.winRate}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. FILTERS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 rounded-3xl p-4 shadow-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar socio por nombre o nº ESPADEL..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-zinc-500 font-mono mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Nivel:
          </span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              categoryFilter === 'all'
                ? 'bg-yellow-400 text-black'
                : 'text-zinc-400 hover:text-white bg-zinc-900'
            }`}
          >
            Todos ({players.length})
          </button>
          <button
            onClick={() => setCategoryFilter('avanzado')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              categoryFilter === 'avanzado'
                ? 'bg-yellow-400 text-black'
                : 'text-zinc-400 hover:text-white bg-zinc-900'
            }`}
          >
            Avanzado (5.0 - 7.0)
          </button>
          <button
            onClick={() => setCategoryFilter('medio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              categoryFilter === 'medio'
                ? 'bg-yellow-400 text-black'
                : 'text-zinc-400 hover:text-white bg-zinc-900'
            }`}
          >
            Medio (3.0 - 4.9)
          </button>
          <button
            onClick={() => setCategoryFilter('iniciacion')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              categoryFilter === 'iniciacion'
                ? 'bg-yellow-400 text-black'
                : 'text-zinc-400 hover:text-white bg-zinc-900'
            }`}
          >
            Iniciación (1.0 - 2.9)
          </button>
        </div>
      </div>

      {/* 4. TABLA COMPLETA DE CLASIFICACIÓN */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/50 text-[11px] font-mono uppercase text-zinc-400">
                <th className="py-3.5 px-4 text-center w-16">Pos</th>
                <th className="py-3.5 px-4">Jugador / Socio</th>
                <th className="py-3.5 px-4 text-center">Nivel Oficial</th>
                <th className="py-3.5 px-4 text-center">Partidos Ganados</th>
                <th className="py-3.5 px-4 text-center">Jugados / Win %</th>
                <th className="py-3.5 px-4 text-center">Fiabilidad Playtomic</th>
                <th className="py-3.5 px-4 text-right">Perfil & Parejas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-xs">
              {filteredPlayers.map((player) => {
                const originalRank = sortedPlayers.findIndex(p => p.id === player.id) + 1;
                const isMe = player.id === currentUser.id;

                return (
                  <tr
                    key={player.id}
                    onClick={() => onSelectPlayer(player)}
                    className={`group hover:bg-zinc-900/60 transition cursor-pointer ${
                      isMe ? 'bg-yellow-400/5' : ''
                    }`}
                  >
                    {/* Rank Number */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      {originalRank === 1 ? (
                        <span className="w-7 h-7 rounded-lg bg-yellow-400 text-black font-black inline-flex items-center justify-center text-xs shadow">
                          1
                        </span>
                      ) : originalRank === 2 ? (
                        <span className="w-7 h-7 rounded-lg bg-slate-300 text-black font-black inline-flex items-center justify-center text-xs shadow">
                          2
                        </span>
                      ) : originalRank === 3 ? (
                        <span className="w-7 h-7 rounded-lg bg-amber-700 text-white font-black inline-flex items-center justify-center text-xs shadow">
                          3
                        </span>
                      ) : (
                        <span className="font-bold text-zinc-400">#{originalRank}</span>
                      )}
                    </td>

                    {/* Player Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-zinc-700 group-hover:border-yellow-400 transition">
                          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white group-hover:text-yellow-400 transition">
                              {player.name}
                            </span>
                            {isMe && (
                              <span className="text-[9px] font-mono font-bold bg-yellow-400 text-black px-1.5 py-0.2 rounded">
                                TÚ
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-2 mt-0.5">
                            <span>{player.clubMemberNumber || 'ESPADEL-SOCI@'}</span>
                            <span>•</span>
                            <span className="text-zinc-400">{player.sidePreference}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Official Level */}
                    <td className="py-3.5 px-4 text-center">
                      <LevelBadge level={player.level} category={player.category} size="sm" isCertified={player.levelCertifiedByClub} />
                    </td>

                    {/* Matches Won (Primary Ranking Metric) */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
                        <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-sm font-black font-mono text-yellow-400">
                          {player.matchesWon ?? Math.round(player.matchesPlayed * (player.winRate / 100))}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">victorias</span>
                      </div>
                    </td>

                    {/* Matches Played / Win Rate */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-mono text-xs font-bold text-white">
                        {player.winRate}% win
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {player.matchesPlayed} jugados ({player.matchesLost ?? (player.matchesPlayed - (player.matchesWon ?? Math.round(player.matchesPlayed * (player.winRate / 100))))} d)
                      </div>
                    </td>

                    {/* Reliability Gauge (Playtomic style) */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className={`font-bold ${
                            (player.reliabilityPercent || 80) >= 85
                              ? 'text-emerald-400'
                              : (player.reliabilityPercent || 80) >= 60
                              ? 'text-yellow-400'
                              : 'text-amber-400'
                          }`}>
                            {player.reliabilityPercent || 80}%
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {(player.reliabilityPercent || 80) >= 85 ? 'Consolidado' : 'En calibración'}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-24 h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (player.reliabilityPercent || 80) >= 85 ? 'bg-emerald-400' : 'bg-yellow-400'
                            }`}
                            style={{ width: `${player.reliabilityPercent || 80}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action: Ver Perfil */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPlayer(player);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 group-hover:bg-yellow-400 group-hover:text-black border border-zinc-800 text-zinc-300 font-bold text-xs transition inline-flex items-center gap-1"
                      >
                        <span>Ver Perfil</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
