'use client';

import React, { useEffect } from 'react';
import { VolumeX, FastForward, BellRing, Sparkles } from 'lucide-react';
import { americanaAudio } from '../../utils/americanaAudio';

interface AlarmModalProps {
  isOpen: boolean;
  roundNumber: number;
  onStopAlarm: () => void;
  onNextRound: () => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  isOpen,
  roundNumber,
  onStopAlarm,
  onNextRound,
}) => {
  useEffect(() => {
    if (isOpen) {
      americanaAudio.startLoudAlarm();
    } else {
      americanaAudio.stopAlarm();
    }
    return () => {
      americanaAudio.stopAlarm();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Flashing ambient aura */}
      <div className="absolute inset-0 bg-red-600/15 animate-pulse pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full bg-slate-900 border-2 border-red-500/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.35)] text-center space-y-6">
        {/* Pulsing Bell Icon */}
        <div className="relative mx-auto w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center animate-bounce">
          <BellRing className="w-12 h-12 text-red-400 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500"></span>
          </span>
        </div>

        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-xs uppercase tracking-widest font-bold mb-2">
            ¡Ronda {roundNumber} Finalizada!
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            ¡TIEMPO! CAMBIO DE PISTA
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
            Ha sonado la bocina oficial. Anotad los juegos conseguidos en cada pista y pasad al siguiente turno de la americana.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onStopAlarm}
            className="flex-1 py-4 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-sm transition flex items-center justify-center gap-2 active:scale-95"
          >
            <VolumeX className="w-5 h-5 text-red-400" />
            <span>Detener Bocina</span>
          </button>

          <button
            type="button"
            onClick={() => {
              americanaAudio.stopAlarm();
              onNextRound();
            }}
            className="flex-1 py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <FastForward className="w-5 h-5 stroke-[2.5]" />
            <span>Sortear Ronda {roundNumber + 1}</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          🔊 La alarma sonará hasta que pulses Detener o Siguiente Ronda
        </div>
      </div>
    </div>
  );
};
