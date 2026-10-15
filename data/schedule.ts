export interface TimeSlotOption {
  id: string;
  time: string; // e.g. "08:30 - 10:00"
  startTime: string; // "08:30"
  endTime: string; // "10:00"
  durationMinutes: 90 | 60;
  period: 'mañana' | 'mediodia' | 'tarde' | 'noche';
}

export const CLUB_HOURS = {
  open: '07:00',
  close: '23:00',
  description: 'Abierto todos los días de 7:00 a 23:00'
};

// 90 minutes (1h 30m - Habitual en pádel)
export const TIME_SLOTS_90MIN: TimeSlotOption[] = [
  { id: 'slot-90-1', time: '07:00 - 08:30', startTime: '07:00', endTime: '08:30', durationMinutes: 90, period: 'mañana' },
  { id: 'slot-90-2', time: '08:30 - 10:00', startTime: '08:30', endTime: '10:00', durationMinutes: 90, period: 'mañana' },
  { id: 'slot-90-3', time: '10:00 - 11:30', startTime: '10:00', endTime: '11:30', durationMinutes: 90, period: 'mañana' },
  { id: 'slot-90-4', time: '11:30 - 13:00', startTime: '11:30', endTime: '13:00', durationMinutes: 90, period: 'mediodia' },
  { id: 'slot-90-5', time: '13:00 - 14:30', startTime: '13:00', endTime: '14:30', durationMinutes: 90, period: 'mediodia' },
  { id: 'slot-90-6', time: '14:30 - 16:00', startTime: '14:30', endTime: '16:00', durationMinutes: 90, period: 'tarde' },
  { id: 'slot-90-7', time: '16:00 - 17:30', startTime: '16:00', endTime: '17:30', durationMinutes: 90, period: 'tarde' },
  { id: 'slot-90-8', time: '17:30 - 19:00', startTime: '17:30', endTime: '19:00', durationMinutes: 90, period: 'tarde' },
  { id: 'slot-90-9', time: '19:00 - 20:30', startTime: '19:00', endTime: '20:30', durationMinutes: 90, period: 'noche' },
  { id: 'slot-90-10', time: '20:30 - 22:00', startTime: '20:30', endTime: '22:00', durationMinutes: 90, period: 'noche' },
  { id: 'slot-90-11', time: '21:30 - 23:00', startTime: '21:30', endTime: '23:00', durationMinutes: 90, period: 'noche' }
];

// 60 minutes (1h - Reserva rápida)
export const TIME_SLOTS_60MIN: TimeSlotOption[] = [
  { id: 'slot-60-1', time: '07:00 - 08:00', startTime: '07:00', endTime: '08:00', durationMinutes: 60, period: 'mañana' },
  { id: 'slot-60-2', time: '08:00 - 09:00', startTime: '08:00', endTime: '09:00', durationMinutes: 60, period: 'mañana' },
  { id: 'slot-60-3', time: '09:00 - 10:00', startTime: '09:00', endTime: '10:00', durationMinutes: 60, period: 'mañana' },
  { id: 'slot-60-4', time: '10:00 - 11:00', startTime: '10:00', endTime: '11:00', durationMinutes: 60, period: 'mañana' },
  { id: 'slot-60-5', time: '11:00 - 12:00', startTime: '11:00', endTime: '12:00', durationMinutes: 60, period: 'mediodia' },
  { id: 'slot-60-6', time: '12:00 - 13:00', startTime: '12:00', endTime: '13:00', durationMinutes: 60, period: 'mediodia' },
  { id: 'slot-60-7', time: '13:00 - 14:00', startTime: '13:00', endTime: '14:00', durationMinutes: 60, period: 'mediodia' },
  { id: 'slot-60-8', time: '14:00 - 15:00', startTime: '14:00', endTime: '15:00', durationMinutes: 60, period: 'tarde' },
  { id: 'slot-60-9', time: '15:00 - 16:00', startTime: '15:00', endTime: '16:00', durationMinutes: 60, period: 'tarde' },
  { id: 'slot-60-10', time: '16:00 - 17:00', startTime: '16:00', endTime: '17:00', durationMinutes: 60, period: 'tarde' },
  { id: 'slot-60-11', time: '17:00 - 18:00', startTime: '17:00', endTime: '18:00', durationMinutes: 60, period: 'tarde' },
  { id: 'slot-60-12', time: '18:00 - 19:00', startTime: '18:00', endTime: '19:00', durationMinutes: 60, period: 'tarde' },
  { id: 'slot-60-13', time: '19:00 - 20:00', startTime: '19:00', endTime: '20:00', durationMinutes: 60, period: 'noche' },
  { id: 'slot-60-14', time: '20:00 - 21:00', startTime: '20:00', endTime: '21:00', durationMinutes: 60, period: 'noche' },
  { id: 'slot-60-15', time: '21:00 - 22:00', startTime: '21:00', endTime: '22:00', durationMinutes: 60, period: 'noche' },
  { id: 'slot-60-16', time: '22:00 - 23:00', startTime: '22:00', endTime: '23:00', durationMinutes: 60, period: 'noche' }
];

export const SCHEDULE_DATES = [
  { label: 'Hoy', date: 'Hoy, 15 Oct', dayName: 'Jueves' },
  { label: 'Mañana', date: 'Mañana, 16 Oct', dayName: 'Viernes' },
  { label: 'Sábado', date: 'Sábado, 17 Oct', dayName: 'Sábado' },
  { label: 'Domingo', date: 'Domingo, 18 Oct', dayName: 'Domingo' },
  { label: 'Lunes', date: 'Lunes, 19 Oct', dayName: 'Lunes' }
];
