'use client';

import React, { useState } from 'react';
import { Court, OpenMatch, Player } from '../types';
import { COURTS } from '../data/courts';
import { LevelBadge } from './LevelBadge';
import { X, Plus, Calendar, Clock, MapPin, Trophy, ShieldAlert } from 'lucide-react';

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Player;
  onCreateMatch: (match: OpenMatch) => void;
}

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateMatch,
}) => {
  const [selectedCourt, setSelectedCourt] = useState<Court>(COURTS[0]);
  const [date, setDate] = useState('Hoy, 15 Oct');
  const [time, setTime] = useState('19:00 - 20:30');
  const [minLevel, setMinLevel] = useState(Math.max(1.0, Math.round((currentUser.level - 0.5) * 10) / 10));
  const [maxLevel, setMaxLevel] = useState(Math.min(7.0, Math.round((currentUser.level + 0.5) * 10) / 10));
  const [isCompetitive, setIsCompetitive] = useState(true);
  const [notes, setNotes] = useState('Partido abierto Espadel, busco cerrar pista pronto.');
  const [preferredSide, setPreferredSide] = useState<'Revés' | 'Drive'>(currentUser.sidePreference === 'Drive' ? 'Drive' : 'Revés');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pricePerPlayer = Math.round((selectedCourt.priceHour * 1.5) / 4);

    const newMatch: OpenMatch = {
      id: `match-${Date.now()}`,
      courtName: selectedCourt.name,
      courtType: selectedCourt.type,
      date,
      time,
      durationMinutes: 90,
      pricePerPlayer: pricePerPlayer || 7.5,
      minLevel,
      maxLevel,
      status: 'open',
      isCompetitive,
      notes,
      slots: [
        {
          position: 1,
          team: 'A',
          player: {
            ...currentUser,
            sidePreference: preferredSide
          }
        },
        { position: 2, team: 'A', player: undefined },
        { position: 3, team: 'B', player: undefined },
        { position: 4, team: 'B', player: undefined },
      ]
    };

    onCreateMatch(newMatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/80">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Crear Partido Abierto en Espadel Club</h2>
            <p className="text-xs text-zinc-400">Reserva tu plaza y abre las otras 3 a los socios del club</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Court Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">Selecciona Pista Espadel</label>
            <div className="grid grid-cols-2 gap-2">
              {COURTS.map(court => (
                <button
                  type="button"
                  key={court.id}
                  onClick={() => setSelectedCourt(court)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    selectedCourt.id === court.id
                      ? 'bg-yellow-400/10 border-yellow-400 text-white shadow-md'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="font-bold text-xs truncate">{court.name}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{court.type}</div>
                  <div className="text-xs font-mono font-bold text-yellow-400 mt-1">{court.priceHour}€/h</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Día</label>
              <select
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="Hoy, 15 Oct">Hoy, 15 Oct</option>
                <option value="Mañana, 16 Oct">Mañana, 16 Oct</option>
                <option value="Sábado, 17 Oct">Sábado, 17 Oct</option>
                <option value="Domingo, 18 Oct">Domingo, 18 Oct</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Horario (90 min)</label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
              >
                <option value="16:30 - 18:00">16:30 - 18:00</option>
                <option value="18:00 - 19:30">18:00 - 19:30</option>
                <option value="19:00 - 20:30">19:00 - 20:30</option>
                <option value="19:30 - 21:00">19:30 - 21:00</option>
                <option value="20:30 - 22:00">20:30 - 22:00</option>
                <option value="21:00 - 22:30">21:00 - 22:30</option>
              </select>
            </div>
          </div>

          {/* Level Filter (1.0 to 7.0) */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-200">Rango de Nivel Permitido</label>
              <div className="flex items-center gap-1.5">
                <LevelBadge level={minLevel} size="sm" showCategory={false} />
                <span className="text-xs text-zinc-500">a</span>
                <LevelBadge level={maxLevel} size="sm" showCategory={false} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-zinc-400 block mb-1">Mínimo: {minLevel.toFixed(1)}</span>
                <input
                  type="range"
                  min="1.0"
                  max="7.0"
                  step="0.1"
                  value={minLevel}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setMinLevel(val);
                    if (val > maxLevel) setMaxLevel(val);
                  }}
                  className="w-full accent-yellow-400"
                />
              </div>

              <div>
                <span className="text-[10px] text-zinc-400 block mb-1">Máximo: {maxLevel.toFixed(1)}</span>
                <input
                  type="range"
                  min="1.0"
                  max="7.0"
                  step="0.1"
                  value={maxLevel}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setMaxLevel(val);
                    if (val < minLevel) setMinLevel(val);
                  }}
                  className="w-full accent-yellow-400"
                />
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">
              Tu nivel actual en Espadel es <strong>{currentUser.level.toFixed(1)}</strong>.
            </p>
          </div>

          {/* Position & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tu Posición Preferida</label>
              <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setPreferredSide('Revés')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                    preferredSide === 'Revés' ? 'bg-yellow-400 text-black shadow' : 'text-zinc-400'
                  }`}
                >
                  Revés
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredSide('Drive')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                    preferredSide === 'Drive' ? 'bg-yellow-400 text-black shadow' : 'text-zinc-400'
                  }`}
                >
                  Drive
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tipo de Partido</label>
              <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCompetitive(true)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                    isCompetitive ? 'bg-yellow-400 text-black shadow' : 'text-zinc-400'
                  }`}
                >
                  Competitivo
                </button>
                <button
                  type="button"
                  onClick={() => setIsCompetitive(false)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                    !isCompetitive ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400'
                  }`}
                >
                  Amistoso
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Notas para los compañeros</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
              placeholder="Ej: Bolas nuevas Espadel, buscamos cerrar pista pronto"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm shadow-xl shadow-yellow-400/20 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Publicar Partido Abierto
          </button>
        </form>
      </div>
    </div>
  );
};
