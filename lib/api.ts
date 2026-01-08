import { Player, MatchWithPlayers } from '@/types';

const API_URL = '/api';

// Players
export const getPlayers = async (): Promise<Player[]> => {
  const response = await fetch(`${API_URL}/players`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to fetch players');
  return response.json();
};

export const getPlayer = async (id: string): Promise<Player> => {
  const response = await fetch(`${API_URL}/players/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to fetch player');
  return response.json();
};

export const createPlayer = async (name: string): Promise<Player> => {
  const response = await fetch(`${API_URL}/players`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw { response: { status: response.status, data: error } };
  }
  return response.json();
};

export const deletePlayer = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/players/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete player');
};

// Matches
export const getMatches = async (): Promise<MatchWithPlayers[]> => {
  const response = await fetch(`${API_URL}/matches`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to fetch matches');
  return response.json();
};

export const getPlayerMatches = async (playerId: string): Promise<MatchWithPlayers[]> => {
  const response = await fetch(`${API_URL}/matches/player/${playerId}`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to fetch player matches');
  return response.json();
};

export const createMatch = async (
  player1_id: string,
  player2_id: string,
  winner_id: string
): Promise<MatchWithPlayers> => {
  const response = await fetch(`${API_URL}/matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      player1_id,
      player2_id,
      winner_id,
    }),
  });
  if (!response.ok) throw new Error('Failed to create match');
  return response.json();
};
