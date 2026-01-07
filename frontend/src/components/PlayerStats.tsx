import React, { useEffect, useState } from 'react';
import { Player, MatchWithPlayers } from '../types';
import { getPlayerMatches } from '../services/api';

interface PlayerStatsProps {
  player: Player;
  onClose: () => void;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, onClose }) => {
  const [matches, setMatches] = useState<MatchWithPlayers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data = await getPlayerMatches(player.id);
        setMatches(data);
      } catch (err) {
        console.error('Error fetching player matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [player.id]);

  const getWinRate = () => {
    if (player.matches_played === 0) return '0%';
    return ((player.wins / player.matches_played) * 100).toFixed(1) + '%';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold text-white">📊 {player.name}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{player.rating}</div>
            <div className="text-sm text-gray-600 mt-1">Rating</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">{player.wins}</div>
            <div className="text-sm text-gray-600 mt-1">Vitórias</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-600">{player.losses}</div>
            <div className="text-sm text-gray-600 mt-1">Derrotas</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600">{getWinRate()}</div>
            <div className="text-sm text-gray-600 mt-1">Taxa de Vitória</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600">{player.matches_played}</div>
            <div className="text-sm text-gray-600 mt-1">Partidas</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-orange-600">{player.best_streak}</div>
            <div className="text-sm text-gray-600 mt-1">Melhor Sequência</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg text-center col-span-2">
            <div className="text-3xl font-bold text-indigo-600">
              {player.current_streak > 0 ? '🔥' : player.current_streak < 0 ? '❄️' : '➖'}{' '}
              {Math.abs(player.current_streak)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Sequência Atual</div>
          </div>
        </div>

        {/* Match History */}
        <div className="px-6 pb-6">
          <h3 className="text-xl font-bold mb-4">Últimas Partidas</h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhuma partida ainda</div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => {
                const isPlayer1 = match.player1_id === player.id;
                const opponent = isPlayer1 ? match.player2 : match.player1;
                const won = match.winner_id === player.id;
                const ratingBefore = isPlayer1 ? match.player1_rating_before : match.player2_rating_before;
                const ratingAfter = isPlayer1 ? match.player1_rating_after : match.player2_rating_after;

                return (
                  <div
                    key={match.id}
                    className={`p-4 rounded-lg border-2 ${
                      won
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">
                          {won ? '✅ Vitória' : '❌ Derrota'} vs {opponent.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {ratingBefore} → {ratingAfter}
                          <span
                            className={`ml-2 font-semibold ${
                              won ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {won ? '+' : '-'}
                            {match.rating_change}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(match.played_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
