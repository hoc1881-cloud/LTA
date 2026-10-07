import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import healthHandler from './api/health.js';
import busArrivalHandler from './api/bus-arrival.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => healthHandler(req, res));
app.get('/api/bus-arrival', (req, res) => busArrivalHandler(req, res));
app.get('/api/busArrival', (req, res) => busArrivalHandler(req, res));

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server in middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`> SG Transit Server running on http://0.0.0.0:${PORT}`);
    console.log(`> /api/health available`);
    console.log(`> /api/bus-arrival available (LTA DataMall v3 proxy)`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
