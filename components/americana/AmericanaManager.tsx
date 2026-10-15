'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AmericanaPlayer,
  ClubCourt,
  AmericanaRound,
  AmericanaMatch,
} from '../../types/americana';
import {
  DEFAULT_CLUB_COURTS,
  DEFAULT_PRESET_PLAYERS,
  generateAmericanaRound,
} from '../../utils/americanaAlgorithm';
import { americanaAudio } from '../../utils/americanaAudio';
import { PadelCourtCard } from './PadelCourtCard';
import { AmericanaTimer } from './AmericanaTimer';
import { AlarmModal } from './AlarmModal';
import { PlayerManagerModal } from './PlayerManagerModal';
import { CourtSelectorModal } from './CourtSelectorModal';
import { LeaderboardModal } from './LeaderboardModal';
import {
  Shuffle,
  Users,
  Building2,
  Trophy,
  Share2,
  Check,
  Maximize2,
  Sparkles,
  Volume2,
  RefreshCw,
  Coffee,
  AlertTriangle,
} from 'lucide-react';

const STORAGE_KEY = 'club_padel_americana_state_v1';

export const AmericanaManager: React.FC = () => {
  // State
  const [courts, setCourts] = useState<ClubCourt[]>(DEFAULT_CLUB_COURTS);
  const [players, setPlayers] = useState<AmericanaPlayer[]>(DEFAULT_PRESET_PLAYERS);
  const [rounds, setRounds] = useState<AmericanaRound[]>([]);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(12);
  const [timeRemaining, setTimeRemaining] = useState(12 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modals
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.courts) setCourts(parsed.courts);
        if (parsed.players) setPlayers(parsed.players);
        if (parsed.rounds) setRounds(parsed.rounds);
        if (parsed.currentRoundNumber) setCurrentRoundNumber(parsed.currentRoundNumber);
        if (parsed.durationMinutes) {
          setDurationMinutes(parsed.durationMinutes);
          setTimeRemaining(parsed.durationMinutes * 60);
        }
      }
    } catch (e) {
      console.warn('Could not load Americana state from localStorage', e);
    }
  }, []);

  // Save to LocalStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          courts,
          players,
          rounds,
          currentRoundNumber,
          durationMinutes,
        })
      );
    } catch (e) {
      console.warn('Could not save Americana state to localStorage', e);
    }
  }, [courts, players, rounds, currentRoundNumber, durationMinutes]);

  // Current active round
  const currentRound = rounds.find(r => r.roundNumber === currentRoundNumber) || rounds[rounds.length - 1];

  // Sound & Timer countdown logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time finished!
            setIsTimerRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            setIsAlarmModalOpen(true);
            return 0;
          }

          // Last 5 seconds audio countdown tick
          if (prev <= 5 && prev >= 2) {
            americanaAudio.playCountdownTick(false);
          } else if (prev === 2) {
            americanaAudio.playCountdownTick(true);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Handle changing duration
  const handleChangeDuration = (minutes: number) => {
    setDurationMinutes(minutes);
    setTimeRemaining(minutes * 60);
    setIsTimerRunning(false);
  };

  // Generate / Roll next round
  const handleGenerateRound = useCallback(() => {
    try {
      americanaAudio.unlockAudio();
      americanaAudio.playWhistle();

      const nextNum = rounds.length === 0 ? 1 : currentRoundNumber + 1;
      const newRound = generateAmericanaRound(players, courts, rounds, nextNum);

      // Increment matchesPlayed and rest counts for players
      const updatedPlayers = players.map(p => {
        const isResting = newRound.restingPlayers.some(rp => rp.id === p.id);
        const isPlaying = newRound.matches.some(
          m =>
            m.teamA.playerReves.id === p.id ||
            m.teamA.playerDerecha.id === p.id ||
            m.teamB.playerReves.id === p.id ||
            m.teamB.playerDerecha.id === p.id
        );

        return {
          ...p,
          matchesPlayed: isPlaying ? p.matchesPlayed + 1 : p.matchesPlayed,
          restCount: isResting ? p.restCount + 1 : p.restCount,
        };
      });

      setPlayers(updatedPlayers);
      setRounds(prev => [...prev, newRound]);
      setCurrentRoundNumber(nextNum);
      setTimeRemaining(durationMinutes * 60);
      setIsTimerRunning(true);
      setIsAlarmModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Error al generar la ronda de la americana.');
    }
  }, [players, courts, rounds, currentRoundNumber, durationMinutes]);

  // Update match score in the current round
  const handleUpdateScore = (matchId: string, scoreA: number, scoreB: number) => {
    setRounds(prev =>
      prev.map(r => {
        if (r.roundNumber !== currentRoundNumber) return r;
        return {
          ...r,
          matches: r.matches.map(m => {
            if (m.id !== matchId) return m;

            // Calculate points delta for players
            const deltaA = scoreA - (m.scoreA || 0);
            const deltaB = scoreB - (m.scoreB || 0);

            // Update player points in real time
            setPlayers(currentPlayers =>
              currentPlayers.map(p => {
                if (p.id === m.teamA.playerReves.id || p.id === m.teamA.playerDerecha.id) {
                  return { ...p, pointsWon: Math.max(0, p.pointsWon + deltaA) };
                }
                if (p.id === m.teamB.playerReves.id || p.id === m.teamB.playerDerecha.id) {
                  return { ...p, pointsWon: Math.max(0, p.pointsWon + deltaB) };
                }
                return p;
              })
            );

            return {
              ...m,
              scoreA,
              scoreB,
            };
          }),
        };
      })
    );
  };

  // Share current round via WhatsApp
  const handleShareRoundWhatsApp = () => {
    if (!currentRound) return;
    let text = `🎾 *AMERICANA DE PÁDEL — RONDA ${currentRound.roundNumber}*\n`;
    text += `⏱️ Duración: ${durationMinutes} min\n\n`;

    currentRound.matches.forEach(m => {
      text += `📍 *${m.courtName}*:\n`;
      text += `🔵 ${m.teamA.playerReves.name} & ${m.teamA.playerDerecha.name}\n`;
      text += `VS\n`;
      text += `🟢 ${m.teamB.playerReves.name} & ${m.teamB.playerDerecha.name}\n\n`;
    });

    if (currentRound.restingPlayers && currentRound.restingPlayers.length > 0) {
      text += `☕ *Descansan esta ronda:* ${currentRound.restingPlayers.map(p => p.name).join(', ')}\n\n`;
    }

    text += `¡A pista y a disfrutar! 🏆`;

    navigator.clipboard.writeText(text).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }).catch(() => {});
  };

  // Fullscreen helper
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const activeCourts = courts.filter(c => c.active);
  const activePlayers = players.filter(p => p.active);

  return (
    <div className="space-y-6">
      {/* Top Controls & Navigation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        {/* Left: Americana Identity & Status */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Shuffle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                Americana de Pádel
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                EN VIVO
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{activeCourts.length} pistas seleccionadas</span>
              <span>•</span>
              <span>{activePlayers.length} jugadores</span>
              <span>•</span>
              <span className="font-mono text-emerald-400 font-bold">Ronda {currentRoundNumber}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Settings Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsCourtModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs transition flex items-center gap-1.5 active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pistas ({activeCourts.length}/6)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlayerModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs transition flex items-center gap-1.5 active:scale-95"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Jugadores ({activePlayers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLeaderboardOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 font-bold text-xs transition flex items-center gap-1.5 active:scale-95"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Ranking Puntos</span>
          </button>

          {currentRound && (
            <button
              type="button"
              onClick={handleShareRoundWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition flex items-center gap-1.5 active:scale-95"
              title="Copiar cruces para WhatsApp"
            >
              {shareCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{shareCopied ? '¡Copiado!' : 'Compartir Cruces'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition hidden sm:flex"
            title="Pantalla Completa"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Timer Display Widget */}
      <AmericanaTimer
        durationMinutes={durationMinutes}
        onChangeDuration={handleChangeDuration}
        isRunning={isTimerRunning}
        timeRemaining={timeRemaining}
        onStart={() => setIsTimerRunning(true)}
        onPause={() => setIsTimerRunning(false)}
        onReset={() => {
          setIsTimerRunning(false);
          setTimeRemaining(durationMinutes * 60);
        }}
        onNextRound={handleGenerateRound}
        onTimerFinished={() => {
          setIsTimerRunning(false);
          setIsAlarmModalOpen(true);
        }}
        roundNumber={currentRoundNumber}
      />

      {/* Resting Players Alert Bar (if any player is resting this round) */}
      {currentRound?.restingPlayers && currentRound.restingPlayers.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Descanso en esta ronda:</strong>{' '}
              {currentRound.restingPlayers.map(p => `${p.name} (${p.position})`).join(', ')}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">
            Rotación automática justa
          </span>
        </div>
      )}

      {/* Main Court Matches Grid */}
      {currentRound && currentRound.matches.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">
                Partidos en Pista — Ronda {currentRound.roundNumber}
              </span>
              <span className="text-xs font-mono text-slate-400">
                ({currentRound.matches.length} pistas disputándose)
              </span>
            </div>

            <button
              type="button"
              onClick={handleGenerateRound}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 font-bold text-xs transition flex items-center gap-1.5 active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Resortear Ronda {currentRoundNumber}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {currentRound.matches.map((match, idx) => (
              <PadelCourtCard
                key={match.id}
                match={match}
                matchIndex={idx}
                onUpdateScore={handleUpdateScore}
                isTimerRunning={isTimerRunning}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State / Initial Setup Screen */
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <Shuffle className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-black text-white mb-1">
              ¡Configura tu Americana de Pádel!
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tienes <strong>{activeCourts.length} pistas activas</strong> y{' '}
              <strong>{activePlayers.length} jugadores registrados</strong>. El algoritmo
              emparejará automáticamente a cada jugador de Revés con uno de Derecha, asignará pistas al azar y rotará compañeros.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            <button
              type="button"
              onClick={handleGenerateRound}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Sortear Primera Ronda</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPlayerModalOpen(true)}
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
            >
              Editar Jugadores y Lados
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      <PlayerManagerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        players={players}
        onUpdatePlayers={setPlayers}
        activeCourtsCount={activeCourts.length}
      />

      <CourtSelectorModal
        isOpen={isCourtModalOpen}
        onClose={() => setIsCourtModalOpen(false)}
        courts={courts}
        onUpdateCourts={setCourts}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        players={players}
        currentRoundNumber={currentRoundNumber}
        rounds={rounds}
      />

      <AlarmModal
        isOpen={isAlarmModalOpen}
        roundNumber={currentRoundNumber}
        onStopAlarm={() => setIsAlarmModalOpen(false)}
        onNextRound={handleGenerateRound}
      />
    </div>
  );
};
