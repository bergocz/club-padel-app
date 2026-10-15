import { Player } from '../types';

export const INITIAL_USER: Player = {
  id: 'usr_me',
  name: 'Carlos Mendoza',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  level: 3.6,
  category: 'medio',
  hand: 'Derecha',
  sidePreference: 'Revés',
  matchesPlayed: 48,
  winRate: 62,
  clubMemberNumber: 'ESPADEL-1042',
  levelCertifiedByClub: true,
  coachNotes: 'Nivel validado por el Director Deportivo de Espadel Club tras evaluación en pista.',
  radarStats: {
    tecnica: 7,
    paredes: 6,
    volea: 8,
    aereo: 6,
    tactica: 7
  }
};

export const MOCK_CLUB_PLAYERS: Player[] = [
  INITIAL_USER,
  {
    id: 'p1',
    name: 'Javier Navarro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    level: 3.7,
    category: 'medio',
    hand: 'Derecha',
    sidePreference: 'Revés',
    matchesPlayed: 72,
    winRate: 58,
    clubMemberNumber: 'ESPADEL-0824',
    levelCertifiedByClub: true,
    coachNotes: 'Buen ritmo de fondo y volea sólida.',
    radarStats: { tecnica: 7, paredes: 7, volea: 8, aereo: 6, tactica: 7 }
  },
  {
    id: 'p2',
    name: 'Marcos Gil',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    level: 3.5,
    category: 'medio',
    hand: 'Derecha',
    sidePreference: 'Drive',
    matchesPlayed: 41,
    winRate: 61,
    clubMemberNumber: 'ESPADEL-0919',
    levelCertifiedByClub: false,
    coachNotes: '',
    radarStats: { tecnica: 6, paredes: 7, volea: 7, aereo: 6, tactica: 6 }
  },
  {
    id: 'p3',
    name: 'Sergio Valdés',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    level: 4.2,
    category: 'medio',
    hand: 'Zurdo',
    sidePreference: 'Drive',
    matchesPlayed: 110,
    winRate: 65,
    clubMemberNumber: 'ESPADEL-0402',
    levelCertifiedByClub: true,
    coachNotes: 'Excelente zurdo en el drive, remate por 3 consolidado.',
    radarStats: { tecnica: 8, paredes: 8, volea: 8, aereo: 7, tactica: 8 }
  },
  {
    id: 'p4',
    name: 'Lucía Morales',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    level: 2.3,
    category: 'iniciacion',
    hand: 'Derecha',
    sidePreference: 'Indiferente',
    matchesPlayed: 14,
    winRate: 45,
    clubMemberNumber: 'ESPADEL-1150',
    levelCertifiedByClub: true,
    coachNotes: 'Iniciación con buena progresión en pared de fondo.',
    radarStats: { tecnica: 4, paredes: 3, volea: 4, aereo: 3, tactica: 4 }
  },
  {
    id: 'p6',
    name: 'Álvaro Sanchís',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    level: 5.6,
    category: 'avanzado',
    hand: 'Derecha',
    sidePreference: 'Revés',
    matchesPlayed: 230,
    winRate: 74,
    clubMemberNumber: 'ESPADEL-0014',
    levelCertifiedByClub: true,
    coachNotes: 'Jugador federado equipo A de Espadel Club.',
    radarStats: { tecnica: 9, paredes: 9, volea: 9, aereo: 9, tactica: 9 }
  }
];
