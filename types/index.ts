export type SkillCategory = 'iniciacion' | 'medio' | 'avanzado';

export interface PlayerMatchHistoryItem {
  id: string;
  date: string;
  courtName: string;
  result: 'won' | 'lost';
  score: string; // e.g. "6-4, 7-5"
  partner: {
    id: string;
    name: string;
    avatar: string;
    level: number;
    sidePreference: 'Revés' | 'Drive';
  };
  opponents: [
    { id: string; name: string; avatar: string; level: number },
    { id: string; name: string; avatar: string; level: number }
  ];
  levelDelta: number; // e.g. +0.02 or -0.01
  reliabilityAtMatch: number; // e.g. 78%
  kFactorExplanation: string; // e.g. "Nivel consolidado (+0.02 pts al superar 40 partidos)"
  userSidePlayed: 'Revés' | 'Drive';
}

export interface FrequentPartner {
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerLevel: number;
  matchesTogether: number;
  winsTogether: number;
  winRate: number;
  bestWinScore?: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number; // e.g. 3.4
  category: SkillCategory;
  hand: 'Derecha' | 'Zurdo';
  sidePreference: 'Revés' | 'Drive' | 'Indiferente';
  matchesPlayed: number;
  matchesWon?: number; // Ranking por partidos ganados
  matchesLost?: number;
  winRate: number; // Percentage, e.g. 64%
  reliabilityPercent?: number; // Playtomic style: 20% to 99%
  levelPoints?: number; // Points in the club
  currentStreak?: number; // e.g. 3 victorias seguidas
  clubMemberNumber?: string;
  levelCertifiedByClub?: boolean;
  coachNotes?: string;
  radarStats: {
    tecnica: number;    // 1-10
    paredes: number;    // 1-10
    volea: number;      // 1-10
    aereo: number;      // 1-10
    tactica: number;    // 1-10
  };
  matchHistory?: PlayerMatchHistoryItem[];
  frequentPartners?: FrequentPartner[];
}

export interface MatchSlot {
  position: 1 | 2 | 3 | 4;
  player?: Player;
  team: 'A' | 'B';
}

export type MatchStatus = 'open' | 'almost_full' | 'full' | 'in_progress' | 'completed';

export interface OpenMatch {
  id: string;
  courtName: string;
  courtType: 'Panorámica Cubierta' | 'Cristal Pro' | 'Exterior' | 'Central';
  date: string; // ISO date or "Hoy, 15 Oct"
  time: string; // "18:00 - 19:30"
  durationMinutes: number;
  pricePerPlayer: number; // in euros
  minLevel: number;
  maxLevel: number;
  status: MatchStatus;
  slots: MatchSlot[];
  isCompetitive: boolean;
  notes?: string;
}

export interface Court {
  id: string;
  name: string;
  type: 'Panorámica Cubierta' | 'Cristal Pro' | 'Exterior' | 'Central';
  surface: 'Mondo Supercourt' | 'Césped Texturado' | 'Fibrilado';
  indoor: boolean;
  priceHour: number;
  features: string[];
  image: string;
}

export interface ClubTheme {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  primaryColor: string; // Hex
  secondaryColor: string; // Hex
  accentColor: string;
  courtCount: number;
  address: string;
  city: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  category: 'background' | 'frequency' | 'paredes' | 'volea' | 'aereo' | 'remate' | 'tactica' | 'competicion';
  options: {
    label: string;
    description: string;
    points: number; // 0 to 4
    iconName?: string;
  }[];
}
