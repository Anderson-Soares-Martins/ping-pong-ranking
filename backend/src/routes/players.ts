import { Router } from 'express';
import { supabase } from '../services/supabaseClient.js';
import { CreatePlayerRequest, Player } from '../types/index.js';

const router = Router();

// GET /api/players - Lista todos os jogadores ordenados por rating
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('rating', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// GET /api/players/:id - Busca jogador por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

// POST /api/players - Cria novo jogador
router.post('/', async (req, res) => {
  try {
    const { name }: CreatePlayerRequest = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const { data, error } = await supabase
      .from('players')
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(409).json({ error: 'Player name already exists' });
      }
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

// DELETE /api/players/:id - Deleta jogador
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

export default router;
