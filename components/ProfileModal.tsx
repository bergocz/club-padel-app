'use client';

import React, { useState } from 'react';
import { Player } from '../types';
import { LevelBadge } from './LevelBadge';
import { X, Camera, Sparkles, Award, Shield, Check, Flame, Trophy, ShieldCheck } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Player;
  onSaveProfile: (updated: Partial<Player>) => void;
  onOpenQuiz: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  onOpenQuiz,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [hand, setHand] = useState<'Derecha' | 'Zurdo'>(currentUser.hand);
  const [sidePreference, setSidePreference] = useState<'Revés' | 'Drive' | 'Indiferente'>(currentUser.sidePreference);
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name,
      avatar,
      hand,
      sidePreference
    });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/80">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Ficha del Socio</h2>
            <p className="text-xs text-zinc-400">Perfil verificado en la base de datos de Espadel Club</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Avatar Section */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3 group">
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400 shadow-xl shadow-yellow-400/10"
              />
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                <Camera className="w-6 h-6 text-yellow-400" />
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-zinc-500 uppercase font-mono">Elegir foto:</span>
              <div className="flex gap-1.5">
                {AVATAR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(p)}
                    className={`w-7 h-7 rounded-full overflow-hidden border transition ${
                      avatar === p ? 'border-yellow-400 ring-2 ring-yellow-400/40 scale-110' : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-zinc-400">
              Socio Oficial: <span className="font-mono text-yellow-400 font-bold">{currentUser.clubMemberNumber}</span>
            </div>
          </div>

          {/* Official Level Card */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">Nivel Oficial</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-black font-mono text-white">{currentUser.level.toFixed(1)}</span>
                  <LevelBadge
                    level={currentUser.level}
                    category={currentUser.category}
                    size="md"
                    isCertified={currentUser.levelCertifiedByClub}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuiz();
                }}
                className="px-3.5 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 hover:bg-yellow-400 hover:text-black text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Recalcular Nivel
              </button>
            </div>

            {/* Coach Certification Info */}
            {currentUser.levelCertifiedByClub && (
              <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-xs text-yellow-300 flex items-start gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-yellow-400" />
                <div>
                  <div className="font-bold text-[11px]">Nivel Certificado por Dirección Deportiva</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {currentUser.coachNotes || 'Evaluación técnica validada directamente por el club.'}
                  </div>
                </div>
              </div>
            )}

            {/* Match Stats */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800 text-center">
              <div className="bg-zinc-900 rounded-2xl p-2.5 border border-zinc-800">
                <div className="text-xs text-zinc-400 font-mono">Partidos Disputados</div>
                <div className="text-lg font-bold text-white font-mono">{currentUser.matchesPlayed}</div>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-2.5 border border-zinc-800">
                <div className="text-xs text-zinc-400 font-mono">Efectividad Victoria</div>
                <div className="text-lg font-bold text-yellow-400 font-mono">{currentUser.winRate}%</div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Nombre y Apellidos</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Mano Dominante</label>
                <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setHand('Derecha')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      hand === 'Derecha' ? 'bg-yellow-400 text-black shadow' : 'text-zinc-400'
                    }`}
                  >
                    Diestro
                  </button>
                  <button
                    type="button"
                    onClick={() => setHand('Zurdo')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      hand === 'Zurdo' ? 'bg-yellow-400 text-black shadow' : 'text-zinc-400'
                    }`}
                  >
                    Zurdo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Lado Preferido</label>
                <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setSidePreference('Revés')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      sidePreference === 'Revés' ? 'bg-yellow-400 text-black shadow' : 'text-zinc-400'
                    }`}
                  >
                    Revés
                  </button>
                  <button
                    type="button"
                    onClick={() => setSidePreference('Drive')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      sidePreference === 'Drive' ? 'bg-yellow-400 text-black shadow' : 'text-zinc-400'
                    }`}
                  >
                    Drive
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs shadow-xl shadow-yellow-400/20 transition flex items-center justify-center gap-2"
            >
              {savedMessage ? (
                <>
                  <Check className="w-4 h-4" /> ¡Ficha Guardada con Éxito!
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
