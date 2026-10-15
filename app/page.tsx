'use client';

import React, { useState, useEffect } from 'react';
import { ClubTheme, OpenMatch, Player, SkillCategory, Court } from '../types';
import { CLUBS } from '../data/clubs';
import { INITIAL_USER, MOCK_CLUB_PLAYERS } from '../data/initialUser';
import { INITIAL_MATCHES } from '../data/mockMatches';
import { Navbar } from '../components/Navbar';
import { LevelBadge } from '../components/LevelBadge';
import { MatchCard } from '../components/MatchCard';
import { LevelQuizModal } from '../components/LevelQuizModal';
import { CreateMatchModal } from '../components/CreateMatchModal';
import { CourtBookingView } from '../components/CourtBookingView';
import { ProfileModal } from '../components/ProfileModal';
import { B2BDemoDrawer } from '../components/B2BDemoDrawer';
import { AdminClubPanelModal } from '../components/AdminClubPanelModal';
import { OnboardingAuthModal } from '../components/OnboardingAuthModal';
import { AerialClubCourtsView } from '../components/AerialClubCourtsView';
import { ClubRankingView } from '../components/ClubRankingView';
import { UserProfileView } from '../components/UserProfileView';
import { Plus, Sparkles, Filter, Users, Flame, Calendar, Trophy, ShieldAlert, Award, KeyRound, ShieldCheck, Zap, Eye, User } from 'lucide-react';

export default function HomePage() {
  const [currentClub, setCurrentClub] = useState<ClubTheme>(CLUBS[0]); // Espadel Club
  const [currentUser, setCurrentUser] = useState<Player>(INITIAL_USER);
  const [clubPlayers, setClubPlayers] = useState<Player[]>(MOCK_CLUB_PLAYERS);
  const [matches, setMatches] = useState<OpenMatch[]>(INITIAL_MATCHES);
  const [activeTab, setActiveTab] = useState<'aerial' | 'matches' | 'booking' | 'ranking' | 'profile'>('aerial');

  // Modals
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState<Player | null>(null);
  const [isCreateMatchOpen, setIsCreateMatchOpen] = useState(false);
  const [createMatchCourtNumber, setCreateMatchCourtNumber] = useState<number | null>(null);
  const [createMatchTime, setCreateMatchTime] = useState<string | undefined>(undefined);
  const [createMatchDate, setCreateMatchDate] = useState<string | undefined>(undefined);
  const [isB2BOpen, setIsB2BOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Check if onboarding was already done in this session
  useEffect(() => {
    const hasSeenOnboarding = sessionStorage.getItem('espadel_onboarding_done');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

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
    setActiveTab('aerial');
  };

  const handleSaveLevel = (data: Partial<Player>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...data };
      setClubPlayers(all => all.map(p => p.id === updated.id ? updated : p));
      return updated;
    });
  };

  const handleSaveProfile = (data: Partial<Player>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...data };
      setClubPlayers(all => all.map(p => p.id === updated.id ? updated : p));
      return updated;
    });
  };

  // Club Director Override Action
  const handleAdminUpdatePlayerLevel = (
    playerId: string,
    newLevel: number,
    newCategory: SkillCategory,
    isCertified: boolean,
    notes: string
  ) => {
    setClubPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          level: newLevel,
          category: newCategory,
          levelCertifiedByClub: isCertified,
          coachNotes: notes,
        };
      }
      return p;
    }));

    // If updating current user, update live
    if (currentUser.id === playerId) {
      setCurrentUser(prev => ({
        ...prev,
        level: newLevel,
        category: newCategory,
        levelCertifiedByClub: isCertified,
        coachNotes: notes,
      }));
    }

    // Also update in existing match slots
    setMatches(prev => prev.map(m => ({
      ...m,
      slots: m.slots.map(slot => {
        if (slot.player?.id === playerId) {
          return {
            ...slot,
            player: {
              ...slot.player,
              level: newLevel,
              category: newCategory,
              levelCertifiedByClub: isCertified
            }
          };
        }
        return slot;
      })
    })));
  };

  // Onboarding Complete Handler
  const handleCompleteOnboarding = (newUser: Player) => {
    setCurrentUser(newUser);
    setClubPlayers(prev => [newUser, ...prev.filter(p => p.id !== newUser.id && p.id !== 'usr_me')]);
    sessionStorage.setItem('espadel_onboarding_done', 'true');
    setIsOnboardingOpen(false);
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
    <div className="min-h-screen flex flex-col bg-black text-zinc-100">
      {/* Navigation */}
      <Navbar
        currentClub={currentClub}
        onSelectClub={setCurrentClub}
        currentUser={currentUser}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenB2B={() => setIsB2BOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Espadel Club Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-yellow-500/25 p-6 sm:p-8 shadow-2xl shadow-yellow-500/5">
          {/* Yellow Ambient Glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none bg-yellow-400"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black text-sm">
                  ⚡
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-yellow-400 font-bold">
                  {currentClub.name} • {currentClub.city}
                </span>
                <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-800">
                  {currentClub.courtCount} Pistas Oficiales
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight mb-2">
                Partidos abiertos y reservas en <span className="text-yellow-400">Espadel Club</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                La app oficial de tu club. Consulta el <strong>plano aéreo de pistas</strong>, únete en tu posición preferida (<strong>Revés a la izquierda</strong>, <strong>Derecha a la derecha</strong>) y reserva pista sin comisiones de intermediarios.
              </p>

              {/* User Skill Bar Banner */}
              <div className="inline-flex flex-wrap items-center gap-3 p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-yellow-400"
                  />
                  <span className="text-xs text-zinc-200 font-bold">{currentUser.name}</span>
                </div>
                <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-mono">Tu Nivel:</span>
                  <LevelBadge
                    level={currentUser.level}
                    category={currentUser.category}
                    size="sm"
                    isCertified={currentUser.levelCertifiedByClub}
                  />
                </div>
                <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
                <div className="text-xs font-mono text-zinc-400">
                  Posición: <strong className="text-yellow-400">{currentUser.sidePreference}</strong>
                </div>
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="text-xs text-yellow-400 hover:text-yellow-300 font-bold underline underline-offset-2 flex items-center gap-1 ml-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Calibrar con Test
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => setActiveTab('aerial')}
                className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'aerial'
                    ? 'bg-yellow-400 text-black shadow-yellow-400/20'
                    : 'bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/40 text-yellow-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Visión Aérea (6 Pistas)</span>
              </button>

              <button
                onClick={() => setActiveTab('ranking')}
                className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                  activeTab === 'ranking'
                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                    : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-yellow-300'
                }`}
              >
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Ranking Club (Victorias)</span>
              </button>

              <button
                onClick={() => setIsCreateMatchOpen(true)}
                className="px-6 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Crear Partido Abierto</span>
              </button>

              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-6 py-2 rounded-2xl bg-zinc-900/80 hover:bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Panel Director</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: VISIÓN AÉREA DE PISTAS (NAVE A Y NAVE B - 6 PISTAS) */}
        {activeTab === 'aerial' && (
          <AerialClubCourtsView
            matches={matches}
            currentUser={currentUser}
            onJoinMatchSlot={handleJoinSlot}
            onLeaveMatchSlot={handleLeaveSlot}
            onOpenCreateMatchWithCourtNumber={(courtNum, time, date) => {
              setCreateMatchCourtNumber(courtNum);
              setCreateMatchTime(time);
              setCreateMatchDate(date);
              setIsCreateMatchOpen(true);
            }}
          />
        )}

        {/* TAB 2: PARTIDOS ABIERTOS (FEED) */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            {/* Filter Tabs Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 rounded-3xl p-4 shadow-xl">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-zinc-400 font-mono flex items-center gap-1 mr-2 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-zinc-500" /> Filtrar:
                </span>

                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    filterCategory === 'all'
                      ? 'bg-yellow-400 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Todos ({matches.length})
                </button>

                <button
                  onClick={() => setFilterCategory('my_level')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                    filterCategory === 'my_level'
                      ? 'bg-yellow-400 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Mi Nivel ({currentUser.level.toFixed(1)} ±0.4)
                </button>

                <button
                  onClick={() => setFilterCategory('iniciacion')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    filterCategory === 'iniciacion'
                      ? 'bg-yellow-400 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Iniciación (1.0 — 3.0)
                </button>

                <button
                  onClick={() => setFilterCategory('medio')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    filterCategory === 'medio'
                      ? 'bg-yellow-400 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Medio (3.0 — 5.0)
                </button>

                <button
                  onClick={() => setFilterCategory('avanzado')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    filterCategory === 'avanzado'
                      ? 'bg-yellow-400 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Avanzado (5.0 — 7.0)
                </button>
              </div>

              <div className="text-xs font-mono text-zinc-400 text-right">
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
              <div className="text-center py-16 bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
                <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No hay partidos con este filtro</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                  Sé el primero en abrir pista en este nivel y deja que el resto de socios de Espadel se sumen.
                </p>
                <button
                  onClick={() => setIsCreateMatchOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-black text-xs"
                >
                  Crear Partido Abierto Ahora
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RESERVA DE PISTAS */}
        {activeTab === 'booking' && (
          <CourtBookingView
            currentUser={currentUser}
            onOpenCreateMatchWithCourt={(court, slot, date) => {
              setIsCreateMatchOpen(true);
            }}
          />
        )}

        {/* TAB 4: RANKING DEL CLUB (PARTIDOS GANADOS & SISTEMA PLAYTOMIC) */}
        {activeTab === 'ranking' && (
          <ClubRankingView
            players={clubPlayers}
            currentUser={currentUser}
            onSelectPlayer={(p) => {
              setSelectedPlayerForProfile(p);
              setIsProfileOpen(true);
            }}
            onOpenQuiz={() => setIsQuizOpen(true)}
          />
        )}

        {/* TAB 5: MODO MI PERFIL OFICIAL (COMPLETO) */}
        {activeTab === 'profile' && (
          <UserProfileView
            currentUser={currentUser}
            onSaveProfile={handleSaveProfile}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onNavigateToRanking={() => setActiveTab('ranking')}
            onNavigateToCourts={() => setActiveTab('aerial')}
            onSelectPlayerForDetail={(p) => {
              setSelectedPlayerForProfile(p);
              setIsProfileOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black/90 py-8 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-yellow-400 text-black flex items-center justify-center font-black text-xs">
              ⚡
            </span>
            <span className="font-bold text-zinc-300">{currentClub.name}</span>
            <span>• Solución Oficial Marca Blanca para el Club</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setActiveTab('aerial')} className="text-yellow-400 hover:underline font-bold">
              Visión Aérea 6 Pistas
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('ranking')} className="text-yellow-400 hover:underline font-bold">
              Ranking Victorias
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('profile')} className="text-yellow-400 hover:underline font-bold">
              Mi Perfil
            </button>
            <span>•</span>
            <button onClick={() => setIsAdminOpen(true)} className="text-zinc-400 hover:underline font-semibold">
              Panel Director
            </button>
            <span>•</span>
            <button onClick={() => setIsB2BOpen(true)} className="text-zinc-400 hover:underline font-semibold">
              Dossier Venta Club
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <OnboardingAuthModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleCompleteOnboarding}
        canClose={true}
      />

      <AdminClubPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        players={clubPlayers}
        currentUser={currentUser}
        onUpdatePlayerLevel={handleAdminUpdatePlayerLevel}
      />

      <LevelQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSaveLevel={handleSaveLevel}
        currentLevel={currentUser.level}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedPlayerForProfile(null);
        }}
        player={selectedPlayerForProfile || currentUser}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      <CreateMatchModal
        isOpen={isCreateMatchOpen}
        onClose={() => {
          setIsCreateMatchOpen(false);
          setCreateMatchCourtNumber(null);
          setCreateMatchTime(undefined);
          setCreateMatchDate(undefined);
        }}
        currentUser={currentUser}
        onCreateMatch={handleCreateMatch}
        initialCourtNumber={createMatchCourtNumber}
        initialTime={createMatchTime}
        initialDate={createMatchDate}
      />

      <B2BDemoDrawer
        isOpen={isB2BOpen}
        onClose={() => setIsB2BOpen(false)}
      />
    </div>
  );
}
