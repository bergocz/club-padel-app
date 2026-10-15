import React from 'react';
import { SkillCategory } from '../types';
import { ShieldCheck } from 'lucide-react';

interface LevelBadgeProps {
  level: number;
  category?: SkillCategory;
  size?: 'sm' | 'md' | 'lg';
  showCategory?: boolean;
  isCertified?: boolean;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  category,
  size = 'md',
  showCategory = true,
  isCertified = false,
}) => {
  // Infer category if not supplied
  const cat = category || (level < 3.0 ? 'iniciacion' : level < 5.0 ? 'medio' : 'avanzado');

  let colors = {
    bg: 'bg-zinc-800/80 border-zinc-700 text-zinc-300',
    dot: 'bg-zinc-400',
    label: 'Iniciación',
  };

  if (cat === 'medio') {
    colors = {
      bg: 'bg-yellow-400/15 border-yellow-400/40 text-yellow-300',
      dot: 'bg-yellow-400',
      label: 'Nivel Medio',
    };
  } else if (cat === 'avanzado') {
    colors = {
      bg: 'bg-amber-400/20 border-amber-300/50 text-amber-200',
      dot: 'bg-amber-300',
      label: 'Avanzado',
    };
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono tracking-tight font-medium ${colors.bg} ${sizeClasses[size]}`}
      title={`Nivel ${level.toFixed(1)} — ${colors.label}${isCertified ? ' (Certificado por Espadel Club)' : ''}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
      <span className="font-bold">{level.toFixed(1)}</span>
      {showCategory && (
        <span className="text-[11px] opacity-85 border-l border-current/25 pl-1.5 font-sans font-normal">
          {colors.label}
        </span>
      )}
      {isCertified && (
        <span className="flex items-center text-yellow-400" title="Nivel oficial validado por Espadel Club">
          <ShieldCheck className="w-3.5 h-3.5 fill-yellow-400/20" />
        </span>
      )}
    </span>
  );
};
