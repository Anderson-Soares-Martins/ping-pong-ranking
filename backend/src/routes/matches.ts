import { Router } from 'express';
import { supabase } from '../services/supabaseClient.js';
import { calculateEloRating, getKFactor } from '../services/eloService.js';
import { CreateMatchRequest, Player } from '../types/index.js';

const router = Router();

// GET /api/matches - Lista todas as partidas com informações dos jogadores
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        player1:player1_id(id, name, rating),
        player2:player2_id(id, name, rating),
        winner:winner_id(id, name, rating)
      `)
      .order('played_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// GET /api/matches/player/:playerId - Histórico de um jogador específico
router.get('/player/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;

    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        player1:player1_id(id, name, rating),
        player2:player2_id(id, name, rating),
        winner:winner_id(id, name, rating)
      `)
      .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`)
      .order('played_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching player matches:', error);
    res.status(500).json({ error: 'Failed to fetch player matches' });
  }
});

// POST /api/matches - Registra nova partida e atualiza ratings
router.post('/', async (req, res) => {
  try {
    const { player1_id, player2_id, winner_id }: CreateMatchRequest = req.body;

    // Validação básica
    if (!player1_id || !player2_id || !winner_id) {
      return res.status(400).json({ error: 'All player IDs are required' });
    }

    if (player1_id === player2_id) {
      return res.status(400).json({ error: 'Players must be different' });
    }

    if (winner_id !== player1_id && winner_id !== player2_id) {
      return res.status(400).json({ error: 'Winner must be one of the players' });
    }

    // Busca informações dos jogadores
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .in('id', [player1_id, player2_id]);

    if (playersError) throw playersError;
    if (!players || players.length !== 2) {
      return res.status(404).json({ error: 'One or both players not found' });
    }

    const player1 = players.find(p => p.id === player1_id)!;
    const player2 = players.find(p => p.id === player2_id)!;

    // Calcula novos ratings usando Elo
    const kFactor = Math.max(getKFactor(player1.matches_played), getKFactor(player2.matches_played));
    const eloResult = calculateEloRating(player1, player2, winner_id === player1_id, kFactor);

    // Atualiza streaks
    const player1Won = winner_id === player1_id;
    const player1NewStreak = player1Won ? Math.max(0, player1.current_streak) + 1 : Math.min(0, player1.current_streak) - 1;
    const player2NewStreak = !player1Won ? Math.max(0, player2.current_streak) + 1 : Math.min(0, player2.current_streak) - 1;

    // Inicia transação (múltiplas operações)
    // 1. Insere partida
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert([{
        player1_id,
        player2_id,
        winner_id,
        player1_rating_before: player1.rating,
        player2_rating_before: player2.rating,
        player1_rating_after: eloResult.player1NewRating,
        player2_rating_after: eloResult.player2NewRating,
        rating_change: eloResult.ratingChange,
      }])
      .select(`
        *,
        player1:player1_id(id, name, rating),
        player2:player2_id(id, name, rating),
        winner:winner_id(id, name, rating)
      `)
      .single();

    if (matchError) throw matchError;

    // 2. Atualiza Player 1
    const { error: player1Error } = await supabase
      .from('players')
      .update({
        rating: eloResult.player1NewRating,
        matches_played: player1.matches_played + 1,
        wins: player1.wins + (player1Won ? 1 : 0),
        losses: player1.losses + (player1Won ? 0 : 1),
        current_streak: player1NewStreak,
        best_streak: Math.max(player1.best_streak, player1NewStreak),
      })
      .eq('id', player1_id);

    if (player1Error) throw player1Error;

    // 3. Atualiza Player 2
    const { error: player2Error } = await supabase
      .from('players')
      .update({
        rating: eloResult.player2NewRating,
        matches_played: player2.matches_played + 1,
        wins: player2.wins + (!player1Won ? 1 : 0),
        losses: player2.losses + (!player1Won ? 0 : 1),
        current_streak: player2NewStreak,
        best_streak: Math.max(player2.best_streak, player2NewStreak),
      })
      .eq('id', player2_id);

    if (player2Error) throw player2Error;

    res.status(201).json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: 'Failed to create match' });
  }
});

export default router;
