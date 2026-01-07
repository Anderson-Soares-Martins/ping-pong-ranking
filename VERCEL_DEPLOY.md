# 🚀 Guia de Deploy na Vercel

## Pré-requisitos

1. Conta na Vercel
2. Projeto conectado ao GitHub
3. Variáveis de ambiente configuradas na Vercel

## Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no painel da Vercel (Project Settings > Environment Variables):

### Backend
- `SUPABASE_URL` - URL do seu projeto Supabase
- `SUPABASE_PUBLISHABLE_KEY` - Chave pública do Supabase

### Frontend (Opcional)
- `VITE_API_URL` - URL da API (deixe em branco para usar `/api` automaticamente)

## Como Fazer Deploy

### Opção 1: Deploy Automático (Recomendado)

1. Conecte seu repositório GitHub à Vercel
2. A Vercel detectará automaticamente o `vercel.json`
3. Configure as variáveis de ambiente
4. O deploy acontecerá automaticamente a cada push

### Opção 2: Deploy Manual

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# No diretório raiz do projeto
vercel
```

## Como Funciona

A configuração `vercel.json` está otimizada para monorepo:

- **Frontend**: Build estático usando Vite (`@vercel/static-build`)
- **Backend**: Serverless function usando Node.js (`@vercel/node`)
- **Rotas**:
  - `/api/*` → Backend (serverless function)
  - `/*` → Frontend (arquivos estáticos)

## Estrutura de Build

```
npm run install:all  → Instala dependências do frontend e backend
npm run build        → Compila backend e frontend
```

## Troubleshooting

### Erro: Build falha
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme que o TypeScript compila sem erros localmente

### Erro: API não funciona
- Verifique se as rotas `/api/*` estão apontando para o backend
- Confirme que `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` estão configuradas

### Frontend não carrega
- Verifique se o build do frontend gerou a pasta `dist/`
- Confirme que as rotas estáticas estão configuradas corretamente

