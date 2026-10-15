import { ClubTheme } from '../types';

export const CLUBS: ClubTheme[] = [
  {
    id: 'espadel-club',
    name: 'Espadel Club',
    tagline: 'Centro Oficial de Pádel & Competición',
    logo: '⚡',
    primaryColor: '#facc15', // Vibrant Athletic Yellow
    secondaryColor: '#09090b', // Deep Slate / Pitch Black
    accentColor: '#eab308', // Amber Yellow
    courtCount: 10,
    address: 'Carrer de la Raqueta 24',
    city: 'Madrid'
  },
  {
    id: 'club-esmeralda',
    name: 'Real Club Padel Titanium',
    tagline: 'Centro de Alto Rendimiento',
    logo: '🎾',
    primaryColor: '#059669',
    secondaryColor: '#064e3b',
    accentColor: '#10b981',
    courtCount: 12,
    address: 'Av. del Deporte 42, Las Rozas',
    city: 'Madrid'
  },
  {
    id: 'club-ocean-blue',
    name: 'Blue Padel Arena',
    tagline: 'Pistas Panorámicas WPT',
    logo: '🌊',
    primaryColor: '#2563eb',
    secondaryColor: '#1e3a8a',
    accentColor: '#38bdf8',
    courtCount: 8,
    address: 'Paseo Marítimo 118',
    city: 'Valencia'
  }
];
