import { Player, EloResult } from '../types/index.js';

/**
 * Calcula o novo rating Elo para dois jogadores após uma partida
 *
 * Fórmula Elo:
 * - Expectativa = 1 / (1 + 10^((RatingOponente - SeuRating) / 400))
 * - NovoRating = RatingAtual + K × (Resultado - Expectativa)
 *
 * @param player1 - Jogador 1
 * @param player2 - Jogador 2
 * @param player1Won - True se jogador 1 venceu, False se jogador 2 venceu
 * @param kFactor - Fator K (padrão: 32 para novatos, 16 para experientes)
 * @returns Novos ratings e mudança de pontos
 */
export function calculateEloRating(
  player1: Player,
  player2: Player,
  player1Won: boolean,
  kFactor: number = 32
): EloResult {
  const rating1 = player1.rating;
  const rating2 = player2.rating;

  // Calcula a expectativa de vitória para cada jogador
  const expected1 = 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
  const expected2 = 1 / (1 + Math.pow(10, (rating1 - rating2) / 400));

  // Resultado real (1 = vitória, 0 = derrota)
  const score1 = player1Won ? 1 : 0;
  const score2 = player1Won ? 0 : 1;

  // Calcula novos ratings
  const newRating1 = Math.round(rating1 + kFactor * (score1 - expected1));
  const newRating2 = Math.round(rating2 + kFactor * (score2 - expected2));

  // Calcula a mudança (sempre positivo para o vencedor)
  const ratingChange = Math.abs(newRating1 - rating1);

  return {
    player1NewRating: newRating1,
    player2NewRating: newRating2,
    ratingChange,
  };
}

/**
 * Determina o fator K baseado no número de partidas jogadas
 * - Novatos (< 30 partidas): K = 32 (ajuste rápido)
 * - Experientes (>= 30 partidas): K = 16 (ajuste moderado)
 */
export function getKFactor(matchesPlayed: number): number {
  return matchesPlayed < 30 ? 32 : 16;
}
