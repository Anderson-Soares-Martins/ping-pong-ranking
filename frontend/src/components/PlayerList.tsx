import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { getPlayers, createPlayer, deletePlayer } from '../services/api';

interface PlayerListProps {
  onPlayerSelect?: (player: Player) => void;
  onPlayersChange?: () => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ onPlayerSelect, onPlayersChange }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const data = await getPlayers();
      setPlayers(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar jogadores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    try {
      setIsAdding(true);
      await createPlayer(newPlayerName.trim());
      setNewPlayerName('');
      await fetchPlayers();
      onPlayersChange?.();
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert('Já existe um jogador com esse nome!');
      } else {
        alert('Erro ao adicionar jogador');
      }
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeletePlayer = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja remover ${name}? Isso também removerá todas as partidas.`)) {
      return;
    }

    try {
      await deletePlayer(id);
      await fetchPlayers();
      onPlayersChange?.();
    } catch (err) {
      alert('Erro ao remover jogador');
      console.error(err);
    }
  };

  const getWinRate = (player: Player): string => {
    if (player.matches_played === 0) return '0%';
    return ((player.wins / player.matches_played) * 100).toFixed(1) + '%';
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 1700) return 'text-yellow-600 font-bold';
    if (rating >= 1600) return 'text-purple-600 font-semibold';
    if (rating >= 1500) return 'text-blue-600';
    if (rating >= 1400) return 'text-green-600';
    return 'text-gray-600';
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
    <div className="space-y-6">
      {/* Formulário de Adicionar Jogador */}
      <form onSubmit={handleAddPlayer} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Adicionar Novo Jogador</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nome do jogador"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isAdding}
          />
          <button
            type="submit"
            disabled={isAdding || !newPlayerName.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isAdding ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </form>

      {/* Ranking de Jogadores */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">🏓 Ranking</h2>
        </div>

        {players.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum jogador cadastrado ainda. Adicione o primeiro jogador!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pos
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jogador
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partidas
                  </th>
                  <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    V / D
                  </th>
                  <th className="hidden lg:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa
                  </th>
                  <th className="hidden xl:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sequência
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.map((player, index) => (
                  <tr
                    key={player.id}
                    className="hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => onPlayerSelect?.(player)}
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className="text-lg md:text-xl font-bold text-gray-800">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `#${index + 1}`}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{player.name}</div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className={`text-xl md:text-2xl font-bold ${getRatingColor(player.rating)}`}>
                        {player.rating}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.matches_played}
                    </td>
                    <td className="hidden md:table-cell px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm">
                      <span className="text-green-600 font-semibold">{player.wins}</span>
                      {' / '}
                      <span className="text-red-600 font-semibold">{player.losses}</span>
                    </td>
                    <td className="hidden lg:table-cell px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">
                      {getWinRate(player)}
                    </td>
                    <td className="hidden xl:table-cell px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      {player.current_streak !== 0 && (
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            player.current_streak > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {player.current_streak > 0 ? '🔥' : '❄️'} {Math.abs(player.current_streak)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlayer(player.id, player.name);
                        }}
                        className="text-red-600 hover:text-red-800 font-medium text-xs md:text-sm"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerList;
