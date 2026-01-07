import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import playersRouter from './routes/players.js';
import matchesRouter from './routes/matches.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/players', playersRouter);
app.use('/api/matches', matchesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// For Vercel serverless functions
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - GET  /api/players`);
    console.log(`   - POST /api/players`);
    console.log(`   - GET  /api/matches`);
    console.log(`   - POST /api/matches`);
  });
}
