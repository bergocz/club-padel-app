'use client';

import React, { useState } from 'react';
import { QUIZ_QUESTIONS, calculateSkillLevel } from '../data/quiz';
import { Player } from '../types';
import { LevelBadge } from './LevelBadge';
import { CheckCircle2, ChevronRight, ChevronLeft, Award, RotateCcw, Sparkles, X, Target, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLevel: (updatedPlayer: Partial<Player>) => void;
  currentLevel: number;
}

export const LevelQuizModal: React.FC<LevelQuizModalProps> = ({
  isOpen,
  onClose,
  onSaveLevel,
  currentLevel,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100);

  const handleSelectOption = (points: number) => {
    const newAnswers = { ...answers, [currentQ.id]: points };
    setAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finished all questions!
      setShowResult(true);
      confetti({
        particleCount: 140,
        spread: 75,
        colors: ['#facc15', '#eab308', '#ffffff', '#000000'],
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResult(false);
  };

  const calculated = calculateSkillLevel(answers);

  const handleApply = () => {
    onSaveLevel({
      level: calculated.level,
      category: calculated.category,
      radarStats: calculated.radarStats
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-yellow-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black shadow-md shadow-yellow-400/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Test Diagnóstico de Nivel Spadel</h2>
              <p className="text-xs text-zinc-400">Escala Oficial de Pádel (1.0 — 7.0)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!showResult ? (
            <div>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
                  <span>PREGUNTA {currentStep + 1} DE {QUIZ_QUESTIONS.length}</span>
                  <span className="text-yellow-400 font-bold">{progressPercent}% COMPLETADO</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                  {currentQ.title}
                </h3>
                <p className="text-sm text-zinc-400">
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ.id] === opt.points;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt.points)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-start gap-4 ${
                        isSelected
                          ? 'bg-yellow-400/10 border-yellow-400 text-white shadow-lg shadow-yellow-400/5'
                          : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900 hover:border-yellow-400/50 text-zinc-200'
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-yellow-400 bg-yellow-400 text-black' : 'border-zinc-700'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-white mb-0.5">{opt.label}</div>
                        <div className="text-xs text-zinc-400 leading-relaxed">{opt.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="py-2 text-center animate-in zoom-in-95 duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 mb-4 shadow-xl shadow-yellow-400/10">
                <Award className="w-9 h-9" />
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight mb-1">
                ¡Nivel Calculado con Éxito!
              </h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">
                Basado en tu técnica, control con paredes, volea y experiencia en torneos.
              </p>

              {/* Big Score Box */}
              <div className="max-w-sm mx-auto bg-zinc-900/70 border border-yellow-400/40 rounded-3xl p-6 mb-6">
                <div className="text-xs uppercase font-mono tracking-wider text-zinc-400 mb-1">Tu Nivel Asignado</div>
                <div className="text-6xl font-black tracking-tight font-mono mb-3 text-yellow-400">
                  {calculated.level.toFixed(1)}
                </div>
                <div className="flex justify-center">
                  <LevelBadge level={calculated.level} category={calculated.category} size="lg" />
                </div>
                <div className="text-xs text-zinc-400 mt-3">
                  Nivel previo: <span className="font-bold text-zinc-300">{currentLevel.toFixed(1)}</span>
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="max-w-md mx-auto text-left bg-black border border-zinc-800 rounded-2xl p-4 mb-6">
                <div className="text-xs font-semibold text-zinc-300 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Desglose de Habilidades (1 - 10)
                </div>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1 font-mono">
                      <span>Técnica & Fondo de Pista</span>
                      <span className="text-white font-bold">{calculated.radarStats.tecnica}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${calculated.radarStats.tecnica * 10}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1 font-mono">
                      <span>Juego de Paredes (Rebote & Giros)</span>
                      <span className="text-white font-bold">{calculated.radarStats.paredes}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${calculated.radarStats.paredes * 10}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1 font-mono">
                      <span>Volea & Presión en la Red</span>
                      <span className="text-white font-bold">{calculated.radarStats.volea}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${calculated.radarStats.volea * 10}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1 font-mono">
                      <span>Aéreo & Remate</span>
                      <span className="text-white font-bold">{calculated.radarStats.aereo}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${calculated.radarStats.aereo * 10}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1 font-mono">
                      <span>Táctica & Pareja</span>
                      <span className="text-white font-bold">{calculated.radarStats.tactica}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${calculated.radarStats.tactica * 10}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between">
          {!showResult ? (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  currentStep === 0
                    ? 'text-zinc-700 cursor-not-allowed'
                    : 'text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <div className="text-xs text-zinc-500">
                Selecciona una respuesta para avanzar
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-4 h-4" /> Repetir Test
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-black bg-yellow-400 hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 flex items-center gap-2 transition"
              >
                Guardar Nivel en mi Ficha <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
