/**
 * SISTEMA AVANZADO DE NIVEL Y FIABILIDAD (ESTILO PLAYTOMIC)
 * 
 * Principio:
 * - A pocos partidos jugados (fase de calibración): la fiabilidad es baja (20%-50%) 
 *   y el factor de cambio (K-factor) es ALTO (ej: +0.08 a +0.15 por victoria).
 * - A muchos partidos jugados (fase consolidada): la fiabilidad es alta (80%-99%)
 *   y el factor de cambio se reduce drásticamente (ej: +0.01 a +0.03 por victoria).
 */

export interface PlaytomicCalculationResult {
  delta: number;
  newLevel: number;
  reliabilityPercent: number;
  kFactor: number;
  explanation: string;
}

/**
 * Calcula el porcentaje de fiabilidad basado en el volumen de partidos.
 */
export function calculateReliability(matchesPlayed: number): number {
  if (matchesPlayed <= 0) return 20;
  // Curva logarítmica suave que sube rápido hasta 30 partidos y luego se asienta hasta 99%
  const rel = 20 + Math.min(79, Math.round(Math.log2(matchesPlayed + 1) * 12.5));
  return Math.min(99, Math.max(20, rel));
}

/**
 * Obtiene el K-factor dinámico:
 * - <= 10 partidos: 0.12 (calibración inicial)
 * - 11 a 25 partidos: 0.06 (asentamiento)
 * - 26 a 50 partidos: 0.03 (consolidado)
 * - > 50 partidos: 0.015 (muy consolidado)
 */
export function getKFactor(matchesPlayed: number): number {
  if (matchesPlayed <= 10) return 0.12;
  if (matchesPlayed <= 25) return 0.06;
  if (matchesPlayed <= 50) return 0.03;
  return 0.015;
}

/**
 * Calcula los puntos de nivel que se ganan o pierden tras un partido.
 */
export function calculatePlaytomicMatchResult(
  currentLevel: number,
  matchesPlayed: number,
  isVictory: boolean,
  opponentsAvgLevel: number = currentLevel
): PlaytomicCalculationResult {
  const k = getKFactor(matchesPlayed);
  const reliability = calculateReliability(matchesPlayed + 1);

  // Expectativa de victoria (ELO clásico adaptado a pádel)
  const diff = opponentsAvgLevel - currentLevel;
  const expectedWin = 1 / (1 + Math.pow(10, -diff / 2));
  const actualOutcome = isVictory ? 1 : 0;

  let rawDelta = k * (actualOutcome - expectedWin);

  // Redondear a 2 decimales
  let delta = Math.round(rawDelta * 100) / 100;

  // Garantizar ganancia mínima de 0.01 en victoria y pérdida mínima de 0.01 en derrota
  if (isVictory && delta <= 0) delta = 0.01;
  if (!isVictory && delta >= 0) delta = -0.01;

  // Límite de nivel entre 1.0 y 7.0
  const newLevel = Math.min(7.0, Math.max(1.0, Math.round((currentLevel + delta) * 100) / 100));

  let explanation = '';
  if (matchesPlayed <= 10) {
    explanation = `Fase de calibración (${matchesPlayed} partidos): K-factor alto (±${k}). El nivel sube/baja con más velocidad.`;
  } else if (matchesPlayed <= 25) {
    explanation = `Nivel en consolidación (${matchesPlayed} partidos): K-factor moderado (±${k}). Fiabilidad: ${reliability}%.`;
  } else if (matchesPlayed <= 50) {
    explanation = `Nivel consolidado (${matchesPlayed} partidos): K-factor reducido (±${k}). Fiabilidad: ${reliability}%.`;
  } else {
    explanation = `Nivel muy estable (${matchesPlayed} partidos): K-factor mínimo (±${k}). Fiabilidad máxima: ${reliability}%.`;
  }

  return {
    delta,
    newLevel,
    reliabilityPercent: reliability,
    kFactor: k,
    explanation
  };
}
