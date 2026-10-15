import React from 'react';
import { SkillCategory } from '../types';

interface LevelBadgeProps {
  level: number;
  category?: SkillCategory;
  size?: 'sm' | 'md' | 'lg';
  showCategory?: boolean;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  category,
  size = 'md',
  showCategory = true,
}) => {
  // Infer category if not supplied
  const cat = category || (level < 3.0 ? 'iniciacion' : level < 5.0 ? 'medio' : 'avanzado');

  let colors = {
    bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    dot: 'bg-emerald-400',
    label: 'Iniciación',
    gradient: 'from-emerald-500 to-teal-400'
  };

  if (cat === 'medio') {
    colors = {
      bg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
      dot: 'bg-blue-400',
      label: 'Nivel Medio',
      gradient: 'from-blue-500 to-indigo-400'
    };
  } else if (cat === 'avanzado') {
    colors = {
      bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      dot: 'bg-amber-400',
      label: 'Avanzado',
      gradient: 'from-amber-500 to-orange-400'
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
      title={`Nivel ${level.toFixed(1)} — ${colors.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
      <span className="font-bold">{level.toFixed(1)}</span>
      {showCategory && (
        <span className="text-[11px] opacity-80 border-l border-current/20 pl-1.5 font-sans font-normal">
          {colors.label}
        </span>
      )}
    </span>
  );
};
