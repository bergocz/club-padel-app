import { Player } from '../types';
import { ESPADEL_CLUB_PLAYERS } from './rankingData';

export const INITIAL_USER: Player = ESPADEL_CLUB_PLAYERS.find(p => p.id === 'usr_me')!;

export const MOCK_CLUB_PLAYERS: Player[] = ESPADEL_CLUB_PLAYERS;
