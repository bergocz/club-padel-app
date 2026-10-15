'use client';

import React, { useState, useRef } from 'react';
import { Player, SkillCategory, FrequentPartner, PlayerMatchHistoryItem } from '../types';
import { LevelBadge } from './LevelBadge';
import {
  Trophy, Flame, TrendingUp, Calendar, Users, Camera, Sparkles, Check,
  CreditCard, QrCode, ShieldCheck, ChevronRight, Edit3, ArrowUpRight,
  ArrowDownRight, Upload, Link as LinkIcon, RefreshCw, Award, Activity,
  Zap, HeartHandshake, Dumbbell, Clock, Crosshair, ChevronDown, CheckCircle2,
  Wallet, ShieldAlert
} from 'lucide-react';

interface UserProfileViewProps {
  currentUser: Player;
  onSaveProfile: (updated: Partial<Player>) => void;
  onOpenQuiz: () => void;
  onNavigateToRanking: () => void;
  onNavigateToCourts: () => void;
  onSelectPlayerForDetail?: (player: Player) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
];

const POPULAR_RACKETS = [
  'Bullpadel Vertex 04 2026',
  'Bullpadel Hack 03',
  'Babolat Technical Viper 2026',
  'Babolat Air Viper',
  'Head Extreme Pro',
  'Head Speed Pro X',
  'Nox AT10 Genius 18K (Agustín Tapia)',
  'Nox ML10 Pro Cup (Miguel Lamperti)',
  'Adidas Metalbone 3.3 (Ale Galán)',
  'Siux Electra ST2 (Franco Stupaczuk)',
  'Wilson Bela Pro v2'
];

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  onSaveProfile,
  onOpenQuiz,
  onNavigateToRanking,
  onNavigateToCourts,
  onSelectPlayerForDetail,
}) => {
  const [profileTab, setProfileTab] = useState<'matches' | 'partners' | 'equipment' | 'achievements'>('matches');
  const [matchFilter, setMatchFilter] = useState<'all' | 'won' | 'lost'>('all');

  // Photo change state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);

  // Form states
  const [editName, setEditName] = useState(currentUser.name);
  const [editHand, setEditHand] = useState<'Derecha' | 'Zurdo'>(currentUser.hand);
  const [editSide, setEditSide] = useState<'Revés' | 'Drive' | 'Indiferente'>(currentUser.sidePreference);
  const [editRacket, setEditRacket] = useState(currentUser.racket || 'Bullpadel Vertex 04 2026');
  const [editPreferredTime, setEditPreferredTime] = useState(currentUser.preferredTime || 'Tardes (18:30 - 21:00)');
  const [walletBalance, setWalletBalance] = useState(currentUser.walletBalance ?? 42.50);
  const [showWalletSuccess, setShowWalletSuccess] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Handle local file photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onSaveProfile({ avatar: reader.result });
          setIsPhotoModalOpen(false);
          showToast('¡Foto de perfil actualizada correctamente desde tu dispositivo!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    onSaveProfile({ avatar: url });
    setIsPhotoModalOpen(false);
    showToast('¡Avatar de perfil actualizado!');
  };

  const handleApplyCustomUrl = () => {
    if (customPhotoUrl.trim()) {
      onSaveProfile({ avatar: customPhotoUrl.trim() });
      setCustomPhotoUrl('');
      setIsPhotoModalOpen(false);
      showToast('¡Foto de perfil actualizada!');
    }
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: editName,
      hand: editHand,
      sidePreference: editSide,
      racket: editRacket,
      preferredTime: editPreferredTime,
    });
    setIsEditInfoOpen(false);
    showToast('¡Datos personales y de juego guardados!');
  };

  const handleAddBalance = (amount: number) => {
    const newBal = walletBalance + amount;
    setWalletBalance(newBal);
    onSaveProfile({ walletBalance: newBal });
    setShowWalletSuccess(true);
    setTimeout(() => setShowWalletSuccess(false), 3000);
  };

  const matches = currentUser.matchHistory || [];
  const filteredMatches = matches.filter(m => {
    if (matchFilter === 'won') return m.result === 'won';
    if (matchFilter === 'lost') return m.result === 'lost';
    return true;
  });

  const partners = currentUser.frequentPartners || [];
  const achievements = currentUser.achievements || [];
  const reliability = currentUser.reliabilityPercent ?? 82;
  const matchesWon = currentUser.matchesWon ?? Math.round(currentUser.matchesPlayed * (currentUser.winRate / 100));
  const matchesLost = currentUser.matchesLost ?? (currentUser.matchesPlayed - matchesWon);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-yellow-400 text-black px-4 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 border border-black/20 animate-in slide-in-from-bottom-3 duration-200 text-xs">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 1. HERO HEADER: PLAYER PROFILE & DIGITAL CLUB MEMBERSHIP */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
          {/* Left: Avatar, Name, Badges & Quick Stats */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar with Camera Trigger */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-yellow-400 p-1 bg-black shadow-xl ring-4 ring-yellow-400/10">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Camera Hover Button */}
              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute -bottom-2 -right-2 bg-yellow-400 hover:bg-yellow-300 text-black p-2.5 rounded-2xl shadow-xl transition transform hover:scale-110 flex items-center gap-1.5 border-2 border-black"
                title="Cambiar foto de perfil"
              >
                <Camera className="w-4 h-4 stroke-[2.5]" />
                <span className="text-[10px] font-black uppercase font-mono hidden sm:inline">Cambiar</span>
              </button>
            </div>

            {/* Player Info & Titles */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-mono font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Mi Perfil Oficial
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                  {currentUser.clubMemberNumber || 'ESPADEL-1042'}
                </span>
                {currentUser.levelCertifiedByClub && (
                  <span className="text-[10px] font-mono font-bold bg-emerald-400/15 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Nivel Homologado
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {currentUser.name}
                </h1>
                <button
                  onClick={() => setIsEditInfoOpen(true)}
                  className="text-zinc-500 hover:text-yellow-400 transition p-1"
                  title="Editar datos de perfil"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* Position, Hand & Racket details */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-zinc-400 font-mono">
                <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Posición: <strong className="text-yellow-400 font-bold">{currentUser.sidePreference}</strong>
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Mano: <strong className="text-white">{currentUser.hand}</strong>
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Pala: <strong className="text-yellow-300">{currentUser.racket || 'Bullpadel Vertex 04'}</strong>
                </span>
              </div>

              {/* Level Badge and Category display */}
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <LevelBadge
                  level={currentUser.level}
                  category={currentUser.category}
                  size="md"
                  isCertified={currentUser.levelCertifiedByClub}
                />

                <button
                  onClick={onOpenQuiz}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-400/15 hover:bg-yellow-400 hover:text-black border border-yellow-400/30 text-yellow-300 text-xs font-bold transition font-mono"
                  title="Repetir test de 8 preguntas"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Recalibrar Nivel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Digital Member Card (Carnet de Socio Espadel Club) */}
          <div className="w-full lg:w-80 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-2 border-yellow-400/40 rounded-3xl p-5 shadow-xl relative overflow-hidden self-stretch flex flex-col justify-between">
            {/* Card Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black text-xs">
                    ⚡
                  </span>
                  <div>
                    <h3 className="font-black text-white text-xs tracking-wider uppercase">
                      Espadel Club Pass
                    </h3>
                    <p className="text-[9px] font-mono text-zinc-500">Carnet Digital de Socio</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono uppercase bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400/30 font-bold">
                  {currentUser.membershipType || 'Socio Oro VIP'}
                </span>
              </div>

              {/* QR and Access code */}
              <div className="bg-black/60 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between mb-3">
                <div className="space-y-1">
                  <div className="text-[10px] text-zinc-400 font-mono">ID de Acceso a Pistas</div>
                  <div className="text-sm font-mono font-black text-yellow-400 tracking-wider">
                    {currentUser.clubMemberNumber || 'ESPADEL-1042'}
                  </div>
                  <div className="text-[9px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Acceso Puertas y Luces OK
                  </div>
                </div>
                <div className="w-12 h-12 bg-white rounded-xl p-1 shrink-0 flex items-center justify-center shadow-md">
                  <QrCode className="w-10 h-10 text-black" />
                </div>
              </div>
            </div>

            {/* Wallet & Balance footer */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 font-mono block">Monedero Pistas:</span>
                <span className="font-mono font-black text-white text-sm">{walletBalance.toFixed(2)}€</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleAddBalance(20)}
                  className="px-2.5 py-1 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-[10px] font-mono transition"
                  title="Añadir 20€ para pagar partidos"
                >
                  + Recargar 20€
                </button>
              </div>
            </div>
            {showWalletSuccess && (
              <div className="text-[10px] text-emerald-400 font-mono text-center mt-1 animate-pulse">
                ✓ Saldo actualizado correctamente
              </div>
            )}
          </div>
        </div>

        {/* 2. STATS BAR: PLAYTOMIC LEVEL, VICTORIAS, WIN RATE, RANKING */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-zinc-900">
          {/* Metric 1: Victorias Oficiales */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 text-center flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-400 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Victorias
            </span>
            <div className="my-1">
              <span className="text-2xl font-black font-mono text-yellow-400">{matchesWon}</span>
              <span className="text-[10px] text-zinc-500 font-mono block">partidos ganados</span>
            </div>
            <button
              onClick={onNavigateToRanking}
              className="text-[10px] text-yellow-400 hover:underline font-mono font-bold flex items-center justify-center gap-0.5"
            >
              Ver Ranking <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Metric 2: Partidos Jugados */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 text-center flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-400 flex items-center justify-center gap-1">
              <Activity className="w-3.5 h-3.5 text-sky-400" /> Jugados
            </span>
            <div className="my-1">
              <span className="text-2xl font-black font-mono text-white">{currentUser.matchesPlayed}</span>
              <span className="text-[10px] text-zinc-500 font-mono block">({matchesLost} derrotas)</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">En Espadel Club</span>
          </div>

          {/* Metric 3: Win Rate */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 text-center flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-400 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> % Victorias
            </span>
            <div className="my-1">
              <span className="text-2xl font-black font-mono text-emerald-400">{currentUser.winRate}%</span>
              <span className="text-[10px] text-zinc-500 font-mono block">efectividad</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${currentUser.winRate}%` }}
              />
            </div>
          </div>

          {/* Metric 4: Racha Actual */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 text-center flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-400 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Racha Actual
            </span>
            <div className="my-1">
              <span className="text-2xl font-black font-mono text-amber-400 flex items-center justify-center gap-1">
                {currentUser.currentStreak ?? 3}
                <span className="text-xs">🔥</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">victorias seguidas</span>
            </div>
            <span className="text-[10px] text-amber-400/90 font-mono font-bold">¡En racha positiva!</span>
          </div>

          {/* Metric 5: Fiabilidad Playtomic */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 text-center flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" /> Fiabilidad
            </span>
            <div className="my-1">
              <span className="text-2xl font-black font-mono text-yellow-400">{reliability}%</span>
              <span className="text-[10px] text-emerald-400 font-mono block">Nivel Consolidado</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-yellow-400 h-full rounded-full"
                style={{ width: `${reliability}%` }}
              />
            </div>
          </div>

          {/* Metric 6: Posición en Ranking */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 text-center flex flex-col justify-between">
            <span className="text-[11px] font-mono text-zinc-400 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-yellow-400" /> Ranking Club
            </span>
            <div className="my-1">
              <span className="text-2xl font-black font-mono text-white">#6</span>
              <span className="text-[10px] text-zinc-500 font-mono block">Top 10 de Espadel</span>
            </div>
            <button
              onClick={onNavigateToRanking}
              className="text-[10px] text-yellow-400 hover:underline font-mono font-bold"
            >
              Ver tabla completa →
            </button>
          </div>
        </div>
      </div>

      {/* 3. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setProfileTab('matches')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition flex items-center gap-2 shrink-0 ${
            profileTab === 'matches'
              ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Partidos Jugados ({matches.length})</span>
        </button>

        <button
          onClick={() => setProfileTab('partners')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition flex items-center gap-2 shrink-0 ${
            profileTab === 'partners'
              ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Parejas Habituales ({partners.length})</span>
        </button>

        <button
          onClick={() => setProfileTab('equipment')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition flex items-center gap-2 shrink-0 ${
            profileTab === 'equipment'
              ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Pala & Ficha Técnica</span>
        </button>

        <button
          onClick={() => setProfileTab('achievements')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition flex items-center gap-2 shrink-0 ${
            profileTab === 'achievements'
              ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Vitrina de Logros ({achievements.filter(a => a.unlocked).length}/{achievements.length})</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB A: MATCH HISTORY */}
      {profileTab === 'matches' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 rounded-3xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 mr-2">Filtrar Historial:</span>
              <button
                onClick={() => setMatchFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  matchFilter === 'all' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Todos ({matches.length})
              </button>
              <button
                onClick={() => setMatchFilter('won')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  matchFilter === 'won' ? 'bg-emerald-400 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Victorias ({matches.filter(m => m.result === 'won').length})
              </button>
              <button
                onClick={() => setMatchFilter('lost')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  matchFilter === 'lost' ? 'bg-red-400 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Derrotas ({matches.filter(m => m.result === 'lost').length})
              </button>
            </div>

            <button
              onClick={onNavigateToCourts}
              className="text-xs font-mono font-bold text-yellow-400 hover:underline flex items-center gap-1 self-start sm:self-center"
            >
              Apuntarse a un partido abierto ahora →
            </button>
          </div>

          {/* Match Cards List */}
          {filteredMatches.length > 0 ? (
            <div className="space-y-3">
              {filteredMatches.map(match => (
                <div
                  key={match.id}
                  className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 shadow-xl transition space-y-4"
                >
                  {/* Top row: Status, Date, Court & Sets Score */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-900 pb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-black px-2.5 py-1 rounded-xl uppercase tracking-wider ${
                          match.result === 'won'
                            ? 'bg-emerald-400/15 text-emerald-400 border border-emerald-400/30'
                            : 'bg-red-400/15 text-red-400 border border-red-400/30'
                        }`}
                      >
                        {match.result === 'won' ? 'Victoria' : 'Derrota'}
                      </span>
                      <span className="font-mono text-xs text-zinc-400">{match.date}</span>
                      <span className="text-zinc-700">•</span>
                      <span className="font-bold text-xs text-zinc-300">{match.courtName}</span>
                    </div>

                    {/* Set Score & Level Delta */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-zinc-500 font-mono block">Resultado:</span>
                        <span className="text-base font-black font-mono text-white tracking-wider">
                          {match.score}
                        </span>
                      </div>

                      <div
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl font-mono text-xs font-black border ${
                          match.levelDelta >= 0
                            ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                            : 'bg-red-400/10 text-red-400 border-red-400/30'
                        }`}
                      >
                        {match.levelDelta >= 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {match.levelDelta >= 0 ? `+${match.levelDelta.toFixed(3)}` : match.levelDelta.toFixed(3)} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle row: Dupla (Tú + Pareja) vs Rivales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-black/40 border border-zinc-900 rounded-2xl p-4">
                    {/* Tu Equipo */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                        Tu Pareja ({match.userSidePlayed || currentUser.sidePreference})
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Tú */}
                        <div className="flex items-center gap-2">
                          <img
                            src={currentUser.avatar}
                            alt="Tú"
                            className="w-8 h-8 rounded-full object-cover border border-yellow-400"
                          />
                          <div className="text-xs">
                            <span className="font-bold text-white block">Tú</span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {currentUser.level.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <span className="text-zinc-600 font-bold">+</span>

                        {/* Compañero */}
                        <div className="flex items-center gap-2">
                          <img
                            src={match.partner.avatar}
                            alt={match.partner.name}
                            className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                          />
                          <div className="text-xs">
                            <span className="font-bold text-yellow-300 block">
                              {match.partner.name}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              Nivel {match.partner.level.toFixed(2)} • {match.partner.sidePreference || 'Compañero'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rivales */}
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-zinc-900 pt-3 md:pt-0 md:pl-4">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                        Rivales Enfrentados
                      </div>
                      <div className="flex items-center gap-3">
                        {match.opponents.map((opp, idx) => (
                          <div key={opp.id || idx} className="flex items-center gap-1.5 text-xs">
                            <img
                              src={opp.avatar}
                              alt={opp.name}
                              className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                            />
                            <div>
                              <span className="font-medium text-zinc-300 block truncate max-w-[90px]">
                                {opp.name.split(' ')[0]}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                {opp.level.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom explanation */}
                  {match.kFactorExplanation && (
                    <div className="text-[11px] font-mono text-zinc-400 bg-zinc-900/50 px-3 py-2 rounded-xl flex items-center gap-2">
                      <span className="text-yellow-400">⚡ Algoritmo Playtomic:</span>
                      <span>{match.kFactorExplanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
              <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <h4 className="text-white font-bold text-sm">No hay partidos registrados en este filtro</h4>
              <p className="text-zinc-500 text-xs mt-1">
                Juega tu próximo partido en Espadel Club para seguir sumando victorias a tu ranking.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB B: FREQUENT PARTNERS */}
      {profileTab === 'partners' && (
        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-yellow-400" />
              <span>Tus Parejas de Juego Habituales en Espadel Club</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Estadísticas conjuntas con los compañeros con los que más partidos has compartido.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partners.map(p => (
              <div
                key={p.partnerId}
                className="bg-zinc-950 border border-zinc-800 hover:border-yellow-400/40 rounded-3xl p-5 shadow-xl transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={p.partnerAvatar}
                      alt={p.partnerName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-yellow-400/60"
                    />
                    <div>
                      <h4 className="font-black text-white text-base">{p.partnerName}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono bg-yellow-400/15 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/30 font-bold">
                          Nivel {p.partnerLevel.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">Socio Club</span>
                      </div>
                    </div>
                  </div>

                  {/* Pair Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-900 text-center">
                    <div className="bg-zinc-900/60 p-2 rounded-xl">
                      <span className="text-[10px] text-zinc-500 font-mono block">Juntos</span>
                      <span className="font-mono font-bold text-white text-sm">{p.matchesTogether}</span>
                    </div>
                    <div className="bg-zinc-900/60 p-2 rounded-xl">
                      <span className="text-[10px] text-zinc-500 font-mono block">Victorias</span>
                      <span className="font-mono font-bold text-yellow-400 text-sm">{p.winsTogether}</span>
                    </div>
                    <div className="bg-zinc-900/60 p-2 rounded-xl">
                      <span className="text-[10px] text-zinc-500 font-mono block">% Win</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">{p.winRate}%</span>
                    </div>
                  </div>

                  {p.bestWinScore && (
                    <div className="mt-3 text-[11px] font-mono text-zinc-400 bg-zinc-900/40 px-3 py-1.5 rounded-xl text-center">
                      Mejor resultado: <strong className="text-white">{p.bestWinScore}</strong>
                    </div>
                  )}
                </div>

                <button
                  onClick={onNavigateToCourts}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-yellow-400 hover:text-black border border-zinc-800 text-zinc-300 text-xs font-black transition flex items-center justify-center gap-2"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Invitar a Partido en Pista</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB C: EQUIPMENT & TECHNICAL SHEET */}
      {profileTab === 'equipment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Equipamiento de Padel */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-yellow-400" />
                <span>Pala y Material de Juego</span>
              </h3>
              <button
                onClick={() => setIsEditInfoOpen(true)}
                className="text-xs font-mono font-bold text-yellow-400 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" /> Editar
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    Pala Principal
                  </span>
                  <span className="text-base font-black text-white">
                    {currentUser.racket || 'Bullpadel Vertex 04 2026'}
                  </span>
                  <span className="text-xs text-yellow-400 font-mono block mt-0.5">
                    Forma Diamante • Potencia y Control
                  </span>
                </div>
                <span className="text-3xl">🎾</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3.5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    Lado Habitual
                  </span>
                  <span className="text-sm font-black text-yellow-400 font-mono mt-1 block">
                    {currentUser.sidePreference}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {currentUser.sidePreference === 'Revés' ? 'Zona izquierda en pista' : 'Zona derecha en pista'}
                  </span>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3.5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    Mano Hábil
                  </span>
                  <span className="text-sm font-black text-white font-mono mt-1 block">
                    {currentUser.hand === 'Zurdo' ? 'Zurdo' : 'Diestro (Mano Derecha)'}
                  </span>
                  <span className="text-[10px] text-zinc-400">Empuñadura continental</span>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                  Horario Favorito en Espadel Club
                </span>
                <span className="text-sm font-bold text-zinc-200 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                  {currentUser.preferredTime || 'Tardes (18:30 - 21:00)'}
                </span>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                  Pista Preferida del Club
                </span>
                <span className="text-sm font-bold text-zinc-200 mt-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  {currentUser.favoriteCourt || 'Pista 4 — Central Vertical (Nave B)'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Radar de Habilidades Técnicas */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-yellow-400" />
                <span>Radar de Rendimiento Técnico</span>
              </h3>
              <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                Puntuaciones 1 - 10
              </span>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Volea y Juego en Red', score: currentUser.radarStats.volea, color: 'bg-yellow-400' },
                { label: 'Técnica de Golpeo y Fondo', score: currentUser.radarStats.tecnica, color: 'bg-yellow-400' },
                { label: 'Táctica y Posicionamiento', score: currentUser.radarStats.tactica, color: 'bg-yellow-400' },
                { label: 'Defensa y Salidas de Pared', score: currentUser.radarStats.paredes, color: 'bg-yellow-400' },
                { label: 'Juego Aéreo (Bandeja / Smash)', score: currentUser.radarStats.aereo, color: 'bg-yellow-400' },
              ].map(stat => (
                <div key={stat.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-300 font-semibold">{stat.label}</span>
                    <span className="font-black text-white">{stat.score} / 10</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full rounded-full ${stat.color}`}
                      style={{ width: `${stat.score * 10}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                <span className="font-bold text-white block">Evaluación de Entrenadores Espadel:</span>
                <p className="leading-relaxed text-[11px]">
                  {currentUser.coachNotes || 'Jugador con gran solidez en volea y revés. Nivel consolidado apto para partidos de nivel medio-alto en Nave A y B.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB D: ACHIEVEMENTS & TROPHIES */}
      {profileTab === 'achievements' && (
        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>Vitrina de Trofeos y Logros de Espadel Club</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Insignias desbloqueadas jugando y ganando partidos en las 6 pistas del club.
              </p>
            </div>
            <span className="text-xs font-mono font-black text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-xl">
              {achievements.filter(a => a.unlocked).length} / {achievements.length} Completados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(ach => (
              <div
                key={ach.id}
                className={`rounded-3xl p-5 border shadow-xl transition flex flex-col justify-between ${
                  ach.unlocked
                    ? 'bg-zinc-950 border-yellow-400/30 hover:border-yellow-400/60'
                    : 'bg-zinc-950/50 border-zinc-900 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl p-2 rounded-2xl bg-zinc-900/80 border border-zinc-800 inline-block">
                      {ach.icon}
                    </span>
                    {ach.unlocked ? (
                      <span className="text-[10px] font-mono uppercase bg-emerald-400/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-400/30 font-bold">
                        Desbloqueado
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                        Bloqueado
                      </span>
                    )}
                  </div>

                  <h4 className="font-black text-white text-base">{ach.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{ach.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono">
                  {ach.date && (
                    <span className="text-zinc-500">Conseguido: {ach.date}</span>
                  )}
                  {ach.progress && (
                    <span className="text-yellow-400 font-bold">{ach.progress}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: CAMBIAR FOTO DE PERFIL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-950 border-2 border-yellow-400/40 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-yellow-400" />
                <span>Cambiar Foto de Perfil</span>
              </h3>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Current photo preview */}
            <div className="flex items-center gap-4 bg-black/50 border border-zinc-900 p-4 rounded-2xl">
              <img
                src={currentUser.avatar}
                alt="Foto actual"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-yellow-400"
              />
              <div>
                <span className="text-xs font-bold text-white block">Foto actual en uso</span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Visible en las 6 pistas aéreas y en el ranking del club.
                </span>
              </div>
            </div>

            {/* Option A: Upload from Computer/Device */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-zinc-300 block">
                Opción 1: Subir imagen desde tu ordenador o móvil
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20"
              >
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>Seleccionar Archivo de Imagen...</span>
              </button>
            </div>

            {/* Option B: Preset Padel Player Avatars */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-zinc-300 block">
                Opción 2: Elegir un avatar predefinido
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {AVATAR_PRESETS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectPreset(url)}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition hover:scale-105 ${
                      currentUser.avatar === url
                        ? 'border-yellow-400 ring-2 ring-yellow-400/40'
                        : 'border-zinc-800 hover:border-yellow-400/60'
                    }`}
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    {currentUser.avatar === url && (
                      <div className="absolute inset-0 bg-yellow-400/30 flex items-center justify-center">
                        <Check className="w-5 h-5 text-black stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Option C: Image URL input */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-zinc-300 block">
                Opción 3: Pegar enlace URL de imagen web
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-yellow-400 hover:text-black text-white text-xs font-bold transition"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR DATOS PERSONALES Y PREFERENCIAS */}
      {isEditInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-950 border-2 border-yellow-400/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-yellow-400" />
                <span>Editar Datos de Mi Perfil</span>
              </h3>
              <button
                onClick={() => setIsEditInfoOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveInfo} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Nombre y Apellidos:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-yellow-400 font-bold"
                />
              </div>

              {/* Side preference */}
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Lado de juego preferido:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Revés', 'Drive', 'Indiferente'] as const).map(side => (
                    <button
                      key={side}
                      type="button"
                      onClick={() => setEditSide(side)}
                      className={`py-2 rounded-xl text-xs font-black transition border ${
                        editSide === side
                          ? 'bg-yellow-400 text-black border-yellow-400 shadow-md'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hand */}
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Mano hábil:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Derecha', 'Zurdo'] as const).map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setEditHand(h)}
                      className={`py-2 rounded-xl text-xs font-black transition border ${
                        editHand === h
                          ? 'bg-yellow-400 text-black border-yellow-400 shadow-md'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      {h === 'Derecha' ? 'Diestro (Derecha)' : 'Zurdo'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Racket selector */}
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Pala de pádel actual:</label>
                <select
                  value={editRacket}
                  onChange={(e) => setEditRacket(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-yellow-400 font-mono"
                >
                  {POPULAR_RACKETS.map(r => (
                    <option key={r} value={r} className="bg-zinc-950 text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred time */}
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Horario preferido de juego:</label>
                <input
                  type="text"
                  value={editPreferredTime}
                  onChange={(e) => setEditPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-yellow-400 font-mono"
                  placeholder="ej: Tardes (18:30 - 21:00)"
                />
              </div>

              {/* Save & Cancel */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditInfoOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-bold hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-yellow-400 text-black text-xs font-black hover:bg-yellow-300 shadow-lg shadow-yellow-400/20"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
