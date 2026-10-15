import { Court } from '../types';

export const COURTS: Court[] = [
  {
    id: 'court-1',
    name: 'Pista 1 — Espadel Central Panorámica',
    type: 'Central',
    surface: 'Mondo Supercourt',
    indoor: true,
    priceHour: 32,
    features: ['Cristal Panorámico WPT', 'Iluminación LED Pro 1000 lux', 'Cámara Grabación HD'],
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'court-2',
    name: 'Pista 2 — Espadel Indoor Pro',
    type: 'Panorámica Cubierta',
    surface: 'Mondo Supercourt',
    indoor: true,
    priceHour: 28,
    features: ['Techo 11m climatizado', 'Césped texturado', 'Marcador Digital'],
    image: 'https://images.unsplash.com/photo-1592709823125-a191f07a2a5e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'court-3',
    name: 'Pista 3 — Espadel Cristal Cubierta',
    type: 'Panorámica Cubierta',
    surface: 'Césped Texturado',
    indoor: true,
    priceHour: 28,
    features: ['Salida de pista exterior homologada', 'Sin columnas'],
    image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'court-4',
    name: 'Pista 4 — Espadel Sunset Outdoor',
    type: 'Exterior',
    surface: 'Césped Texturado',
    indoor: false,
    priceHour: 22,
    features: ['Vista panorámica', 'Césped tradicional', 'Pérgola de descanso'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
  }
];
