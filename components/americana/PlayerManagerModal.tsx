'use client';

import React, { useState } from 'react';
import { AmericanaPlayer, PlayerPosition } from '../../types/americana';
import { DEFAULT_PRESET_PLAYERS } from '../../utils/americanaAlgorithm';
import { X, UserPlus, Users, Trash2, CheckCircle2, AlertCircle, Shuffle, Sparkles, UserCheck } from 'lucide-react';

interface PlayerManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: AmericanaPlayer[];
  onUpdatePlayers: (players: AmericanaPlayer[]) => void;
  activeCourtsCount: number;
}

export const PlayerManagerModal: React.FC<PlayerManagerModalProps> = ({
  isOpen,
  onClose,
  players,
  onUpdatePlayers,
  activeCourtsCount,
}) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<PlayerPosition>('reves');
  const [quickNamesText, setQuickNamesText] = useState('');
  const [showBatchImport, setShowBatchImport] = useState(false);

  if (!isOpen) return null;

  const neededPlayers = activeCourtsCount * 4;
  const activePlayers = players.filter(p => p.active);
  const revesCount = activePlayers.filter(p => p.position === 'reves').length;
  const derechaCount = activePlayers.filter(p => p.position === 'derecha').length;
  const indiferenteCount = activePlayers.filter(p => p.position === 'indiferente').length;

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const newPlayer: AmericanaPlayer = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      position,
      pointsWon: 0,
      matchesPlayed: 0,
      active: true,
      restCount: 0,
    };

    onUpdatePlayers([...players, newPlayer]);
    setName('');
  };

  const handleToggleActive = (id: string) => {
    onUpdatePlayers(
      players.map(p => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleChangePosition = (id: string, newPos: PlayerPosition) => {
    onUpdatePlayers(
      players.map(p => (p.id === id ? { ...p, position: newPos } : p))
    );
  };

  const handleDeletePlayer = (id: string) => {
    onUpdatePlayers(players.filter(p => p.id !== id));
  };

  const handleLoadPreset = (count: number) => {
    // Generate 'count' players with balanced positions
    const sampleNames = [
      'Ale Galán', 'Juan Lebrón', 'Arturo Coello', 'Agustín Tapia',
      'Fede Chingotto', 'Paquito Navarro', 'Martín Di Nenno', 'Franco Stupaczuk',
      'Mike Yanguas', 'Javi Garrido', 'Coki Nieto', 'Jon Sanz',
      'Momo González', 'Álex Ruiz', 'Sanyo Gutiérrez', 'Fernando Belasteguín',
      'Pablo Cardona', 'Leo Augsburger', 'Tino Libaak', 'Edu Alonso',
      'Lucas Bergamini', 'Jairo Bautista', 'Chipi Muñoz', 'Gonzalo Rubio'
    ];

    const newPlayers: AmericanaPlayer[] = [];
    for (let i = 0; i < count; i++) {
      const pName = sampleNames[i] || `Jugador ${i + 1}`;
      let pos: PlayerPosition = 'indiferente';
      if (i % 2 === 0) pos = 'reves';
      else pos = 'derecha';

      newPlayers.push({
        id: `preset-${i + 1}-${Date.now()}`,
        name: pName,
        position: pos,
        pointsWon: 0,
        matchesPlayed: 0,
        active: true,
        restCount: 0,
      });
    }

    onUpdatePlayers(newPlayers);
  };

  const handleBatchImport = () => {
    if (!quickNamesText.trim()) return;
    const lines = quickNamesText.split('\n').map(l => l.trim()).filter(Boolean);
    const added: AmericanaPlayer[] = lines.map((line, idx) => {
      let pos: PlayerPosition = 'indiferente';
      let cleanName = line;

      if (line.toLowerCase().includes('(r)') || line.toLowerCase().includes('revés') || line.toLowerCase().includes('reves')) {
        pos = 'reves';
        cleanName = line.replace(/\(r\)/i, '').replace(/revés/i, '').replace(/reves/i, '').trim();
      } else if (line.toLowerCase().includes('(d)') || line.toLowerCase().includes('derecha')) {
        pos = 'derecha';
        cleanName = line.replace(/\(d\)/i, '').replace(/derecha/i, '').trim();
      }

      return {
        id: `batch-${idx}-${Date.now()}`,
        name: cleanName,
        position: pos,
        pointsWon: 0,
        matchesPlayed: 0,
        active: true,
        restCount: 0,
      };
    });

    onUpdatePlayers([...players, ...added]);
    setQuickNamesText('');
    setShowBatchImport(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-black text-white">
              Gestión de Jugadores de la Americana
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Balance Status */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-400">Total Activos:</span>
              <span className="font-mono font-black text-white text-sm">
                {activePlayers.length}
                <span className="text-slate-500 font-normal"> / {neededPlayers} requeridos</span>
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {revesCount} Revés
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {derechaCount} Derecha
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {indiferenteCount} Poliv.
              </span>
            </div>

            {activePlayers.length < neededPlayers ? (
              <div className="w-full flex items-center gap-1.5 text-amber-400 text-[11px] font-medium pt-1 border-t border-slate-900">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Faltan {neededPlayers - activePlayers.length} jugadores para completar las {activeCourtsCount} pistas activas ({neededPlayers} jugadores).
                </span>
              </div>
            ) : (
              <div className="w-full flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium pt-1 border-t border-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Plazas cubiertas para {activeCourtsCount} pistas
                  {activePlayers.length > neededPlayers && ` (+${activePlayers.length - neededPlayers} con rotación de descanso).`}
                </span>
              </div>
            )}
          </div>

          {/* Quick Presets Bar */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Carga Rápida de Ejemplo:</span>
              <button
                type="button"
                onClick={() => setShowBatchImport(!showBatchImport)}
                className="text-emerald-400 hover:underline font-bold"
              >
                {showBatchImport ? 'Ocultar pegar lista' : '📋 Pegar lista de nombres'}
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleLoadPreset(8)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                8 Jugadores (2 pistas)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(12)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                12 Jugadores (3 pistas)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(16)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition"
              >
                16 Jugadores (4 pistas)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(24)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                24 Jugadores (6 pistas llenas)
              </button>
              {players.length > 0 && (
                <button
                  type="button"
                  onClick={() => onUpdatePlayers([])}
                  className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition ml-auto"
                >
                  Vaciar Todo
                </button>
              )}
            </div>
          </div>

          {/* Batch Import Textarea */}
          {showBatchImport && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-xs text-slate-400">
                Pega un nombre por línea. Puedes añadir (R) para revés o (D) para derecha al lado del nombre:
              </div>
              <textarea
                value={quickNamesText}
                onChange={(e) => setQuickNamesText(e.target.value)}
                placeholder={"Juan Pérez (R)\nCarlos López (D)\nMarta Ruiz"}
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="button"
                onClick={handleBatchImport}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition"
              >
                Importar Lista
              </button>
            </div>
          )}

          {/* Add Single Player Form */}
          <form onSubmit={handleAddPlayer} className="space-y-2.5 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Añadir Jugador Individual:
            </span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del jugador (ej. Carlos)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />

              {/* Position selector */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setPosition('reves')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    position === 'reves'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Revés
                </button>
                <button
                  type="button"
                  onClick={() => setPosition('derecha')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    position === 'derecha'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Derecha
                </button>
                <button
                  type="button"
                  onClick={() => setPosition('indiferente')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    position === 'indiferente'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ambos
                </button>
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>
          </form>

          {/* Players List Table */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Lista de Jugadores Registrados ({players.length}):</span>
              <span className="text-[10px] text-slate-500">Haz clic en la posición para cambiarla</span>
            </div>

            {players.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                No hay jugadores añadidos aún. Carga un preset o añade nombres arriba.
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                {players.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                      p.active
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-950/20 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs text-slate-500 w-5">#{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(p.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                          p.active
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                        title={p.active ? 'Jugador activo' : 'En pausa / No juega esta ronda'}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>
                      <span className={`text-xs font-bold ${p.active ? 'text-white' : 'text-slate-400 line-through'}`}>
                        {p.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Position switcher pills */}
                      <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleChangePosition(p.id, 'reves')}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.position === 'reves'
                              ? 'bg-purple-600 text-white'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          Revés
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChangePosition(p.id, 'derecha')}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.position === 'derecha'
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          Derecha
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChangePosition(p.id, 'indiferente')}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.position === 'indiferente'
                              ? 'bg-amber-600 text-white'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          Ambos
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeletePlayer(p.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center transition"
                        title="Eliminar jugador"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            {activePlayers.length} de {players.length} jugadores listos
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition"
          >
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
