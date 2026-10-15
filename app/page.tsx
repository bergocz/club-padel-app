'use client';

import React, { useState } from 'react';
import { ClubTheme, OpenMatch, Player, SkillCategory, Court } from '../types';
import { CLUBS } from '../data/clubs';
import { INITIAL_USER } from '../data/initialUser';
import { INITIAL_MATCHES } from '../data/mockMatches';
import { Navbar } from '../components/Navbar';
import { LevelBadge } from '../components/LevelBadge';
import { MatchCard } from '../components/MatchCard';
import { LevelQuizModal } from '../components/LevelQuizModal';
import { CreateMatchModal } from '../components/CreateMatchModal';
import { CourtBookingView } from '../components/CourtBookingView';
import { ProfileModal } from '../components/ProfileModal';
import { B2BDemoDrawer } from '../components/B2BDemoDrawer';
import { Plus, Sparkles, Filter, Users, Flame, Calendar, Trophy, ShieldAlert, Award } from 'lucide-react';

export default function HomePage() {
  const [currentClub, setCurrentClub] = useState<ClubTheme>(CLUBS[0]);
  const [currentUser, setCurrentUser] = useState<Player>(INITIAL_USER);
  const [matches, setMatches] = useState<OpenMatch[]>(INITIAL_MATCHES);
  const [activeTab, setActiveTab] = useState<'matches' | 'booking' | 'profile'>('matches');

  // Modals
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateMatchOpen, setIsCreateMatchOpen] = useState(false);
  const [isB2BOpen, setIsB2BOpen] = useState(false);

  // Filter for Open Matches
  const [filterCategory, setFilterCategory] = useState<'all' | 'my_level' | 'iniciacion' | 'medio' | 'avanzado'>('all');

  // Match slot actions
  const handleJoinSlot = (matchId: string, position: 1 | 2 | 3 | 4) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;

      const newSlots = m.slots.map(s => {
        if (s.position === position) {
          return { ...s, player: currentUser };
        }
        return s;
      });

      const filled = newSlots.filter(s => !!s.player).length;
      return {
        ...m,
        slots: newSlots,
        status: filled === 4 ? 'full' : filled === 3 ? 'almost_full' : 'open'
      };
    }));
  };

  const handleLeaveSlot = (matchId: string, position: 1 | 2 | 3 | 4) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;

      const newSlots = m.slots.map(s => {
        if (s.position === position && s.player?.id === currentUser.id) {
          return { ...s, player: undefined };
        }
        return s;
      });

      const filled = newSlots.filter(s => !!s.player).length;
      return {
        ...m,
        slots: newSlots,
        status: filled === 4 ? 'full' : filled === 3 ? 'almost_full' : 'open'
      };
    }));
  };

  const handleCreateMatch = (newMatch: OpenMatch) => {
    setMatches(prev => [newMatch, ...prev]);
    setActiveTab('matches');
  };

  const handleSaveLevel = (data: Partial<Player>) => {
    setCurrentUser(prev => ({
      ...prev,
      ...data
    }));
  };

  const handleSaveProfile = (data: Partial<Player>) => {
    setCurrentUser(prev => ({
      ...prev,
      ...data
    }));
  };

  // Filtered matches logic
  const filteredMatches = matches.filter(m => {
    if (filterCategory === 'my_level') {
      return currentUser.level >= m.minLevel - 0.3 && currentUser.level <= m.maxLevel + 0.3;
    }
    if (filterCategory === 'iniciacion') {
      return m.maxLevel <= 3.0 || m.minLevel < 3.0;
    }
    if (filterCategory === 'medio') {
      return m.minLevel >= 2.9 && m.maxLevel <= 5.2;
    }
    if (filterCategory === 'avanzado') {
      return m.minLevel >= 4.8;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navigation */}
      <Navbar
        currentClub={currentClub}
        onSelectClub={setCurrentClub}
        currentUser={currentUser}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenB2B={() => setIsB2BOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Club Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: currentClub.primaryColor }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{currentClub.logo}</span>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  {currentClub.name} • {currentClub.city}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                  {currentClub.courtCount} Pistas
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight mb-2">
                Encuentra partido a tu nivel o reserva pista al instante
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                Plataforma oficial del club para sus socios. Partidos abiertos equilibrados por nivel (1.0 — 7.0), sin comisiones de intermediarios y con plazas en tiempo real.
              </p>

              {/* User Skill Bar Banner */}
              <div className="inline-flex flex-wrap items-center gap-3 p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                  />
                  <span className="text-xs text-slate-300 font-bold">{currentUser.name}</span>
                </div>
                <div className="h-4 w-px bg-slate-800 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Tu Nivel:</span>
                  <LevelBadge level={currentUser.level} category={currentUser.category} size="sm" />
                </div>
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-2 flex items-center gap-1 ml-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Calibrar Nivel con Test
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => setIsCreateMatchOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Crear Partido Abierto</span>
              </button>

              <button
                onClick={() => setActiveTab('booking')}
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Ver Pistas del Club</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: PARTIDOS ABIERTOS */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            {/* Filter Tabs Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1 mr-2 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-slate-500" /> Filtrar:
                </span>

                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    filterCategory === 'all'
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos ({matches.length})
                </button>

                <button
                  onClick={() => setFilterCategory('my_level')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                    filterCategory === 'my_level'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Mi Nivel ({currentUser.level.toFixed(1)} ±0.4)
                </button>

                <button
                  onClick={() => setFilterCategory('iniciacion')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    filterCategory === 'iniciacion'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Iniciación (1.0 — 3.0)
                </button>

                <button
                  onClick={() => setFilterCategory('medio')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    filterCategory === 'medio'
                      ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Medio (3.0 — 5.0)
                </button>

                <button
                  onClick={() => setFilterCategory('avanzado')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    filterCategory === 'avanzado'
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Avanzado (5.0 — 7.0)
                </button>
              </div>

              <div className="text-xs font-mono text-slate-400 text-right">
                {filteredMatches.length} partidos disponibles
              </div>
            </div>

            {/* Match Grid */}
            {filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    currentUser={currentUser}
                    onJoinSlot={handleJoinSlot}
                    onLeaveSlot={handleLeaveSlot}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No hay partidos con este filtro</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Sé el primero en abrir pista en este nivel y deja que el resto de socios se sumen.
                </p>
                <button
                  onClick={() => setIsCreateMatchOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Crear Partido Abierto Ahora
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RESERVA DE PISTAS */}
        {activeTab === 'booking' && (
          <CourtBookingView
            currentUser={currentUser}
            onOpenCreateMatchWithCourt={(court, slot, date) => {
              setIsCreateMatchOpen(true);
            }}
          />
        )}

        {/* TAB 3: MI PERFIL (MOBILE VIEW) */}
        {activeTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center max-w-md mx-auto">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-emerald-500"
            />
            <h2 className="text-lg font-bold text-white">{currentUser.name}</h2>
            <div className="flex justify-center mt-2 mb-4">
              <LevelBadge level={currentUser.level} category={currentUser.category} size="md" />
            </div>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold mb-2"
            >
              Editar Foto y Datos de Perfil
            </button>
            <button
              onClick={() => setIsQuizOpen(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
            >
              Hacer Test de Nivelación (8 Preguntas)
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">{currentClub.logo}</span>
            <span className="font-bold text-slate-300">{currentClub.name}</span>
            <span>• Solución SaaS White-Label para Clubes</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Escala Oficial de Nivel (1.0 — 7.0)</span>
            <span>•</span>
            <button onClick={() => setIsB2BOpen(true)} className="text-indigo-400 hover:underline font-semibold">
              Propuesta Comercial B2B
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <LevelQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSaveLevel={handleSaveLevel}
        currentLevel={currentUser.level}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      <CreateMatchModal
        isOpen={isCreateMatchOpen}
        onClose={() => setIsCreateMatchOpen(false)}
        currentUser={currentUser}
        onCreateMatch={handleCreateMatch}
      />

      <B2BDemoDrawer
        isOpen={isB2BOpen}
        onClose={() => setIsB2BOpen(false)}
      />
    </div>
  );
}
