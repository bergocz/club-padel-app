export interface AerialCourt {
  id: string;
  number: number;
  name: string;
  nave: 'Nave A (Sala Principal)' | 'Nave B (Sala Anexa)';
  naveId: 'nave-a' | 'nave-b';
  orientation: 'horizontal' | 'vertical';
  surface: 'Mondo Supercourt Azul Oficial';
  indoor: boolean;
  priceHour: number;
  features: string[];
}

export const ESPADEL_COURTS: AerialCourt[] = [
  // Nave A: 2 pistas (1 y 2), ambas horizontales
  {
    id: 'court-1',
    number: 1,
    name: 'Pista 1 — Central Panorámica',
    nave: 'Nave A (Sala Principal)',
    naveId: 'nave-a',
    orientation: 'horizontal',
    surface: 'Mondo Supercourt Azul Oficial',
    indoor: true,
    priceHour: 32,
    features: ['Cristal Panorámico WPT', 'Césped Azul Oficial', 'LED 1000 lux', 'Cámara HD']
  },
  {
    id: 'court-2',
    number: 2,
    name: 'Pista 2 — Cristal Indoor',
    nave: 'Nave A (Sala Principal)',
    naveId: 'nave-a',
    orientation: 'horizontal',
    surface: 'Mondo Supercourt Azul Oficial',
    indoor: true,
    priceHour: 28,
    features: ['Techo 11m climatizado', 'Césped Azul Texturado', 'Marcador Digital']
  },
  // Nave B: 4 pistas (3, 4, 5, 6), Pista 4 vertical, el resto horizontales
  {
    id: 'court-3',
    number: 3,
    name: 'Pista 3 — Cubierta Pro',
    nave: 'Nave B (Sala Anexa)',
    naveId: 'nave-b',
    orientation: 'horizontal',
    surface: 'Mondo Supercourt Azul Oficial',
    indoor: true,
    priceHour: 28,
    features: ['Salida exterior reglamentaria', 'Césped Azul Pro', 'Sin columnas']
  },
  {
    id: 'court-4',
    number: 4,
    name: 'Pista 4 — Central Vertical',
    nave: 'Nave B (Sala Anexa)',
    naveId: 'nave-b',
    orientation: 'vertical',
    surface: 'Mondo Supercourt Azul Oficial',
    indoor: true,
    priceHour: 30,
    features: ['Disposición Vertical', 'Césped Azul WPT', 'Gradas laterales']
  },
  {
    id: 'court-5',
    number: 5,
    name: 'Pista 5 — Panorámica WPT',
    nave: 'Nave B (Sala Anexa)',
    naveId: 'nave-b',
    orientation: 'horizontal',
    surface: 'Mondo Supercourt Azul Oficial',
    indoor: true,
    priceHour: 28,
    features: ['Vidrio templado 12mm', 'Césped Azul Texturado', 'Iluminación Pro']
  },
  {
    id: 'court-6',
    number: 6,
    name: 'Pista 6 — Master Series',
    nave: 'Nave B (Sala Anexa)',
    naveId: 'nave-b',
    orientation: 'horizontal',
    surface: 'Mondo Supercourt Azul Oficial',
    indoor: true,
    priceHour: 28,
    features: ['Césped Azul Mondo', 'Climatización avanzada', 'Zona lounge']
  }
];

// Compatibility export
export const COURTS = ESPADEL_COURTS.map(c => ({
  id: c.id,
  name: c.name,
  type: c.number === 1 ? 'Central' as const : 'Panorámica Cubierta' as const,
  surface: 'Mondo Supercourt' as const,
  indoor: c.indoor,
  priceHour: c.priceHour,
  features: c.features,
  image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80'
}));
