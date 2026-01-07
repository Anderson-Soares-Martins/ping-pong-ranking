import axios from 'axios';
import { Player, MatchWithPlayers } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Players
export const getPlayers = async (): Promise<Player[]> => {
  const response = await api.get('/players');
  return response.data;
};

export const getPlayer = async (id: string): Promise<Player> => {
  const response = await api.get(`/players/${id}`);
  return response.data;
};

export const createPlayer = async (name: string): Promise<Player> => {
  const response = await api.post('/players', { name });
  return response.data;
};

export const deletePlayer = async (id: string): Promise<void> => {
  await api.delete(`/players/${id}`);
};

// Matches
export const getMatches = async (): Promise<MatchWithPlayers[]> => {
  const response = await api.get('/matches');
  return response.data;
};

export const getPlayerMatches = async (playerId: string): Promise<MatchWithPlayers[]> => {
  const response = await api.get(`/matches/player/${playerId}`);
  return response.data;
};

export const createMatch = async (
  player1_id: string,
  player2_id: string,
  winner_id: string
): Promise<MatchWithPlayers> => {
  const response = await api.post('/matches', {
    player1_id,
    player2_id,
    winner_id,
  });
  return response.data;
};

export default api;
