import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET /api/matches/player/:playerId - Histórico de um jogador específico
export async function GET(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  try {
    const { playerId } = params;

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

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching player matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player matches' },
      { status: 500 }
    );
  }
}
