'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, FastForward, ShieldAlert, Smartphone, Clock } from 'lucide-react';
import { americanaAudio } from '../../utils/americanaAudio';

interface AmericanaTimerProps {
  durationMinutes: number;
  onChangeDuration: (minutes: number) => void;
  isRunning: boolean;
  timeRemaining: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNextRound: () => void;
  onTimerFinished: () => void;
  roundNumber: number;
}

export const AmericanaTimer: React.FC<AmericanaTimerProps> = ({
  durationMinutes,
  onChangeDuration,
  isRunning,
  timeRemaining,
  onStart,
  onPause,
  onReset,
  onNextRound,
  onTimerFinished,
  roundNumber,
}) => {
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [isAudioTesting, setIsAudioTesting] = useState(false);
  const wakeLockRef = useRef<any>(null);

  // Screen Wake Lock API to prevent phone screen from dimming/sleeping on court
  const requestWakeLock = useCallback(async () => {
    if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        setWakeLockActive(true);
        wakeLockRef.current.addEventListener('release', () => {
          setWakeLockActive(false);
        });
      } catch (err) {
        // WakeLock request can fail if battery saver is on
        console.warn('WakeLock not granted:', err);
      }
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      try {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
        setWakeLockActive(false);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [isRunning, requestWakeLock, releaseWakeLock]);

  // Audio test trigger
  const handleTestAudio = () => {
    americanaAudio.unlockAudio();
    setIsAudioTesting(true);
    americanaAudio.startLoudAlarm();
    setTimeout(() => {
      americanaAudio.stopAlarm();
      setIsAudioTesting(false);
    }, 2400);
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalSeconds = durationMinutes * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeRemaining) / totalSeconds) * 100 : 0;

  // Warning state colors
  const isDanger = timeRemaining <= 30 && timeRemaining > 0;
  const isWarning = timeRemaining <= 60 && timeRemaining > 30;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-5 sm:p-6 shadow-2xl">
      {/* Background glow when warning/danger */}
      {isDanger && (
        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Round & Duration Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20">
              Ronda {roundNumber}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Duración del partido:</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[10, 12, 15, 20].map((mins) => (
              <button
                key={mins}
                type="button"
                disabled={isRunning}
                onClick={() => onChangeDuration(mins)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  durationMinutes === mins
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50'
                }`}
              >
                {mins} min
              </button>
            ))}

            {/* Custom minute stepper */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
              <button
                type="button"
                disabled={isRunning || durationMinutes <= 1}
                onClick={() => onChangeDuration(Math.max(1, durationMinutes - 1))}
                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-40 text-xs font-bold"
              >
                -
              </button>
              <span className="font-mono text-xs font-bold text-slate-200 px-1">{durationMinutes}m</span>
              <button
                type="button"
                disabled={isRunning || durationMinutes >= 60}
                onClick={() => onChangeDuration(Math.min(60, durationMinutes + 1))}
                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-40 text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Mobile phone helper indicators */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{wakeLockActive ? '📱 Pantalla activa' : '📱 Alarma móvil lista'}</span>
            </span>
            <span>•</span>
            <button
              type="button"
              onClick={handleTestAudio}
              className={`flex items-center gap-1 font-bold transition px-2 py-0.5 rounded-lg border ${
                isAudioTesting
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Volume2 className="w-3 h-3 text-emerald-400" />
              <span>{isAudioTesting ? '¡Sonando...!' : 'Probar Bocina'}</span>
            </button>
          </div>
        </div>

        {/* Center: Massive Timer Display */}
        <div className="flex flex-col items-center justify-center">
          <div
            className={`font-mono text-5xl sm:text-6xl font-black tracking-tight transition-all duration-300 ${
              isDanger
                ? 'text-red-500 scale-105 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : isWarning
                ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : isRunning
                ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-white'
            }`}
          >
            {formattedTime}
          </div>

          {/* Progress bar */}
          <div className="w-48 sm:w-60 h-2 bg-slate-800 rounded-full mt-2.5 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isDanger
                  ? 'bg-gradient-to-r from-red-500 to-amber-500'
                  : isWarning
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>

          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mt-1">
            {isRunning ? 'Partido en curso' : timeRemaining === 0 ? '¡Tiempo cumplido!' : 'En pausa'}
          </div>
        </div>

        {/* Right: Big Action Controls */}
        <div className="flex items-center gap-2.5 justify-center md:justify-end flex-wrap">
          {!isRunning ? (
            <button
              type="button"
              onClick={() => {
                americanaAudio.unlockAudio();
                americanaAudio.playWhistle();
                onStart();
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Iniciar Tiempo</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPause}
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pausar</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95 border border-slate-700"
            title="Reiniciar reloj de la ronda"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onNextRound}
            className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 active:scale-95"
            title="Sortear siguiente ronda ahora"
          >
            <span>Siguiente Ronda</span>
            <FastForward className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
