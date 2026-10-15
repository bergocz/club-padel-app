'use client';

import React, { useState } from 'react';
import { Player, SkillCategory } from '../types';
import { LevelBadge } from './LevelBadge';
import { X, ShieldCheck, Search, Edit3, Check, UserCheck, AlertCircle, Save, Sparkles, Filter } from 'lucide-react';

interface AdminClubPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onUpdatePlayerLevel: (playerId: string, newLevel: number, newCategory: SkillCategory, isCertified: boolean, notes: string) => void;
  currentUser: Player;
}

export const AdminClubPanelModal: React.FC<AdminClubPanelModalProps> = ({
  isOpen,
  onClose,
  players,
  onUpdatePlayerLevel,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Edit fields
  const [editLevel, setEditLevel] = useState<number>(3.5);
  const [isCertified, setIsCertified] = useState<boolean>(true);
  const [coachNotes, setCoachNotes] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOpenEdit = (player: Player) => {
    setSelectedPlayer(player);
    setEditLevel(player.level);
    setIsCertified(player.levelCertifiedByClub ?? true);
    setCoachNotes(player.coachNotes || `Nivel validado por el Director Deportivo de Spadel Club el ${new Date().toLocaleDateString('es-ES')}.`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    let category: SkillCategory = 'iniciacion';
    if (editLevel >= 3.0 && editLevel < 5.0) category = 'medio';
    else if (editLevel >= 5.0) category = 'avanzado';

    onUpdatePlayerLevel(selectedPlayer.id, editLevel, category, isCertified, coachNotes);

    setSaveToast(`¡Nivel de ${selectedPlayer.name} actualizado a ${editLevel.toFixed(1)}!`);
    setTimeout(() => {
      setSaveToast(null);
      setSelectedPlayer(null);
    }, 1200);
  };

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.clubMemberNumber && p.clubMemberNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-yellow-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black shadow-md shadow-yellow-400/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Panel de Dirección Deportiva</h2>
                <span className="text-[10px] font-mono font-bold text-black bg-yellow-400 px-2 py-0.5 rounded-full">
                  ADMIN SPADEL
                </span>
              </div>
              <p className="text-xs text-zinc-400">Modificación y certificación oficial de niveles para socios del club</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {saveToast && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-yellow-400" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-sm space-y-6">
          {!selectedPlayer ? (
            <div>
              {/* Search Bar */}
              <div className="relative mb-5">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar socio por nombre o número (ej: SPADEL-1042)..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 mb-4 text-xs text-zinc-400 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p>
                  Como club, tienes control absoluto. Si ya conoces al socio o lo has evaluado en clase, puedes anular el resultado del test online y asignarle su nivel oficial definitivo.
                </p>
              </div>

              {/* Players Table / Cards */}
              <div className="space-y-2.5">
                {filteredPlayers.map(player => {
                  const isCurrent = player.id === currentUser.id;
                  return (
                    <div
                      key={player.id}
                      className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-yellow-500/40 hover:bg-zinc-900/80 transition flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1.5">
                            {player.name}
                            {isCurrent && (
                              <span className="text-[10px] text-yellow-400 font-mono font-bold bg-yellow-400/10 px-1.5 py-0.2 rounded border border-yellow-400/20">
                                Tu Perfil
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5 font-mono">
                            <span>{player.clubMemberNumber || 'SOC-SPADEL'}</span>
                            <span>•</span>
                            <span>{player.sidePreference}</span>
                            <span>•</span>
                            <span>{player.hand}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <LevelBadge
                          level={player.level}
                          category={player.category}
                          size="sm"
                          isCertified={player.levelCertifiedByClub}
                        />

                        <button
                          onClick={() => handleOpenEdit(player)}
                          className="px-3 py-1.5 rounded-xl bg-yellow-400/10 hover:bg-yellow-400 text-yellow-400 hover:text-black font-bold text-xs border border-yellow-400/30 transition flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modificar Nivel</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Edit Player Screen */
            <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPlayer.avatar}
                    alt={selectedPlayer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                  />
                  <div>
                    <h3 className="font-bold text-base text-white">{selectedPlayer.name}</h3>
                    <p className="text-xs text-zinc-400 font-mono">{selectedPlayer.clubMemberNumber} • Socio Spadel Club</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlayer(null)}
                  className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
                >
                  Volver al listado
                </button>
              </div>

              {/* Slider for Level Adjustment */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                      Nuevo Nivel Asignado por el Club
                    </label>
                    <span className="text-[11px] text-zinc-400">Escala oficial de pádel (1.0 — 7.0)</span>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black font-mono text-yellow-400">
                      {editLevel.toFixed(1)}
                    </div>
                  </div>
                </div>

                <input
                  type="range"
                  min="1.0"
                  max="7.0"
                  step="0.1"
                  value={editLevel}
                  onChange={e => setEditLevel(parseFloat(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer mb-3"
                />

                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>1.0 (Iniciación)</span>
                  <span>3.0 (Inicio Medio)</span>
                  <span>5.0 (Avanzado)</span>
                  <span>7.0 (Competición Pro)</span>
                </div>
              </div>

              {/* Official Certification Toggle */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className={`w-6 h-6 ${isCertified ? 'text-yellow-400' : 'text-zinc-600'}`} />
                  <div>
                    <div className="text-xs font-bold text-white">Certificar Nivel Oficial por Spadel Club</div>
                    <div className="text-[11px] text-zinc-400">
                      Muestra la insignia oficial de nivel verificado por los monitores del club.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCertified(!isCertified)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    isCertified ? 'bg-yellow-400' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black transition-transform ${
                      isCertified ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Notes from the Coach / Director */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Observaciones Técnicas del Monitor / Director
                </label>
                <textarea
                  value={coachNotes}
                  onChange={e => setCoachNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-yellow-400 resize-none placeholder-zinc-500"
                  placeholder="Ej: Evaluado en clase de pádel. Excelente salida de pared y víbora, subido a nivel 4.2."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlayer(null)}
                  className="flex-1 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs shadow-xl shadow-yellow-400/20 transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Nivel en Spadel Club</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
