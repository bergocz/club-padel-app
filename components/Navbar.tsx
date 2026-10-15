'use client';

import React from 'react';
import { ClubTheme, Player } from '../types';
import { LevelBadge } from './LevelBadge';
import { ShieldCheck, ChevronDown, User, Sparkles, Building2, Flame, KeyRound, LogIn, Eye } from 'lucide-react';

interface NavbarProps {
  currentClub: ClubTheme;
  onSelectClub: (club: ClubTheme) => void;
  currentUser: Player;
  onOpenQuiz: () => void;
  onOpenProfile: () => void;
  onOpenB2B: () => void;
  onOpenAdmin: () => void;
  onOpenOnboarding: () => void;
  activeTab: 'aerial' | 'matches' | 'booking' | 'profile';
  onTabChange: (tab: 'aerial' | 'matches' | 'booking' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentClub,
  onSelectClub,
  currentUser,
  onOpenQuiz,
  onOpenProfile,
  onOpenB2B,
  onOpenAdmin,
  onOpenOnboarding,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-900">
      {/* Top Bar for Club & B2B / Admin Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-zinc-900/80 text-xs">
        {/* Club Brand Display */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="w-5 h-5 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black text-xs">
              ⚡
            </span>
            <span className="font-black text-white tracking-tight">{currentClub.name}</span>
            <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/20">
              OFICIAL
            </span>
          </div>
        </div>

        {/* Right Top Actions: Admin Mode & B2B Pitch */}
        <div className="flex items-center gap-2">
          {/* Admin Director Mode Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 hover:bg-yellow-400 hover:text-black font-bold transition shadow-sm"
            title="Panel para que el club modifique niveles si ya conoce al jugador"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Modo Director Club:</span>
            <span>Modificar Niveles</span>
          </button>

          {/* Re-trigger Onboarding / Demo Login */}
          <button
            onClick={onOpenOnboarding}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-semibold transition"
            title="Simular flujo de entrada con Google y test de nivel"
          >
            <LogIn className="w-3.5 h-3.5 text-yellow-400" />
            <span>Simular Login Google</span>
          </button>

          {/* B2B Pitch Banner Action */}
          <button
            onClick={onOpenB2B}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-semibold transition"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dossier Venta Club</span>
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* TAB 1: VISIÓN AÉREA DE PISTAS (Destacada) */}
          <button
            onClick={() => onTabChange('aerial')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ${
              activeTab === 'aerial'
                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/25 ring-2 ring-yellow-300'
                : 'text-zinc-400 hover:text-yellow-400 hover:bg-zinc-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Visión Aérea Pistas</span>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tight ${
              activeTab === 'aerial' ? 'bg-black text-yellow-400' : 'bg-yellow-400 text-black'
            }`}>
              6 Pistas
            </span>
          </button>

          {/* TAB 2: PARTIDOS ABIERTOS */}
          <button
            onClick={() => onTabChange('matches')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ${
              activeTab === 'matches'
                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Partidos Abiertos</span>
          </button>

          {/* TAB 3: RESERVAR PISTA */}
          <button
            onClick={() => onTabChange('booking')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 ${
              activeTab === 'booking'
                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span>Reservar Pista</span>
          </button>

          {/* TAB 4: PERFIL (MOBILE) */}
          <button
            onClick={() => onTabChange('profile')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 sm:hidden ${
              activeTab === 'profile'
                ? 'bg-yellow-400 text-black'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mi Perfil</span>
          </button>
        </nav>

        {/* User Profile Pill & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQuiz}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 hover:border-yellow-400 text-xs font-bold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Test Diagnóstico</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-400/40 transition"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-yellow-400"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                {currentUser.name}
              </div>
              <div className="flex items-center gap-1">
                <LevelBadge
                  level={currentUser.level}
                  category={currentUser.category}
                  size="sm"
                  showCategory={false}
                  isCertified={currentUser.levelCertifiedByClub}
                />
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
