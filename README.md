# 🏓 Ping Pong Ranking System

Sistema web completo para gerenciar ranking de ping pong usando o algoritmo **Elo Rating**, garantindo justiça nas pontuações mesmo com jogadores de níveis diferentes.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Deploy**: Vercel (suporte nativo ao Next.js)

## ✨ Funcionalidades

- ✅ Sistema Elo Rating - Algoritmo justo que ajusta pontos baseado na diferença de nível
- ✅ Cadastro de Jogadores - Adicionar/remover jogadores
- ✅ Ranking Dinâmico - Ordenado por rating com badges para top 3
- ✅ Registro de Partidas - Com previsão de mudança de rating
- ✅ Histórico Completo - Todas as partidas com detalhes
- ✅ Estatísticas por Jogador - Modal com stats detalhadas e últimas partidas
- ✅ Sequências (Streaks) - Tracking de vitórias/derrotas consecutivas
- ✅ Taxa de Vitória - Cálculo automático de win rate
- ✅ UI Responsiva - TailwindCSS com design moderno
- ✅ Deploy Ready - Configurado para Vercel

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- (Opcional) Conta na Vercel para deploy

## 🛠️ Setup Local

### 1. Setup do Supabase

1. Crie uma conta em [https://supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **SQL Editor** e execute o conteúdo do arquivo `supabase/schema.sql`
4. Vá em **Settings > API Keys** e copie:
   - **Project URL** (https://xxxxx.supabase.co)
   - **Publishable Key** (começa com `sb_publishable_...`)

> **📌 Nota**: Supabase está migrando para o novo modelo de chaves. Use sempre `Publishable Key` (sb*publishable*...) em vez da antiga `anon key`. A migração será obrigatória até final de 2026.

### 2. Instalação

```bash
# Clone o repositório
cd ping-pong-ranking

# Instale as dependências
npm install
```

### 3. Configuração das Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz:

```env
SUPABASE_URL=sua_url_aqui
SUPABASE_PUBLISHABLE_KEY=sua_publishable_key_aqui
```

### 4. Executar Localmente

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy na Vercel

### Opção 1: CLI da Vercel

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça login
vercel login

# Configure variáveis de ambiente
vercel env add SUPABASE_URL
vercel env add SUPABASE_PUBLISHABLE_KEY

# Deploy
vercel --prod
```

### Opção 2: Interface Web

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente no dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
3. Deploy automático!

## 📂 Estrutura do Projeto

```
ping-pong-ranking/
├── app/                  # Next.js App Router
│   ├── api/             # API Routes (Backend)
│   │   ├── health/
│   │   ├── players/
│   │   └── matches/
│   ├── layout.tsx       # Layout principal
│   ├── page.tsx         # Página inicial
│   └── globals.css      # Estilos globais
├── components/          # Componentes React
│   ├── PlayerList.tsx
│   ├── MatchForm.tsx
│   ├── MatchHistory.tsx
│   └── PlayerStats.tsx
├── lib/                 # Serviços e utilidades
│   ├── api.ts          # Client-side API service
│   ├── eloService.ts   # Lógica do algoritmo Elo
│   └── supabaseClient.ts # Cliente Supabase
├── types/              # TypeScript types
│   └── index.ts
├── supabase/
│   └── schema.sql      # Schema do banco de dados
└── package.json        # Dependências
```

## 🎮 Como Usar

1. **Adicione Jogadores**: Use o formulário no topo para adicionar jogadores
2. **Registre Partidas**: No painel direito, selecione os jogadores e o vencedor
3. **Veja o Ranking**: A tabela principal mostra o ranking atualizado em tempo real
4. **Estatísticas**: Clique em um jogador para ver suas estatísticas detalhadas
5. **Histórico**: Role para baixo para ver todas as partidas registradas

## 📊 Sistema Elo Rating

O sistema usa o algoritmo Elo com as seguintes características:

- **Rating Inicial**: 1500 pontos
- **K-Factor Adaptativo**:
  - Novatos (< 30 partidas): K = 32 (ajuste rápido)
  - Experientes (≥ 30 partidas): K = 16 (ajuste moderado)
- **Fórmula**:
  - Expectativa = 1 / (1 + 10^((RatingOponente - SeuRating) / 400))
  - NovoRating = RatingAtual + K × (Resultado - Expectativa)

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev           # Inicia servidor dev em http://localhost:3000

# Build para produção
npm run build         # Build otimizado para produção

# Produção
npm start             # Inicia servidor de produção

# Linting
npm run lint          # Verifica código com ESLint
```

## 🧪 API Endpoints

### Players

- `GET /api/players` - Lista todos os jogadores
- `GET /api/players/:id` - Busca jogador por ID
- `POST /api/players` - Cria novo jogador
- `DELETE /api/players/:id` - Remove jogador

### Matches

- `GET /api/matches` - Lista todas as partidas
- `GET /api/matches/player/:playerId` - Histórico de um jogador
- `POST /api/matches` - Registra nova partida

### Health

- `GET /api/health` - Health check do backend

## 🎨 Cores do Rating

- 🥇 **≥ 1700**: Dourado (Elite)
- 🥈 **1600-1699**: Roxo (Expert)
- 🥉 **1500-1599**: Azul (Intermediário)
- **1400-1499**: Verde (Iniciante)
- **< 1400**: Cinza (Novato)

## 🚧 Próximas Melhorias

- 🔒 Autenticação de usuários
- 📈 Gráficos de evolução de rating
- 🏆 Sistema de conquistas/badges
- 📱 PWA (Progressive Web App)
- 🔔 Notificações de partidas
- 📊 Dashboard com estatísticas avançadas
- 🎯 Modo torneio/playoffs
- 💬 Sistema de comentários nas partidas

## 📝 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**Desenvolvido com ❤️ usando React, TypeScript e Supabase**
