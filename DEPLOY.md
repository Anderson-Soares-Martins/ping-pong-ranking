# 🚀 Deploy na Vercel - Guia Rápido

## Pré-requisitos

- Projeto configurado no Supabase
- Código commitado no Git
- Conta na Vercel

## Passos para Deploy

### 1. Através da Interface Web (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub/GitLab/Bitbucket
3. Clique em "Add New Project"
4. Importe o repositório `ping-pong-ranking`
5. A Vercel detectará automaticamente que é um projeto Next.js
6. Configure as variáveis de ambiente:
   - `SUPABASE_URL` → Sua URL do Supabase
   - `SUPABASE_PUBLISHABLE_KEY` → Sua chave publishable do Supabase
7. Clique em "Deploy"
8. Aguarde a build terminar (1-2 minutos)
9. Acesse sua aplicação no link fornecido!

### 2. Através da CLI

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça login
vercel login

# Configure variáveis de ambiente
vercel env add SUPABASE_URL production
vercel env add SUPABASE_PUBLISHABLE_KEY production

# Deploy em produção
vercel --prod
```

## Configuração Automática

A Vercel detecta automaticamente:
- ✅ Projeto Next.js
- ✅ Comando de build: `next build`
- ✅ Diretório de output: `.next`
- ✅ API Routes como serverless functions

## Variáveis de Ambiente

Configure no dashboard da Vercel:
- **SUPABASE_URL**: URL do seu projeto Supabase
- **SUPABASE_PUBLISHABLE_KEY**: Chave pública do Supabase

## Deploy Contínuo

Após configurar, cada push para a branch `main` fará deploy automático!

## Domínio Personalizado

1. Vá em "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções

## Monitoramento

- **Logs**: Acesse "Deployments" > Clique no deployment > "View Function Logs"
- **Analytics**: Disponível no dashboard da Vercel
- **Performance**: Métricas de Web Vitals

## Troubleshooting

### Erro de Build

```bash
# Teste localmente primeiro
npm run build
```

### API não funciona

Verifique se as variáveis de ambiente estão configuradas corretamente.

### Supabase Connection Error

Certifique-se que:
1. As variáveis estão corretas
2. O projeto Supabase está ativo
3. As tabelas foram criadas com o schema.sql

## Links Úteis

- [Documentação Vercel Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Dashboard Vercel](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
