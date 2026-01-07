import { useState } from 'react';
import PlayerList from './components/PlayerList';
import MatchForm from './components/MatchForm';
import MatchHistory from './components/MatchHistory';
import PlayerStats from './components/PlayerStats';
import { Player } from './types';

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMatchCreated = () => {
    // Force refresh of all components
    setRefreshKey((prev) => prev + 1);
  };

  const handlePlayersChange = () => {
    // Force refresh when players are added/removed
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900">
            🏓 Ranking de Ping Pong
          </h1>
          <p className="mt-2 text-gray-600">
            Sistema de ranking com algoritmo Elo Rating
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ranking */}
          <div className="lg:col-span-2">
            <PlayerList
              key={`players-${refreshKey}`}
              onPlayerSelect={setSelectedPlayer}
              onPlayersChange={handlePlayersChange}
            />
          </div>

          {/* Right Column - Match Form */}
          <div className="space-y-8">
            <MatchForm
              key={`match-form-${refreshKey}`}
              onMatchCreated={handleMatchCreated}
            />
          </div>
        </div>

        {/* Match History */}
        <div className="mt-8">
          <MatchHistory key={`history-${refreshKey}`} />
        </div>
      </main>

      {/* Player Stats Modal */}
      {selectedPlayer && (
        <PlayerStats
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white shadow-md mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-600 text-sm">
            Desenvolvido com ❤️ | Sistema Elo Rating
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
