import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { getPlayers, createMatch } from '../services/api';

interface MatchFormProps {
  onMatchCreated?: () => void;
}

const MatchForm: React.FC<MatchFormProps> = ({ onMatchCreated }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [winnerId, setWinnerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimatedChange, setEstimatedChange] = useState<number | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const data = await getPlayers();
      setPlayers(data);
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  };

  // Calcula mudança estimada de rating
  useEffect(() => {
    if (!player1Id || !player2Id || !winnerId) {
      setEstimatedChange(null);
      return;
    }

    const player1 = players.find((p) => p.id === player1Id);
    const player2 = players.find((p) => p.id === player2Id);

    if (!player1 || !player2) return;

    const rating1 = player1.rating;
    const rating2 = player2.rating;
    const kFactor = 32;

    const expected1 = 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
    const expected2 = 1 / (1 + Math.pow(10, (rating1 - rating2) / 400));

    const score1 = winnerId === player1Id ? 1 : 0;
    const score2 = winnerId === player2Id ? 1 : 0;

    const change1 = Math.round(kFactor * (score1 - expected1));
    const change2 = Math.round(kFactor * (score2 - expected2));

    setEstimatedChange(Math.abs(change1));
  }, [player1Id, player2Id, winnerId, players]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!player1Id || !player2Id || !winnerId) {
      alert('Selecione ambos os jogadores e o vencedor');
      return;
    }

    if (player1Id === player2Id) {
      alert('Os jogadores devem ser diferentes');
      return;
    }

    try {
      setLoading(true);
      await createMatch(player1Id, player2Id, winnerId);

      // Reset form
      setPlayer1Id('');
      setPlayer2Id('');
      setWinnerId('');
      setEstimatedChange(null);

      // Refresh players data
      await fetchPlayers();

      // Notify parent
      onMatchCreated?.();
    } catch (err) {
      alert('Erro ao registrar partida');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPlayerInfo = (id: string) => players.find((p) => p.id === id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 Registrar Partida</h2>

      {players.length < 2 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          É necessário pelo menos 2 jogadores cadastrados para registrar uma partida.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Jogador 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jogador 1
            </label>
            <select
              value={player1Id}
              onChange={(e) => setPlayer1Id(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o jogador 1</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.rating})
                </option>
              ))}
            </select>
          </div>

          {/* VS Separator */}
          <div className="text-center text-2xl font-bold text-gray-400">VS</div>

          {/* Jogador 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jogador 2
            </label>
            <select
              value={player2Id}
              onChange={(e) => setPlayer2Id(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o jogador 2</option>
              {players
                .filter((p) => p.id !== player1Id)
                .map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name} ({player.rating})
                  </option>
                ))}
            </select>
          </div>

          {/* Vencedor */}
          {player1Id && player2Id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vencedor
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setWinnerId(player1Id)}
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    winnerId === player1Id
                      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {getPlayerInfo(player1Id)?.name}
                </button>
                <button
                  type="button"
                  onClick={() => setWinnerId(player2Id)}
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    winnerId === player2Id
                      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {getPlayerInfo(player2Id)?.name}
                </button>
              </div>
            </div>
          )}

          {/* Estimativa de Mudança */}
          {estimatedChange !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Mudança estimada de rating:</strong> ±{estimatedChange} pontos
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !player1Id || !player2Id || !winnerId}
            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Registrando...' : 'Registrar Partida'}
          </button>
        </form>
      )}
    </div>
  );
};

export default MatchForm;
