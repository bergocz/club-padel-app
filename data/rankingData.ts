import { Player, PlayerMatchHistoryItem, FrequentPartner } from '../types';
import { calculateReliability } from '../utils/playtomicElo';

export const ESPADEL_CLUB_PLAYERS: Player[] = [
  // 1. Álvaro Sanchís (Avanzado #1)
  {
    id: 'p6',
    name: 'Álvaro Sanchís',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    level: 5.62,
    category: 'avanzado',
    hand: 'Derecha',
    sidePreference: 'Revés',
    matchesPlayed: 230,
    matchesWon: 170, // TOP 1 victorias
    matchesLost: 60,
    winRate: 74,
    reliabilityPercent: 99,
    levelPoints: 3450,
    currentStreak: 5,
    clubMemberNumber: 'ESPADEL-0014',
    levelCertifiedByClub: true,
    coachNotes: 'Capitán equipo federado A de Espadel Club. Golpeo x3 dominante y bajada de pared letal.',
    radarStats: { tecnica: 9, paredes: 9, volea: 9, aereo: 9, tactica: 9 },
    frequentPartners: [
      {
        partnerId: 'p3',
        partnerName: 'Sergio Valdés',
        partnerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        partnerLevel: 4.25,
        matchesTogether: 64,
        winsTogether: 52,
        winRate: 81,
        bestWinScore: '6-2, 6-3'
      },
      {
        partnerId: 'p11',
        partnerName: 'Elena Costa',
        partnerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        partnerLevel: 4.15,
        matchesTogether: 38,
        winsTogether: 29,
        winRate: 76,
        bestWinScore: '6-4, 7-5'
      }
    ],
    matchHistory: [
      {
        id: 'hist-p6-1',
        date: '14 Oct 2026',
        courtName: 'Pista 1 — Central Panorámica',
        result: 'won',
        score: '6-4, 6-3',
        partner: {
          id: 'p3',
          name: 'Sergio Valdés',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
          level: 4.25,
          sidePreference: 'Drive'
        },
        opponents: [
          { id: 'p7', name: 'Daniel Ortega', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', level: 4.20 },
          { id: 'p12', name: 'Cristian Soler', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80', level: 3.90 }
        ],
        levelDelta: 0.015,
        reliabilityAtMatch: 99,
        kFactorExplanation: 'Nivel muy consolidado (>50 partidos): K-factor mínimo (±0.015 por victoria).',
        userSidePlayed: 'Revés'
      },
      {
        id: 'hist-p6-2',
        date: '12 Oct 2026',
        courtName: 'Pista 6 — Master Series',
        result: 'won',
        score: '7-5, 6-4',
        partner: {
          id: 'p11',
          name: 'Elena Costa',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
          level: 4.15,
          sidePreference: 'Drive'
        },
        opponents: [
          { id: 'p1', name: 'Javier Navarro', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', level: 3.75 },
          { id: 'usr_me', name: 'Carlos Mendoza', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', level: 3.65 }
        ],
        levelDelta: 0.014,
        reliabilityAtMatch: 99,
        kFactorExplanation: 'Nivel consolidado (>200 partidos): Victoria contra pareja de nivel 3.7.',
        userSidePlayed: 'Revés'
      }
    ]
  },

  // 2. Sergio Valdés (Medio-Alto #2)
  {
    id: 'p3',
    name: 'Sergio Valdés',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    level: 4.25,
    category: 'medio',
    hand: 'Zurdo',
    sidePreference: 'Drive',
    matchesPlayed: 110,
    matchesWon: 72, // TOP 2 victorias
    matchesLost: 38,
    winRate: 65,
    reliabilityPercent: 95,
    levelPoints: 2180,
    currentStreak: 3,
    clubMemberNumber: 'ESPADEL-0402',
    levelCertifiedByClub: true,
    coachNotes: 'Excelente zurdo en el drive, remate por 3 consolidado y gran anticipación.',
    radarStats: { tecnica: 8, paredes: 8, volea: 8, aereo: 7, tactica: 8 },
    frequentPartners: [
      {
        partnerId: 'p6',
        partnerName: 'Álvaro Sanchís',
        partnerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
        partnerLevel: 5.62,
        matchesTogether: 64,
        winsTogether: 52,
        winRate: 81,
        bestWinScore: '6-2, 6-3'
      },
      {
        partnerId: 'usr_me',
        partnerName: 'Carlos Mendoza',
        partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        partnerLevel: 3.65,
        matchesTogether: 18,
        winsTogether: 12,
        winRate: 67,
        bestWinScore: '6-3, 7-5'
      }
    ],
    matchHistory: [
      {
        id: 'hist-p3-1',
        date: '14 Oct 2026',
        courtName: 'Pista 1 — Central Panorámica',
        result: 'won',
        score: '6-4, 6-3',
        partner: {
          id: 'p6',
          name: 'Álvaro Sanchís',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
          level: 5.62,
          sidePreference: 'Revés'
        },
        opponents: [
          { id: 'p7', name: 'Daniel Ortega', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', level: 4.20 },
          { id: 'p12', name: 'Cristian Soler', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80', level: 3.90 }
        ],
        levelDelta: 0.022,
        reliabilityAtMatch: 95,
        kFactorExplanation: 'Nivel consolidado (+0.022 pts con K=0.018).',
        userSidePlayed: 'Drive'
      }
    ]
  },

  // 3. Elena Costa (Medio-Alto #3)
  {
    id: 'p11',
    name: 'Elena Costa',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    level: 4.15,
    category: 'medio',
    hand: 'Derecha',
    sidePreference: 'Revés',
    matchesPlayed: 85,
    matchesWon: 52, // TOP 3 victorias
    matchesLost: 33,
    winRate: 61,
    reliabilityPercent: 92,
    levelPoints: 1820,
    currentStreak: 2,
    clubMemberNumber: 'ESPADEL-0630',
    levelCertifiedByClub: true,
    coachNotes: 'Juego muy ordenado de revés, pocas no forzadas y gran lectura táctica.',
    radarStats: { tecnica: 8, paredes: 7, volea: 8, aereo: 7, tactica: 8 },
    frequentPartners: [
      {
        partnerId: 'p6',
        partnerName: 'Álvaro Sanchís',
        partnerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
        partnerLevel: 5.62,
        matchesTogether: 38,
        winsTogether: 29,
        winRate: 76,
        bestWinScore: '6-4, 7-5'
      }
    ]
  },

  // 4. Javier Navarro (Medio #4)
  {
    id: 'p1',
    name: 'Javier Navarro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    level: 3.75,
    category: 'medio',
    hand: 'Derecha',
    sidePreference: 'Revés',
    matchesPlayed: 72,
    matchesWon: 42,
    matchesLost: 30,
    winRate: 58,
    reliabilityPercent: 89,
    levelPoints: 1540,
    currentStreak: 1,
    clubMemberNumber: 'ESPADEL-0824',
    levelCertifiedByClub: true,
    coachNotes: 'Buen ritmo de fondo y volea sólida.',
    radarStats: { tecnica: 7, paredes: 7, volea: 8, aereo: 6, tactica: 7 },
    frequentPartners: [
      {
        partnerId: 'p2',
        partnerName: 'Marcos Gil',
        partnerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        partnerLevel: 3.50,
        matchesTogether: 28,
        winsTogether: 18,
        winRate: 64,
        bestWinScore: '6-3, 6-4'
      }
    ]
  },

  // 5. Daniel Ortega (Medio #5)
  {
    id: 'p7',
    name: 'Daniel Ortega',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    level: 4.20,
    category: 'medio',
    hand: 'Derecha',
    sidePreference: 'Revés',
    matchesPlayed: 65,
    matchesWon: 39,
    matchesLost: 26,
    winRate: 60,
    reliabilityPercent: 87,
    levelPoints: 1490,
    currentStreak: 2,
    clubMemberNumber: 'ESPADEL-0518',
    levelCertifiedByClub: true,
    coachNotes: 'Pista 4 habitual, gran potencia de smash.',
    radarStats: { tecnica: 8, paredes: 7, volea: 8, aereo: 8, tactica: 7 }
  },

  // 6. Carlos Mendoza (TÚ - Usuario Actual #6)
  {
    id: 'usr_me',
    name: 'Carlos Mendoza',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    level: 3.65,
    category: 'medio',
    hand: 'Derecha',
    sidePreference: 'Revés',
    matchesPlayed: 48,
    matchesWon: 30, // 30 victorias
    matchesLost: 18,
    winRate: 62,
    reliabilityPercent: 82, // Fiabilidad Playtomic
    levelPoints: 1320,
    currentStreak: 3,
    clubMemberNumber: 'ESPADEL-1042',
    levelCertifiedByClub: true,
    coachNotes: 'Nivel validado por el Director Deportivo de Espadel Club tras evaluación en pista.',
    radarStats: {
      tecnica: 7,
      paredes: 6,
      volea: 8,
      aereo: 6,
      tactica: 7
    },
    frequentPartners: [
      {
        partnerId: 'p3',
        partnerName: 'Sergio Valdés',
        partnerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        partnerLevel: 4.25,
        matchesTogether: 18,
        winsTogether: 12,
        winRate: 67,
        bestWinScore: '6-3, 7-5'
      },
      {
        partnerId: 'p2',
        partnerName: 'Marcos Gil',
        partnerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        partnerLevel: 3.50,
        matchesTogether: 15,
        winsTogether: 9,
        winRate: 60,
        bestWinScore: '6-4, 6-2'
      },
      {
        partnerId: 'p1',
        partnerName: 'Javier Navarro',
        partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        partnerLevel: 3.75,
        matchesTogether: 10,
        winsTogether: 6,
        winRate: 60,
        bestWinScore: '7-5, 6-3'
      }
    ],
    matchHistory: [
      {
        id: 'hist-me-1',
        date: 'Ayer, 14 Oct',
        courtName: 'Pista 2 — Cristal Indoor',
        result: 'won',
        score: '6-3, 7-5',
        partner: {
          id: 'p3',
          name: 'Sergio Valdés',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
          level: 4.25,
          sidePreference: 'Drive'
        },
        opponents: [
          { id: 'p2', name: 'Marcos Gil', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', level: 3.50 },
          { id: 'p12', name: 'Cristian Soler', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80', level: 3.90 }
        ],
        levelDelta: 0.028,
        reliabilityAtMatch: 82,
        kFactorExplanation: 'Con 48 partidos jugados, tu nivel está consolidado (+0.028 por victoria ajustado a rivales).',
        userSidePlayed: 'Revés'
      },
      {
        id: 'hist-me-2',
        date: '11 Oct 2026',
        courtName: 'Pista 1 — Central Panorámica',
        result: 'won',
        score: '6-4, 6-2',
        partner: {
          id: 'p2',
          name: 'Marcos Gil',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          level: 3.50,
          sidePreference: 'Drive'
        },
        opponents: [
          { id: 'p1', name: 'Javier Navarro', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', level: 3.75 },
          { id: 'p9', name: 'Raúl Medina', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80', level: 3.80 }
        ],
        levelDelta: 0.031,
        reliabilityAtMatch: 81,
        kFactorExplanation: 'Nivel consolidado (+0.031 pts ganados). Gran rendimiento de pareja en red.',
        userSidePlayed: 'Revés'
      },
      {
        id: 'hist-me-3',
        date: '08 Oct 2026',
        courtName: 'Pista 4 — Central Vertical',
        result: 'lost',
        score: '5-7, 4-6',
        partner: {
          id: 'p1',
          name: 'Javier Navarro',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          level: 3.75,
          sidePreference: 'Drive'
        },
        opponents: [
          { id: 'p6', name: 'Álvaro Sanchís', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80', level: 5.62 },
          { id: 'p11', name: 'Elena Costa', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', level: 4.15 }
        ],
        levelDelta: -0.012,
        reliabilityAtMatch: 80,
        kFactorExplanation: 'Derrota ajustada contra rivales de nivel muy superior (5.6 y 4.1). Pérdida mínima (-0.012 pts).',
        userSidePlayed: 'Revés'
      }
    ]
  },

  // 7. Marcos Gil (Medio #7)
  {
    id: 'p2',
    name: 'Marcos Gil',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    level: 3.50,
    category: 'medio',
    hand: 'Derecha',
    sidePreference: 'Drive',
    matchesPlayed: 41,
    matchesWon: 25,
    matchesLost: 16,
    winRate: 61,
    reliabilityPercent: 79,
    levelPoints: 1150,
    currentStreak: 1,
    clubMemberNumber: 'ESPADEL-0919',
    levelCertifiedByClub: false,
    coachNotes: '',
    radarStats: { tecnica: 6, paredes: 7, volea: 7, aereo: 6, tactica: 6 }
  },

  // 8. Cristian Soler (Medio #8)
  {
    id: 'p12',
    name: 'Cristian Soler',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    level: 3.90,
    category: 'medio',
    hand: 'Zurdo',
    sidePreference: 'Drive',
    matchesPlayed: 38,
    matchesWon: 21,
    matchesLost: 17,
    winRate: 55,
    reliabilityPercent: 77,
    levelPoints: 980,
    currentStreak: 1,
    clubMemberNumber: 'ESPADEL-0711',
    levelCertifiedByClub: false,
    coachNotes: '',
    radarStats: { tecnica: 7, paredes: 7, volea: 7, aereo: 7, tactica: 7 }
  },

  // 9. Raúl Medina (Medio #9)
  {
    id: 'p9',
    name: 'Raúl Medina',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    level: 3.80,
    category: 'medio',
    hand: 'Derecha',
    sidePreference: 'Revés',
    matchesPlayed: 30,
    matchesWon: 16,
    matchesLost: 14,
    winRate: 53,
    reliabilityPercent: 72,
    levelPoints: 780,
    currentStreak: 0,
    clubMemberNumber: 'ESPADEL-0890',
    levelCertifiedByClub: false,
    coachNotes: '',
    radarStats: { tecnica: 7, paredes: 6, volea: 7, aereo: 6, tactica: 7 }
  },

  // 10. Andrea Ruiz (Iniciación #10)
  {
    id: 'p5',
    name: 'Andrea Ruiz',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    level: 2.60,
    category: 'iniciacion',
    hand: 'Derecha',
    sidePreference: 'Drive',
    matchesPlayed: 22,
    matchesWon: 11,
    matchesLost: 11,
    winRate: 50,
    reliabilityPercent: 64,
    levelPoints: 520,
    currentStreak: 1,
    clubMemberNumber: 'ESPADEL-1088',
    levelCertifiedByClub: false,
    coachNotes: 'Excelente progreso en iniciación.',
    radarStats: { tecnica: 5, paredes: 4, volea: 4, aereo: 3, tactica: 5 }
  },

  // 11. Lucía Morales (Iniciación #11)
  {
    id: 'p4',
    name: 'Lucía Morales',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    level: 2.30,
    category: 'iniciacion',
    hand: 'Derecha',
    sidePreference: 'Indiferente',
    matchesPlayed: 14,
    matchesWon: 6,
    matchesLost: 8,
    winRate: 43,
    reliabilityPercent: 52,
    levelPoints: 310,
    currentStreak: 0,
    clubMemberNumber: 'ESPADEL-1150',
    levelCertifiedByClub: true,
    coachNotes: 'Iniciación con buena progresión en pared de fondo.',
    radarStats: { tecnica: 4, paredes: 3, volea: 4, aereo: 3, tactica: 4 }
  },

  // 12. Mateo Ibáñez (Iniciación #12 - En Calibración)
  {
    id: 'p13',
    name: 'Mateo Ibáñez',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    level: 1.90,
    category: 'iniciacion',
    hand: 'Derecha',
    sidePreference: 'Drive',
    matchesPlayed: 8,
    matchesWon: 3,
    matchesLost: 5,
    winRate: 38,
    reliabilityPercent: 38, // Fase de calibración rápida estilo Playtomic
    levelPoints: 140,
    currentStreak: 1,
    clubMemberNumber: 'ESPADEL-1240',
    levelCertifiedByClub: false,
    coachNotes: 'Socio nuevo en fase de calibración inicial.',
    radarStats: { tecnica: 3, paredes: 3, volea: 3, aereo: 2, tactica: 3 }
  }
];
