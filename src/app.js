import express from 'express';
import healthRouter from './routes/health.js';

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

app.use('/api/health', healthRouter);

// Qualquer rota /api/* que não existe
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'not_found' });
});

// Tratador de erros: nunca devolve detalhes internos ao cliente
app.use((err, _req, res, _next) => {
  const status = err.status >= 400 && err.status < 500 ? err.status : 500;
  if (status === 500) console.error(err);
  res
    .status(status)
    .json({ error: status === 500 ? 'internal_error' : 'bad_request' });
});

export default app;
