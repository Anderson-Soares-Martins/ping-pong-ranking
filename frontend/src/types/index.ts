export interface Player {
  id: string;
  name: string;
  rating: number;
  matches_played: number;
  wins: number;
  losses: number;
  current_streak: number;
  best_streak: number;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  player1_id: string;
  player2_id: string;
  winner_id: string;
  player1_rating_before: number;
  player2_rating_before: number;
  player1_rating_after: number;
  player2_rating_after: number;
  rating_change: number;
  played_at: string;
}

export interface MatchWithPlayers extends Match {
  player1: Player;
  player2: Player;
  winner: Player;
}
