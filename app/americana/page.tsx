import { Metadata } from 'next';
import Link from 'next/link';
import { AmericanaManager } from '../../components/americana/AmericanaManager';
import { ArrowLeft, Sparkles, Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Americana de Pádel — Gestor de Torneo de 6 Pistas',
  description: 'Gestor dinámico de Americanas de Pádel: emparejamiento aleatorio por posiciones (Revés/Derecha), pistas, temporizador y alarma móvil potente en negro y amarillo.',
};

export default function AmericanaPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-yellow-400 selection:text-black">
      {/* Top Banner */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-yellow-400/50 text-zinc-400 hover:text-yellow-400 transition flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Club</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-xl">🎾</span>
              <div>
                <h1 className="text-sm sm:text-base font-black text-white tracking-tight">
                  Americana de Pádel — 6 Pistas
                </h1>
                <p className="text-[10px] text-zinc-400 font-mono hidden sm:block">
                  Sorteo aleatorio • Posición Revés/Derecha • Alarma acústica para móvil
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
              <Trophy className="w-3.5 h-3.5" />
              <span>Modo Torneo</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <AmericanaManager />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black py-6 px-4 text-center text-xs text-zinc-500 font-mono">
        🎾 Diseñado para clubes de pádel • Alarma Web Audio API de alta penetración • Emparejamiento por posición
      </footer>
    </div>
  );
}
