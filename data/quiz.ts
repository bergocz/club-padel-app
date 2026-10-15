import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1_background',
    category: 'background',
    title: '¿Tienes experiencia previa en otros deportes de raqueta?',
    subtitle: 'Nos ayuda a evaluar tu transferencia motriz, timing y velocidad de reacción.',
    options: [
      {
        label: 'Ninguna experiencia en raqueta',
        description: 'El pádel es mi primer deporte de raqueta o pala.',
        points: 0
      },
      {
        label: 'Ping-pong / Bádminton o Frontón ocasional',
        description: 'Tengo noción básica del golpe y coordinación ojo-bola.',
        points: 1
      },
      {
        label: 'Tenis o Squash durante varios años (nivel aficionado)',
        description: 'Manejo buena aceleración de brazo, empuñadura y fuerza en golpes.',
        points: 2
      },
      {
        label: 'Tenis de competición / Federado',
        description: 'Excelente técnica, lectura de trayectorias, servicio y potencia.',
        points: 3
      }
    ]
  },
  {
    id: 'q2_frequency',
    category: 'frequency',
    title: '¿Con qué frecuencia juegas y cuánto tiempo llevas?',
    subtitle: 'La consistencia en pista afianza los reflejos y el ritmo de juego.',
    options: [
      {
        label: 'Menos de 6 meses o juego una vez al mes',
        description: 'Aún estoy descubriendo las reglas y posiciones básicas.',
        points: 0
      },
      {
        label: 'Entre 6 meses y 1 año (1 o 2 veces por semana)',
        description: 'Juego con regularidad y empiezo a disputar partidos completos con fluidez.',
        points: 1
      },
      {
        label: 'Entre 1 y 3 años (2 a 3 partidos semanales + clases)',
        description: 'Tengo ritmo constante, recibo o he recibido clases técnicas.',
        points: 2
      },
      {
        label: 'Más de 3 años entrenando y compitiendo semanalmente',
        description: 'Alta intensidad física, rutina de entrenamiento y torneos habituales.',
        points: 3
      }
    ]
  },
  {
    id: 'q3_paredes',
    category: 'paredes',
    title: '¿Cómo te defiendes con las paredes de cristal?',
    subtitle: 'El factor diferencial que separa el pádel del resto de deportes.',
    options: [
      {
        label: 'Huyo hacia adelante cuando la bola va a la pared',
        description: 'Prefiero golpear de bote pronto o en el aire antes de que toque el cristal.',
        points: 0
      },
      {
        label: 'Dejo pasar la pared de fondo pero me cuesta devolverla',
        description: 'A veces calculo mal la distancia o me quedo pegado al cristal.',
        points: 1
      },
      {
        label: 'Pared de fondo controlada y uso globos defensivos',
        description: 'Mido bien el rebote, me separo de la bola y abro ángulos para recuperar la red.',
        points: 2
      },
      {
        label: 'Domino doble pared (giros) y bajo la bola con agresividad',
        description: 'Leo la pared lateral + fondo, giro con naturalidad y meto bajada de pared veloz.',
        points: 4
      }
    ]
  },
  {
    id: 'q4_volea',
    category: 'volea',
    title: 'En la red: ¿Cómo es tu juego de volea?',
    subtitle: 'La zona donde se ganan el 80% de los puntos en el pádel.',
    options: [
      {
        label: 'Casi nunca subo a la red, me siento más seguro en el fondo',
        description: 'Si subo, tengo miedo al pelotazo y no suelo cerrar el punto.',
        points: 0
      },
      {
        label: 'Subo a la red y pongo la pala firme como un bloqueo',
        description: 'Mantengo la bola en juego pero no le doy profundidad ni efecto cortado.',
        points: 1
      },
      {
        label: 'Voleas cortadas con buena colocación hacia la reja o pies',
        description: 'Golpeo por delante del cuerpo con plano/cortado buscando zonas débiles.',
        points: 2
      },
      {
        label: 'Volea agresiva con peso, bloqueo de tiros potentes y anticipación',
        description: 'Domino cambios de dirección, volea rápida al cuerpo y cierres definitivos.',
        points: 3
      }
    ]
  },
  {
    id: 'q5_aereo',
    category: 'aereo',
    title: 'Frente a un globo rival: ¿Cuál es tu respuesta aérea?',
    subtitle: 'Bandeja, víbora o transición cuando te sobrepasan en la red.',
    options: [
      {
        label: 'Retrocedo corriendo hacia atrás o la dejo botar',
        description: 'No sé realizar la bandeja de perfil, pierdo la red inmediatamente.',
        points: 0
      },
      {
        label: 'Bandeja suave de seguridad para no perder la posición',
        description: 'Impacto la bola arriba pero sin mucho efecto; busco simplemente pasarla.',
        points: 1
      },
      {
        label: 'Bandeja profunda a las esquinas o víbora con efecto lateral',
        description: 'Perfilado rápido, bola rasa al cristal lateral o de fondo que apenas levanta.',
        points: 2
      },
      {
        label: 'Víbora letal con efecto a la reja y cambios de velocidad',
        description: 'Golpe muy rápido, bola que cae a plomo y muere en las paredes.',
        points: 3
      }
    ]
  },
  {
    id: 'q6_remate',
    category: 'remate',
    title: 'Cuando te queda una bola cómoda para rematar:',
    subtitle: 'Capacidad de definición y potencia aérea.',
    options: [
      {
        label: 'No suelo rematar o la tiro a la red/fuera si le pego fuerte',
        description: 'Prefiero no arriesgar y juego un golpe suave al fondo.',
        points: 0
      },
      {
        label: 'Remato plano hacia el cristal de fondo del rival',
        description: 'A veces rebota mucho y los rivales me contraatacan con facilidad.',
        points: 1
      },
      {
        label: 'Me la traigo a mi campo o busco sacarla por 3 metros',
        description: 'Impacto en el punto más alto con efecto top-spin buscando que supere la red de vuelta.',
        points: 2
      },
      {
        label: 'Remate por 4 y por 3 a voluntad con suspensión y técnica pura',
        description: 'Decisión certera de ángulo y potencia, punto ganado el 90% de las veces.',
        points: 3
      }
    ]
  },
  {
    id: 'q7_tactica',
    category: 'tactica',
    title: 'Entendimiento táctico y compenetración con tu pareja:',
    subtitle: 'El pádel es un deporte de parejas: sincronización y toma de decisiones.',
    options: [
      {
        label: 'Dudamos con las bolas del medio y a veces chocamos',
        description: 'Cada uno juega por su cuenta; falta comunicación constante.',
        points: 0
      },
      {
        label: 'Sabemos quién cubre el medio y subimos juntos a la red',
        description: 'Mantenemos la línea básica defensiva y de ataque sincronizados.',
        points: 1
      },
      {
        label: 'Transiciones fluidas: cuando uno es atacado, el otro bascula y cubre',
        description: 'Lectura de huecos, comunicación activa sobre la posición de los rivales.',
        points: 2
      },
      {
        label: 'Estrategia avanzada: juego a la nevera, cambios tácticos y lectura mental',
        description: 'Adaptación al juego del rival, juego sin bola y dominio de tiempos de partido.',
        points: 3
      }
    ]
  },
  {
    id: 'q8_competicion',
    category: 'competicion',
    title: '¿Qué experiencia tienes en torneos o ligas?',
    subtitle: 'Nivel de temple bajo presión y solidez competitiva.',
    options: [
      {
        label: 'Solo partidos informales / pachangas entre amigos',
        description: 'Juego puramente social y recreativo sin marcadores oficiales.',
        points: 0
      },
      {
        label: 'Torneos pozo, americanas de fin de semana o ligas internas del club',
        description: 'Acostumbrado a jugar con diferentes parejas y bajo tanteo competitivo.',
        points: 1
      },
      {
        label: 'Ligas federadas de 3ª o 4ª categoría / Torneos federados provinciales',
        description: 'Partidos de alta intensidad con jueces y puntos en ranking.',
        points: 2
      },
      {
        label: '1ª o 2ª categoría federada / Circuitos profesionales o semi-pro',
        description: 'Jugador élite con ranking oficial y preparación física específica.',
        points: 3
      }
    ]
  }
];

export function calculateSkillLevel(answers: Record<string, number>): {
  level: number;
  category: 'iniciacion' | 'medio' | 'avanzado';
  categoryLabel: string;
  radarStats: {
    tecnica: number;
    paredes: number;
    volea: number;
    aereo: number;
    tactica: number;
  };
} {
  // Max possible points:
  // q1: 3, q2: 3, q3: 4, q4: 3, q5: 3, q6: 3, q7: 3, q8: 3 = 25 max points.
  const p1 = answers['q1_background'] ?? 0;
  const p2 = answers['q2_frequency'] ?? 0;
  const p3 = answers['q3_paredes'] ?? 0;
  const p4 = answers['q4_volea'] ?? 0;
  const p5 = answers['q5_aereo'] ?? 0;
  const p6 = answers['q6_remate'] ?? 0;
  const p7 = answers['q7_tactica'] ?? 0;
  const p8 = answers['q8_competicion'] ?? 0;

  const totalPoints = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8;
  const maxPoints = 25;

  // Formula: Map 0-25 points onto 1.0 - 7.0
  // level = 1.0 + (totalPoints / maxPoints) * 6.0
  const rawLevel = 1.0 + (totalPoints / maxPoints) * 6.0;
  const level = Math.round(rawLevel * 10) / 10; // Round to 1 decimal, e.g. 3.4

  let category: 'iniciacion' | 'medio' | 'avanzado' = 'iniciacion';
  let categoryLabel = 'Iniciación';

  if (level < 3.0) {
    category = 'iniciacion';
    categoryLabel = level < 2.0 ? 'Iniciación Base' : 'Iniciación Avanzado';
  } else if (level < 5.0) {
    category = 'medio';
    if (level < 3.8) {
      categoryLabel = 'Nivel Medio Intermedio';
    } else {
      categoryLabel = 'Nivel Medio Alto';
    }
  } else {
    category = 'avanzado';
    categoryLabel = level >= 6.0 ? 'Avanzado Competición' : 'Avanzado Alto';
  }

  // Radar Stats (1 to 10)
  const tecnica = Math.min(10, Math.max(1, Math.round(((p1 + p6) / 6) * 9 + 1)));
  const paredes = Math.min(10, Math.max(1, Math.round((p3 / 4) * 9 + 1)));
  const volea = Math.min(10, Math.max(1, Math.round((p4 / 3) * 9 + 1)));
  const aereo = Math.min(10, Math.max(1, Math.round(((p5 + p6) / 6) * 9 + 1)));
  const tactica = Math.min(10, Math.max(1, Math.round(((p7 + p8) / 6) * 9 + 1)));

  return {
    level,
    category,
    categoryLabel,
    radarStats: {
      tecnica,
      paredes,
      volea,
      aereo,
      tactica
    }
  };
}
