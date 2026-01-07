-- Tabela de Jogadores
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    rating INTEGER NOT NULL DEFAULT 1500,
    matches_played INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Partidas
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player1_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    player2_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    winner_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    player1_rating_before INTEGER NOT NULL,
    player2_rating_before INTEGER NOT NULL,
    player1_rating_after INTEGER NOT NULL,
    player2_rating_after INTEGER NOT NULL,
    rating_change INTEGER NOT NULL,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT different_players CHECK (player1_id != player2_id),
    CONSTRAINT valid_winner CHECK (winner_id = player1_id OR winner_id = player2_id)
);

-- Índices para performance
CREATE INDEX idx_players_rating ON players(rating DESC);
CREATE INDEX idx_matches_played_at ON matches(played_at DESC);
CREATE INDEX idx_matches_player1 ON matches(player1_id);
CREATE INDEX idx_matches_player2 ON matches(player2_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Desabilitado para simplicidade (pode ser habilitado depois)
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
