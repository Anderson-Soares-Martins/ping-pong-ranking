import React, { useEffect, useState } from 'react';
import { MatchWithPlayers } from '../types';
import { getMatches } from '../services/api';

const MatchHistory: React.FC = () => {
  const [matches, setMatches] = useState<MatchWithPlayers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await getMatches();
      setMatches(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar histórico');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">📜 Histórico de Partidas</h2>
      </div>

      {matches.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          Nenhuma partida registrada ainda. Registre a primeira partida!
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {matches.map((match) => {
            const isPlayer1Winner = match.winner_id === match.player1_id;

            return (
              <div key={match.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  {/* Player 1 */}
                  <div className={`flex-1 ${isPlayer1Winner ? 'font-semibold' : ''}`}>
                    <div className="text-lg">
                      {isPlayer1Winner && '👑 '}
                      {match.player1.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {match.player1_rating_before} → {match.player1_rating_after}
                      <span
                        className={`ml-2 font-semibold ${
                          isPlayer1Winner ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isPlayer1Winner ? '+' : '-'}
                        {match.rating_change}
                      </span>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="px-4 text-gray-400 font-bold">VS</div>

                  {/* Player 2 */}
                  <div className={`flex-1 text-right ${!isPlayer1Winner ? 'font-semibold' : ''}`}>
                    <div className="text-lg">
                      {!isPlayer1Winner && '👑 '}
                      {match.player2.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {match.player2_rating_before} → {match.player2_rating_after}
                      <span
                        className={`ml-2 font-semibold ${
                          !isPlayer1Winner ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {!isPlayer1Winner ? '+' : '-'}
                        {match.rating_change}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Data */}
                <div className="mt-2 text-xs text-gray-400 text-center">
                  {formatDate(match.played_at)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatchHistory;
