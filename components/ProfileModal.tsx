'use client';

import React, { useState } from 'react';
import { Player } from '../types';
import { LevelBadge } from './LevelBadge';
import { 
  X, Camera, Sparkles, Award, Shield, Check, Flame, Trophy, ShieldCheck,
  TrendingUp, Users, Calendar, MapPin, Zap, ArrowUpRight, ArrowDownRight,
  UserCheck, History, HeartHandshake, Info
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player; // Puede ser el usuario actual o cualquier otro socio
  currentUser: Player;
  onSaveProfile?: (updated: Partial<Player>) => void;
  onOpenQuiz?: () => void;
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
  player,
  currentUser,
  onSaveProfile,
  onOpenQuiz,
}) => {
  const isMe = player.id === currentUser.id;

  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'partners' | 'edit'>('overview');
  
  // Editable fields for when viewing own profile
  const [name, setName] = useState(player.name);
  const [avatar, setAvatar] = useState(player.avatar);
  const [hand, setHand] = useState<'Derecha' | 'Zurdo'>(player.hand);
  const [sidePreference, setSidePreference] = useState<'Revés' | 'Drive' | 'Indiferente'>(player.sidePreference);
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveProfile) {
      onSaveProfile({
        name,
        avatar,
        hand,
        sidePreference
      });
      setSavedMessage(true);
      setTimeout(() => {
        setSavedMessage(false);
        setActiveTab('overview');
      }, 1000);
    }
  };

  const reliability = player.reliabilityPercent || 80;
  const history = player.matchHistory || [];
  const partners = player.frequentPartners || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border-2 border-yellow-400/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/90">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400 shrink-0 shadow-md">
              <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">{player.name}</h2>
                {isMe && (
                  <span className="text-[9px] font-mono font-bold bg-yellow-400 text-black px-1.5 py-0.2 rounded">
                    MI PERFIL
                  </span>
                )}
              </div>
              <div className="text-xs text-zinc-400 font-mono flex items-center gap-2 mt-0.5">
                <span className="text-yellow-400 font-bold">{player.clubMemberNumber || 'ESPADEL-SOCIO'}</span>
                <span>•</span>
                <span>{player.sidePreference}</span>
                <span>•</span>
                <span>{player.hand === 'Zurdo' ? 'Zurdo' : 'Diestro'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside Profile */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-zinc-900 bg-zinc-950 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nivel & Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`pb-3 font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'matches'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Partidos Jugados ({history.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`pb-3 font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'partners'
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Parejas Habituales</span>
          </button>

          {isMe && (
            <button
              onClick={() => setActiveTab('edit')}
              className={`pb-3 font-bold transition border-b-2 flex items-center gap-1.5 ml-auto ${
                activeTab === 'edit'
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <span>Editar Datos</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {/* TAB 1: OVERVIEW & PLAYTOMIC LEVEL METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Official Level Card & Certified Badge */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
                      Nivel Oficial Espadel Club
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-4xl font-black font-mono text-white">
                        {player.level.toFixed(2)}
                      </span>
                      <LevelBadge
                        level={player.level}
                        category={player.category}
                        size="md"
                        isCertified={player.levelCertifiedByClub}
                      />
                    </div>
                  </div>

                  {isMe && onOpenQuiz && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenQuiz();
                      }}
                      className="px-4 py-2 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-yellow-400/20 self-start sm:self-auto"
                    >
                      <Sparkles className="w-4 h-4" />
                      Recalibrar con Test
                    </button>
                  )}
                </div>

                {player.levelCertifiedByClub && (
                  <div className="mt-4 p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-xs text-yellow-300 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-yellow-400" />
                    <div>
                      <div className="font-bold text-[11px]">Nivel Certificado por Dirección Deportiva</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        {player.coachNotes || 'Evaluación técnica validada directamente en pista por el club.'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PLAYTOMIC STYLE RELIABILITY & POINT SYSTEM */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                      Fiabilidad de Nivel (Estilo Playtomic)
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-yellow-400">
                    {reliability}% Fiable
                  </span>
                </div>

                {/* Progress Gauge */}
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-500"
                      style={{ width: `${reliability}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>20% (Calibración)</span>
                    <span>50% (Consolidando)</span>
                    <span>99% (Consolidado)</span>
                  </div>
                </div>

                {/* Algorithmic Explanation for this Player */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-zinc-800/80 text-xs text-zinc-300 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-yellow-400" />
                    Dinámica de Puntos para {player.name.split(' ')[0]}:
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Al acumular <strong>{player.matchesPlayed} partidos</strong>, el K-factor de ajuste es de{' '}
                    <strong className="text-yellow-400">
                      {player.matchesPlayed > 50 ? '±0.015' : player.matchesPlayed > 25 ? '±0.030' : '±0.060'} puntos
                    </strong>{' '}
                    por partido. Cuantos más partidos juegues, menos variará tu nivel porque tu juego está más contrastado.
                  </p>
                </div>
              </div>

              {/* Stats Grid: Matches Won, Lost, Win Rate, Streak */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5">
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase">Victorias</span>
                  <span className="text-2xl font-black text-yellow-400 font-mono mt-0.5 block">
                    {player.matchesWon}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">en Espadel</span>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5">
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase">Derrotas</span>
                  <span className="text-2xl font-black text-zinc-400 font-mono mt-0.5 block">
                    {player.matchesLost}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">disputadas</span>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5">
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase">Win Rate</span>
                  <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                    {player.winRate}%
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">efectividad</span>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5">
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase">Racha Actual</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">
                    {player.currentStreak || 0}W
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">consecutivas</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARTIDOS JUGADOS & CON QUÉ PAREJAS JUGÓ */}
          {activeTab === 'matches' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Historial de Partidos y Parejas
                </h3>
                <span className="text-xs font-mono text-zinc-500">
                  {history.length} partidos registrados
                </span>
              </div>

              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map(item => (
                    <div
                      key={item.id}
                      className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3 hover:border-yellow-400/40 transition"
                    >
                      {/* Match Meta: Date, Court & Result */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black font-mono uppercase ${
                            item.result === 'won'
                              ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30'
                              : 'bg-red-400/10 text-red-400 border border-red-400/30'
                          }`}>
                            {item.result === 'won' ? 'Victoria' : 'Derrota'}
                          </span>
                          <span className="text-sm font-black font-mono text-white">
                            {item.score}
                          </span>
                        </div>

                        {/* Level Delta Playtomic Badge */}
                        <div className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 ${
                          item.levelDelta >= 0
                            ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          {item.levelDelta >= 0 ? `+${item.levelDelta.toFixed(3)}` : item.levelDelta.toFixed(3)} nivel
                        </div>
                      </div>

                      {/* Partners Details */}
                      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {/* Team (User + Partner) */}
                        <div>
                          <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1.5">
                            Tu Pareja en este partido:
                          </span>
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.partner.avatar}
                              alt={item.partner.name}
                              className="w-8 h-8 rounded-full object-cover border border-yellow-400"
                            />
                            <div>
                              <div className="font-bold text-white flex items-center gap-1">
                                {item.partner.name}
                                <span className="text-[10px] font-mono text-yellow-400">
                                  ({item.partner.level.toFixed(1)})
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-zinc-400">
                                Posición: {item.partner.sidePreference}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Opponents */}
                        <div>
                          <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1.5">
                            Rivales Enfrentados:
                          </span>
                          <div className="flex items-center gap-2">
                            {item.opponents.map(opp => (
                              <div key={opp.id} className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded-xl border border-zinc-800">
                                <img src={opp.avatar} alt={opp.name} className="w-5 h-5 rounded-full object-cover" />
                                <span className="text-[11px] text-zinc-300 font-semibold">{opp.name.split(' ')[0]}</span>
                                <span className="text-[9px] font-mono text-zinc-500">({opp.level.toFixed(1)})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer: Court & Dynamic Note */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                        <span>{item.courtName} • {item.date}</span>
                        <span className="text-[10px] text-zinc-400">{item.kFactorExplanation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800 text-zinc-400 space-y-2">
                  <Users className="w-8 h-8 mx-auto text-zinc-600" />
                  <p className="text-xs">Este socio aún no tiene partidos registrados en la plataforma.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAREJAS HABITUALES */}
          {activeTab === 'partners' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Compañeros de Juego Habituales
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Socios con los que {player.name.split(' ')[0]} ha compartido más partidos en Espadel Club
                </p>
              </div>

              {partners.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {partners.map(p => (
                    <div
                      key={p.partnerId}
                      className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-yellow-400/40 transition"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={p.partnerAvatar}
                          alt={p.partnerName}
                          className="w-10 h-10 rounded-full object-cover border border-yellow-400 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-white text-xs">{p.partnerName}</h4>
                          <span className="text-[10px] font-mono text-yellow-400 font-semibold">
                            Nivel {p.partnerLevel.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-black/50 text-center font-mono text-xs">
                        <div>
                          <span className="text-[9px] text-zinc-500 block">Juntos</span>
                          <span className="font-bold text-white">{p.matchesTogether}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">Victorias</span>
                          <span className="font-black text-yellow-400">{p.winsTogether}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">Efectividad</span>
                          <span className="font-bold text-emerald-400">{p.winRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800 text-zinc-400 space-y-2">
                  <HeartHandshake className="w-8 h-8 mx-auto text-zinc-600" />
                  <p className="text-xs">No hay historial de parejas acumulado aún.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EDIT PROFILE (ONLY IF ME) */}
          {activeTab === 'edit' && isMe && (
            <form onSubmit={handleSave} className="space-y-5">
              {/* Avatar Selection */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3 group">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400 shadow-xl"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                    <Camera className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Elegir foto:</span>
                  <div className="flex gap-1.5">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset)}
                        className={`w-7 h-7 rounded-full overflow-hidden border transition ${
                          avatar === preset ? 'border-yellow-400 ring-2 ring-yellow-400/40 scale-110' : 'border-zinc-800 opacity-60'
                        }`}
                      >
                        <img src={preset} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

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
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Mano Hábil</label>
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
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Posición en Pista</label>
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

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs shadow-xl shadow-yellow-400/20 transition flex items-center justify-center gap-2"
              >
                {savedMessage ? (
                  <>
                    <Check className="w-4 h-4" /> ¡Ficha Guardada con Éxito!
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
