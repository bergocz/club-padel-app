'use client';

import React from 'react';
import { ClubCourt } from '../../types/americana';
import { X, Check, Grid, Sparkles, Building2 } from 'lucide-react';

interface CourtSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  courts: ClubCourt[];
  onUpdateCourts: (courts: ClubCourt[]) => void;
}

export const CourtSelectorModal: React.FC<CourtSelectorModalProps> = ({
  isOpen,
  onClose,
  courts,
  onUpdateCourts,
}) => {
  if (!isOpen) return null;

  const activeCount = courts.filter(c => c.active).length;
  const playersRequired = activeCount * 4;

  const handleToggleCourt = (id: number) => {
    onUpdateCourts(
      courts.map(c => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const handleUpdateName = (id: number, newName: string) => {
    onUpdateCourts(
      courts.map(c => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  const handleSelectCount = (count: number) => {
    onUpdateCourts(
      courts.map((c, idx) => ({ ...c, active: idx < count }))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Pistas del Club para la Americana
              </h2>
              <p className="text-xs text-slate-400">
                Selecciona qué pistas de las 6 disponibles vais a utilizar hoy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Quick Select Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Selección Rápida:
            </span>
            <div className="flex items-center gap-1.5">
              {[2, 3, 4, 6].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleSelectCount(num)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    activeCount === num
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {num} pistas ({num * 4} jug.)
                </button>
              ))}
            </div>
          </div>

          {/* Courts Grid (The 6 club courts) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courts.map((court) => (
              <div
                key={court.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  court.active
                    ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-emerald-500/50 shadow-md shadow-emerald-500/5'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        court.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                      }`}
                    />
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Pista #{court.id}
                    </span>
                  </div>

                  {/* Toggle switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleCourt(court.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      court.active
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {court.active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{court.active ? 'Activa' : 'Inactiva'}</span>
                  </button>
                </div>

                {/* Editable court name */}
                <input
                  type="text"
                  value={court.name}
                  onChange={(e) => handleUpdateName(court.id, e.target.value)}
                  placeholder={`Nombre de Pista ${court.id}`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>
            ))}
          </div>

          {/* Capacity pill */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Capacidad requerida:</span>
            <span className="font-mono font-black text-emerald-400">
              {activeCount} pistas activas = {playersRequired} jugadores por ronda
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition"
          >
            Guardar y Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
