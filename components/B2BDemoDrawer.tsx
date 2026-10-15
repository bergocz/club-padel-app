'use client';

import React, { useState } from 'react';
import { X, Building2, CheckCircle2, TrendingUp, DollarSign, Users, Shield, Sparkles, PhoneCall } from 'lucide-react';

interface B2BDemoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const B2BDemoDrawer: React.FC<B2BDemoDrawerProps> = ({ isOpen, onClose }) => {
  const [courtsCount, setCourtsCount] = useState(6);
  const [avgBookingsPerDay, setAvgBookingsPerDay] = useState(4);

  if (!isOpen) return null;

  // Monthly bookings
  const monthlyBookings = courtsCount * avgBookingsPerDay * 30;
  // Playtomic fee per match paid by players: ~1.50€ per player x 4 = or ~1.50€ per booking
  const playtomicCommissionPerYear = monthlyBookings * 1.50 * 12;
  const ourSaaSFeePerYear = 149 * 12; // 149€/month flat
  const clubSavingsPerYear = playtomicCommissionPerYear - ourSaaSFeePerYear;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Dossier de Venta B2B para Clubes</h2>
              <p className="text-xs text-slate-400">Argumentario y calculadora de ahorro vs Playtomic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Interactive ROI Calculator */}
          <div className="bg-slate-950/80 border border-indigo-500/30 rounded-3xl p-5 shadow-xl">
            <div className="text-xs font-bold text-indigo-400 uppercase font-mono tracking-wider mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Calculadora de Ahorro para el Gerente del Club
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Número de Pistas del Club: <strong>{courtsCount}</strong></label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={courtsCount}
                  onChange={e => setCourtsCount(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Reservas diarias por pista: <strong>{avgBookingsPerDay}</strong></label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={avgBookingsPerDay}
                  onChange={e => setAvgBookingsPerDay(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Metric Results */}
            <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-800/80 text-center">
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono">Reservas Anuales</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {(monthlyBookings * 12).toLocaleString()}
                </div>
              </div>
              <div className="bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20">
                <div className="text-[10px] text-rose-400 font-mono">Comisión Playtomic/año</div>
                <div className="text-base font-bold text-rose-300 font-mono mt-0.5">
                  {playtomicCommissionPerYear.toLocaleString()}€
                </div>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/30">
                <div className="text-[10px] text-emerald-400 font-mono">Ahorro con tu App</div>
                <div className="text-base font-bold text-emerald-300 font-mono mt-0.5">
                  +{clubSavingsPerYear.toLocaleString()}€/año
                </div>
              </div>
            </div>
          </div>

          {/* 4 Killer Arguments for the Club */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-3">
              Los 4 Argumentos Clave para Cerrar la Venta:
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">1. La base de datos es 100% del Club</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    En Playtomic los emails pertenecen a la plataforma. Con tu app, el club puede hacer campañas por WhatsApp/email de torneos, ofertas de restaurante o abonos.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">2. Aplicación 100% Marca Blanca con sus Colores</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    No promociona otros clubes rivales en el mapa. Refuerza la identidad y el orgullo de pertenencia de sus socios.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">3. Rentabilización de Horas Valle con Partidos Abiertos</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Cuando un socio no tiene 4 amigos para jugar a las 11:00 o a las 16:30, la pista se quedaba vacía. Con los partidos abiertos, el socio abre pista y el algoritmo la completa con jugadores de nivel compatible.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">4. Nivelación Rigurosa (1.0 — 7.0) sin Partidos Descompensados</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    El test diagnóstico de 8 preguntas evita que jugadores se sobrevaloren, acabando con la mayor queja en los clubes: partidos descompensados y quejas en recepción.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Model Suggested */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300">
            <span className="font-bold text-indigo-300 block mb-1">Modelo de Precios que puedes ofrecer:</span>
            Pídeles una cuota fija de <strong>99€ a 189€ al mes</strong> por club (según número de pistas). Para el club es una ganga frente a las comisiones de terceros y para ti es un ingreso recurrente mensual (MRR) altamente escalable.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Entendido, volver a la App
          </button>
        </div>
      </div>
    </div>
  );
};
