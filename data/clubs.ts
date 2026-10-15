import { ClubTheme } from '../types';

export const CLUBS: ClubTheme[] = [
  {
    id: 'club-esmeralda',
    name: 'Real Club Padel Titanium',
    tagline: 'Centro de Alto Rendimiento & Padel Social',
    logo: '🎾',
    primaryColor: '#059669', // Emerald 600
    secondaryColor: '#064e3b', // Emerald 900
    accentColor: '#10b981', // Emerald 500
    courtCount: 12,
    address: 'Av. del Deporte 42, Las Rozas',
    city: 'Madrid'
  },
  {
    id: 'club-ocean-blue',
    name: 'Blue Padel Arena',
    tagline: 'Pistas Panorámicas WPT & Academia Pro',
    logo: '⚡',
    primaryColor: '#2563eb', // Blue 600
    secondaryColor: '#1e3a8a', // Blue 900
    accentColor: '#38bdf8', // Sky 400
    courtCount: 8,
    address: 'Paseo Marítimo 118',
    city: 'Valencia'
  },
  {
    id: 'club-amber-luxe',
    name: 'Club Padel Royal Amber',
    tagline: 'Experiencia Premium & Padel Club Boutique',
    logo: '👑',
    primaryColor: '#d97706', // Amber 600
    secondaryColor: '#78350f', // Amber 900
    accentColor: '#fbbf24', // Amber 400
    courtCount: 6,
    address: 'Carrer de Sarrià 77',
    city: 'Barcelona'
  }
];
