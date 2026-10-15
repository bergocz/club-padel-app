import { OpenMatch } from '../types';

export const INITIAL_MATCHES: OpenMatch[] = [
  // 19:00 - 20:30 (Franja estrella de tarde/noche)
  {
    id: 'match-1',
    courtName: 'Pista 1 — Central Panorámica',
    courtType: 'Central',
    date: 'Hoy, 15 Oct',
    time: '19:00 - 20:30',
    durationMinutes: 90,
    pricePerPlayer: 8.0,
    minLevel: 3.2,
    maxLevel: 4.2,
    status: 'almost_full',
    isCompetitive: true,
    notes: '¡Falta 1 jugador en el Revés para cerrar pista! Bolas nuevas Head Pro.',
    slots: [
      {
        position: 1,
        team: 'A',
        player: {
          id: 'p1',
          name: 'Javier Navarro',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          level: 3.7,
          category: 'medio',
          hand: 'Derecha',
          sidePreference: 'Revés', // Juega a la izquierda
          matchesPlayed: 72,
          winRate: 58,
          levelCertifiedByClub: true,
          radarStats: { tecnica: 7, paredes: 7, volea: 8, aereo: 6, tactica: 7 }
        }
      },
      {
        position: 2,
        team: 'A',
        player: {
          id: 'p2',
          name: 'Marcos Gil',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          level: 3.5,
          category: 'medio',
          hand: 'Derecha',
          sidePreference: 'Drive', // Juega a la derecha
          matchesPlayed: 41,
          winRate: 61,
          levelCertifiedByClub: false,
          radarStats: { tecnica: 6, paredes: 7, volea: 7, aereo: 6, tactica: 6 }
        }
      },
      {
        position: 3,
        team: 'B',
        player: undefined // HUECO LIBRE (Revés - Izquierda)
      },
      {
        position: 4,
        team: 'B',
        player: {
          id: 'p3',
          name: 'Sergio Valdés',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
          level: 4.2,
          category: 'medio',
          hand: 'Zurdo',
          sidePreference: 'Drive', // Juega a la derecha
          matchesPlayed: 110,
          winRate: 65,
          levelCertifiedByClub: true,
          radarStats: { tecnica: 8, paredes: 8, volea: 8, aereo: 7, tactica: 8 }
        }
      }
    ]
  },
  {
    id: 'match-2',
    courtName: 'Pista 2 — Cristal Indoor',
    courtType: 'Panorámica Cubierta',
    date: 'Hoy, 15 Oct',
    time: '19:00 - 20:30',
    durationMinutes: 90,
    pricePerPlayer: 7.0,
    minLevel: 1.8,
    maxLevel: 2.9,
    status: 'open',
    isCompetitive: false,
    notes: 'Partido iniciación/amistoso para practicar salida de pared sin presión. 2 huecos abiertos.',
    slots: [
      {
        position: 1,
        team: 'A',
        player: {
          id: 'p4',
          name: 'Lucía Morales',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          level: 2.3,
          category: 'iniciacion',
          hand: 'Derecha',
          sidePreference: 'Revés',
          matchesPlayed: 14,
          winRate: 45,
          levelCertifiedByClub: true,
          radarStats: { tecnica: 4, paredes: 3, volea: 4, aereo: 3, tactica: 4 }
        }
      },
      {
        position: 2,
        team: 'A',
        player: undefined // HUECO LIBRE (Drive - Derecha)
      },
      {
        position: 3,
        team: 'B',
        player: {
          id: 'p5',
          name: 'Andrea Ruiz',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
          level: 2.6,
          category: 'iniciacion',
          hand: 'Derecha',
          sidePreference: 'Revés',
          matchesPlayed: 22,
          winRate: 50,
          levelCertifiedByClub: false,
          radarStats: { tecnica: 5, paredes: 4, volea: 4, aereo: 3, tactica: 5 }
        }
      },
      {
        position: 4,
        team: 'B',
        player: undefined // HUECO LIBRE (Drive - Derecha)
      }
    ]
  },
  {
    id: 'match-3',
    courtName: 'Pista 4 — Arena Vertical',
    courtType: 'Panorámica Cubierta',
    date: 'Hoy, 15 Oct',
    time: '19:00 - 20:30',
    durationMinutes: 90,
    pricePerPlayer: 7.5,
    minLevel: 3.5,
    maxLevel: 4.8,
    status: 'open',
    isCompetitive: true,
    notes: 'Pista 4 vertical central en Nave B. Nivel medio-alto. 2 huecos abiertos.',
    slots: [
      {
        position: 1,
        team: 'A',
        player: {
          id: 'p7',
          name: 'Daniel Ortega',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
          level: 4.2,
          category: 'medio',
          hand: 'Derecha',
          sidePreference: 'Revés',
          matchesPlayed: 89,
          winRate: 63,
          radarStats: { tecnica: 8, paredes: 7, volea: 8, aereo: 8, tactica: 7 }
        }
      },
      {
        position: 2,
        team: 'A',
        player: {
          id: 'p8',
          name: 'Gonzalo Pardo',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
          level: 3.9,
          category: 'medio',
          hand: 'Derecha',
          sidePreference: 'Drive',
          matchesPlayed: 65,
          winRate: 55,
          radarStats: { tecnica: 7, paredes: 7, volea: 7, aereo: 7, tactica: 7 }
        }
      },
      {
        position: 3,
        team: 'B',
        player: undefined // HUECO LIBRE (Revés)
      },
      {
        position: 4,
        team: 'B',
        player: undefined // HUECO LIBRE (Drive)
      }
    ]
  },
  // 17:30 - 19:00
  {
    id: 'match-4',
    courtName: 'Pista 3 — Cubierta Pro',
    courtType: 'Panorámica Cubierta',
    date: 'Hoy, 15 Oct',
    time: '17:30 - 19:00',
    durationMinutes: 90,
    pricePerPlayer: 7.0,
    minLevel: 3.0,
    maxLevel: 4.0,
    status: 'open',
    isCompetitive: true,
    notes: 'Partido de media tarde. 3 plazas disponibles.',
    slots: [
      {
        position: 1,
        team: 'A',
        player: {
          id: 'p9',
          name: 'Raúl Medina',
          avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80',
          level: 3.8,
          category: 'medio',
          hand: 'Derecha',
          sidePreference: 'Revés',
          matchesPlayed: 44,
          winRate: 52,
          radarStats: { tecnica: 7, paredes: 6, volea: 7, aereo: 6, tactica: 7 }
        }
      },
      { position: 2, team: 'A', player: undefined },
      { position: 3, team: 'B', player: undefined },
      { position: 4, team: 'B', player: undefined }
    ]
  },
  {
    id: 'match-5',
    courtName: 'Pista 6 — Master Series',
    courtType: 'Panorámica Cubierta',
    date: 'Hoy, 15 Oct',
    time: '17:30 - 19:00',
    durationMinutes: 90,
    pricePerPlayer: 7.0,
    minLevel: 4.5,
    maxLevel: 6.0,
    status: 'almost_full',
    isCompetitive: true,
    notes: 'Nivel Avanzado. Falta drive en pareja B.',
    slots: [
      {
        position: 1,
        team: 'A',
        player: {
          id: 'p6',
          name: 'Álvaro Sanchís',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
          level: 5.6,
          category: 'avanzado',
          hand: 'Derecha',
          sidePreference: 'Revés',
          matchesPlayed: 230,
          winRate: 74,
          levelCertifiedByClub: true,
          radarStats: { tecnica: 9, paredes: 9, volea: 9, aereo: 9, tactica: 9 }
        }
      },
      {
        position: 2,
        team: 'A',
        player: {
          id: 'p10',
          name: 'Pablo Herrero',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
          level: 4.9,
          category: 'avanzado',
          hand: 'Derecha',
          sidePreference: 'Drive',
          matchesPlayed: 98,
          winRate: 60,
          radarStats: { tecnica: 8, paredes: 8, volea: 8, aereo: 7, tactica: 8 }
        }
      },
      {
        position: 3,
        team: 'B',
        player: {
          id: 'p11',
          name: 'Elena Costa',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
          level: 5.1,
          category: 'avanzado',
          hand: 'Derecha',
          sidePreference: 'Revés',
          matchesPlayed: 55,
          winRate: 60,
          radarStats: { tecnica: 8, paredes: 8, volea: 8, aereo: 7, tactica: 8 }
        }
      },
      { position: 4, team: 'B', player: undefined }
    ]
  },
  // 20:30 - 22:00 (Noche)
  {
    id: 'match-6',
    courtName: 'Pista 1 — Central Panorámica',
    courtType: 'Central',
    date: 'Hoy, 15 Oct',
    time: '20:30 - 22:00',
    durationMinutes: 90,
    pricePerPlayer: 8.0,
    minLevel: 4.0,
    maxLevel: 5.5,
    status: 'open',
    isCompetitive: true,
    notes: 'Pista central nocturna.',
    slots: [
      {
        position: 1,
        team: 'A',
        player: {
          id: 'p12',
          name: 'Cristian Soler',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
          level: 4.5,
          category: 'medio',
          hand: 'Zurdo',
          sidePreference: 'Drive',
          matchesPlayed: 60,
          winRate: 57,
          radarStats: { tecnica: 8, paredes: 7, volea: 7, aereo: 7, tactica: 8 }
        }
      },
      { position: 2, team: 'A', player: undefined },
      { position: 3, team: 'B', player: undefined },
      { position: 4, team: 'B', player: undefined }
    ]
  },
  // 10:00 - 11:30 (Mañana)
  {
    id: 'match-7',
    courtName: 'Pista 2 — Cristal Indoor',
    courtType: 'Panorámica Cubierta',
    date: 'Hoy, 15 Oct',
    time: '10:00 - 11:30',
    durationMinutes: 90,
    pricePerPlayer: 6.5,
    minLevel: 2.5,
    maxLevel: 3.5,
    status: 'open',
    isCompetitive: false,
    notes: 'Mañanero con café y almuerzo después en la cafetería del club.',
    slots: [
      {
        position: 1,
        team: 'A',
        player: {
          id: 'p4',
          name: 'Lucía Morales',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          level: 2.3,
          category: 'iniciacion',
          hand: 'Derecha',
          sidePreference: 'Revés',
          matchesPlayed: 14,
          winRate: 45,
          radarStats: { tecnica: 4, paredes: 3, volea: 4, aereo: 3, tactica: 4 }
        }
      },
      {
        position: 2,
        team: 'A',
        player: {
          id: 'p5',
          name: 'Andrea Ruiz',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
          level: 2.6,
          category: 'iniciacion',
          hand: 'Derecha',
          sidePreference: 'Drive',
          matchesPlayed: 22,
          winRate: 50,
          radarStats: { tecnica: 5, paredes: 4, volea: 4, aereo: 3, tactica: 5 }
        }
      },
      { position: 3, team: 'B', player: undefined },
      { position: 4, team: 'B', player: undefined }
    ]
  },
  // 08:30 - 10:00 (Apertura matinal)
  {
    id: 'match-8',
    courtName: 'Pista 5 — Panorámica WPT',
    courtType: 'Panorámica Cubierta',
    date: 'Hoy, 15 Oct',
    time: '08:30 - 10:00',
    durationMinutes: 90,
    pricePerPlayer: 6.0,
    minLevel: 3.0,
    maxLevel: 4.5,
    status: 'open',
    isCompetitive: true,
    notes: 'Primer turno de la mañana para empezar el día con pádel.',
    slots: [
      {
        position: 1,
        team: 'A',
        player: {
          id: 'p2',
          name: 'Marcos Gil',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          level: 3.5,
          category: 'medio',
          hand: 'Derecha',
          sidePreference: 'Drive',
          matchesPlayed: 41,
          winRate: 61,
          radarStats: { tecnica: 6, paredes: 7, volea: 7, aereo: 6, tactica: 6 }
        }
      },
      { position: 2, team: 'A', player: undefined },
      { position: 3, team: 'B', player: undefined },
      { position: 4, team: 'B', player: undefined }
    ]
  }
];
