'use client';

import React, { useState } from 'react';
import { Player } from '../types';
import { QUIZ_QUESTIONS, calculateSkillLevel } from '../data/quiz';
import { LevelBadge } from './LevelBadge';
import { CheckCircle2, ChevronRight, ChevronLeft, Sparkles, User, Camera, ShieldCheck, Zap, Lock, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingAuthModalProps {
  isOpen: boolean;
  onComplete: (user: Player) => void;
  onClose: () => void;
  canClose?: boolean;
}

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
];

export const OnboardingAuthModal: React.FC<OnboardingAuthModalProps> = ({
  isOpen,
  onComplete,
  onClose,
  canClose = false,
}) => {
  // Stages: 1: Auth, 2: Profile details, 3: Skill Quiz, 4: Result/Finish
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [authMethod, setAuthMethod] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('Carlos Mendoza');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [hand, setHand] = useState<'Derecha' | 'Zurdo'>('Derecha');
  const [sidePreference, setSidePreference] = useState<'Revés' | 'Drive' | 'Indiferente'>('Revés');

  // Quiz states
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [calculatedResult, setCalculatedResult] = useState<any>(null);

  if (!isOpen) return null;

  // Handle Google Login Simulation
  const handleGoogleLogin = () => {
    setName('Carlos Mendoza');
    setAvatar(AVATARS[0]);
    setEmail('carlos.mendoza@gmail.com');
    setStage(2); // Move to Profile
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) setName('Socio Spadel');
    setStage(2);
  };

  const handleProfileContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setStage(3); // Move to Quiz
  };

  const handleQuizAnswer = (points: number) => {
    const currentQ = QUIZ_QUESTIONS[quizStep];
    const newAnswers = { ...answers, [currentQ.id]: points };
    setAnswers(newAnswers);

    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // Completed all questions
      const res = calculateSkillLevel(newAnswers);
      setCalculatedResult(res);
      setStage(4);
      confetti({
        particleCount: 150,
        spread: 80,
        colors: ['#facc15', '#eab308', '#ffffff', '#000000'],
        origin: { y: 0.6 }
      });
    }
  };

  const handleFinishOnboarding = () => {
    const finalPlayer: Player = {
      id: `usr_${Date.now()}`,
      name,
      avatar,
      hand,
      sidePreference,
      level: calculatedResult?.level || 3.5,
      category: calculatedResult?.category || 'medio',
      clubMemberNumber: `SPADEL-${Math.floor(1000 + Math.random() * 9000)}`,
      levelCertifiedByClub: false,
      coachNotes: 'Nivel inicial determinado mediante el test diagnóstico de entrada a Spadel Club.',
      matchesPlayed: 0,
      winRate: 0,
      radarStats: calculatedResult?.radarStats || {
        tecnica: 6,
        paredes: 6,
        volea: 6,
        aereo: 6,
        tactica: 6
      }
    };

    onComplete(finalPlayer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-yellow-500/30 rounded-3xl shadow-2xl shadow-yellow-500/10 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Accent Line in Spadel Yellow */}
        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black text-lg shadow-md shadow-yellow-400/20">
              ⚡
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                Spadel Club <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">OFICIAL</span>
              </span>
              <p className="text-[11px] text-zinc-400">Bienvenido al club • Registro & Nivelación</p>
            </div>
          </div>

          {canClose && (
            <button
              onClick={onClose}
              className="text-xs text-zinc-500 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-900 transition"
            >
              Cerrar
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-sm">
          {/* STAGE 1: INICIAR SESIÓN / GOOGLE */}
          {stage === 1 && (
            <div className="space-y-6 py-2">
              <div className="text-center max-w-sm mx-auto">
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                  Inicia sesión en Spadel Club
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Accede a la app oficial para reservar pistas, unirte a partidos abiertos de tu nivel y gestionar tus partidos.
                </p>
              </div>

              {/* Social Login: Google Button */}
              <div className="space-y-3 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition shadow-lg shadow-white/5 active:scale-[0.98]"
                >
                  {/* Google SVG Icon */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continuar con Google</span>
                </button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-zinc-800 w-full" />
                  <span className="bg-zinc-950 px-3 text-[11px] text-zinc-500 uppercase font-mono">
                    o con tu email
                  </span>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailContinue} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="tu.email@ejemplo.com"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Nombre y Apellidos</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ej: Carlos Mendoza"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs transition shadow-md shadow-yellow-400/10 flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Continuar al Perfil</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STAGE 2: DATOS DEL JUGADOR (FOTO, POSICIÓN, MANO) */}
          {stage === 2 && (
            <form onSubmit={handleProfileContinue} className="space-y-6 py-2">
              <div className="text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 font-bold bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20">
                  PASO 2 DE 3
                </span>
                <h3 className="text-xl font-black text-white tracking-tight mt-2 mb-1">
                  Configura tu Ficha de Jugador
                </h3>
                <p className="text-xs text-zinc-400">
                  Elige tu foto de perfil, mano dominante y lado en pista.
                </p>
              </div>

              {/* Avatar Selector */}
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400 shadow-xl shadow-yellow-400/10"
                  />
                  <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-8 h-8 rounded-full overflow-hidden border transition ${
                        avatar === av ? 'border-yellow-400 ring-2 ring-yellow-400/40 scale-110' : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Hand & Side preference */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Mano Dominante</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHand('Derecha')}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        hand === 'Derecha'
                          ? 'bg-yellow-400 text-black border-yellow-400 shadow'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      Diestro
                    </button>
                    <button
                      type="button"
                      onClick={() => setHand('Zurdo')}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        hand === 'Zurdo'
                          ? 'bg-yellow-400 text-black border-yellow-400 shadow'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      Zurdo
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Lado Preferido</label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => setSidePreference('Revés')}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        sidePreference === 'Revés'
                          ? 'bg-yellow-400 text-black border-yellow-400 shadow'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      Revés
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidePreference('Drive')}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        sidePreference === 'Drive'
                          ? 'bg-yellow-400 text-black border-yellow-400 shadow'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      Drive
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidePreference('Indiferente')}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        sidePreference === 'Indiferente'
                          ? 'bg-yellow-400 text-black border-yellow-400 shadow'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      Ambos
                    </button>
                  </div>
                </div>
              </div>

              {/* Next to Quiz */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-black font-black text-xs sm:text-sm shadow-xl shadow-yellow-400/20 transition flex items-center justify-center gap-2"
              >
                <span>Hacer Test Diagnóstico de Nivel (8 preguntas)</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </form>
          )}

          {/* STAGE 3: TEST DE NIVEL INTEGRADO */}
          {stage === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
                <span className="text-yellow-400 font-bold">PREGUNTA {quizStep + 1} DE {QUIZ_QUESTIONS.length}</span>
                <span>{Math.round(((quizStep + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.round(((quizStep + 1) / QUIZ_QUESTIONS.length) * 100)}%` }}
                />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  {QUIZ_QUESTIONS[quizStep].title}
                </h3>
                <p className="text-xs text-zinc-400 mb-4">
                  {QUIZ_QUESTIONS[quizStep].subtitle}
                </p>
              </div>

              <div className="space-y-2.5">
                {QUIZ_QUESTIONS[quizStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuizAnswer(opt.points)}
                    className="w-full text-left p-3.5 rounded-2xl border border-zinc-800 hover:border-yellow-400 bg-zinc-900/40 hover:bg-yellow-400/5 text-zinc-200 transition-all flex items-start gap-3 group"
                  >
                    <div className="w-5 h-5 rounded-full border border-zinc-700 group-hover:border-yellow-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-yellow-400/20">
                      <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-yellow-300">{opt.label}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{opt.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              {quizStep > 0 && (
                <button
                  type="button"
                  onClick={() => setQuizStep(prev => prev - 1)}
                  className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 pt-2 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Pregunta anterior
                </button>
              )}
            </div>
          )}

          {/* STAGE 4: RESULTADO OFICIAL */}
          {stage === 4 && calculatedResult && (
            <div className="py-2 text-center animate-in zoom-in-95 duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 mb-3 shadow-xl shadow-yellow-400/10">
                <Zap className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight mb-1">
                ¡Ficha Asignada en Spadel Club!
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-5">
                Hemos calculado tu nivel inicial para colocarte en partidos equilibrados.
              </p>

              {/* Score Box */}
              <div className="max-w-xs mx-auto bg-zinc-900/90 border border-yellow-400/40 rounded-3xl p-5 mb-5 shadow-lg">
                <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1">Tu Nivel Inicial</div>
                <div className="text-5xl font-black tracking-tight text-yellow-400 font-mono mb-2">
                  {calculatedResult.level.toFixed(1)}
                </div>
                <div className="flex justify-center">
                  <LevelBadge level={calculatedResult.level} category={calculatedResult.category} size="md" />
                </div>
              </div>

              {/* Notice about Director override */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 max-w-md mx-auto mb-6 text-left flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-200">Revisión por Dirección Deportiva:</span>
                  <p className="mt-0.5">
                    Si el club ya conoce tu nivel real de juego, los entrenadores y la recepción pueden certificar y ajustar tu nivel oficial directamente desde su panel.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm shadow-xl shadow-yellow-400/20 transition flex items-center justify-center gap-2"
              >
                <span>Entrar a Spadel Club</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
