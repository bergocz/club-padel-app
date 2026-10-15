'use client';

import React from 'react';
import { ClubTheme, Player } from '../types';
import { CLUBS } from '../data/clubs';
import { LevelBadge } from './LevelBadge';
import { ShieldCheck, ChevronDown, User, Sparkles, Building2, Flame } from 'lucide-react';

interface NavbarProps {
  currentClub: ClubTheme;
  onSelectClub: (club: ClubTheme) => void;
  currentUser: Player;
  onOpenQuiz: () => void;
  onOpenProfile: () => void;
  onOpenB2B: () => void;
  activeTab: 'matches' | 'booking' | 'profile';
  onTabChange: (tab: 'matches' | 'booking' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentClub,
  onSelectClub,
  currentUser,
  onOpenQuiz,
  onOpenProfile,
  onOpenB2B,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      {/* Top Bar for Club & B2B Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-slate-900 text-xs">
        {/* Club Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium hidden sm:inline">Club Activo:</span>
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition">
              <span className="text-base">{currentClub.logo}</span>
              <span className="font-bold text-white tracking-tight">{currentClub.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-2 py-1">
                DEMO: Cambiar Club (Marca Blanca)
              </div>
              {CLUBS.map(club => (
                <button
                  key={club.id}
                  onClick={() => onSelectClub(club)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition ${
                    club.id === currentClub.id
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-lg">{club.logo}</span>
                  <div>
                    <div className="font-bold text-xs">{club.name}</div>
                    <div className="text-[10px] text-slate-400">{club.city} • {club.courtCount} pistas</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* B2B Pitch Banner Action */}
        <button
          onClick={onOpenB2B}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 font-semibold transition"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>¿Cómo vender esta app a un club?</span>
        </button>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange('matches')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'matches'
                ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>Partidos Abiertos</span>
          </button>

          <button
            onClick={() => onTabChange('booking')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'booking'
                ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>Reservar Pista</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 sm:hidden ${
              activeTab === 'profile'
                ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-400 hover:border-emerald-400 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test de Nivel</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                {currentUser.name}
              </div>
              <div className="flex items-center gap-1">
                <LevelBadge level={currentUser.level} category={currentUser.category} size="sm" showCategory={false} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
