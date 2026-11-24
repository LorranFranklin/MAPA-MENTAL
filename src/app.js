// main.js ou app.js

import express from 'express';
import healthRouter from './routes/health.js'; // Ajuste o caminho conforme sua estrutura de pastas

const app = express();

// --- 1. Configurações de Segurança e Middleware ---

// Desabilita o cabeçalho "X-Powered-By" (Segurança básica)
app.set('x-powered-by', false);
app.disable('x-powered-by'); // Redundância opcional, mas boa prática para versões antigas/novas

// Middleware para parsear JSON com limite de 100kb
// Isso previne ataques de DoS enviando arquivos gigantescos em formato JSON
app.use(express.json({ limit: '100kb' }));

// --- 2. Definição de Rotas Específicas ---
// Sempre defina rotas específicas ANTES das genéricas.
app.use('/api/health', healthRouter);

// --- 3. Rota Catch-all para /api/* (Lida com 404s nativos) ---
// Esta rota captura qualquer requisição que comece com /api mas não tenha sido
// capturada pelas rotas anteriores (ex: GET /api/usuarios).
// O Express gera automaticamente um erro ERES_NOT_FOUND (404) aqui.
app.use('/api', (_req, res) => {
  // Responde manualmente para garantir o formato JSON exato solicitado
  res.status(404).json({ error: 'not_found' });
});

// --- 4. Tratador de Erros Global (Ultimo da cadeia lógica) ---
// Deve vir no final da configuração. Captura erros de parse, erros de rota não mapeados
// que escaparam do catch-all acima (embora raro com o passo 3), e erros do servidor.
app.use((err, _req, res, next) => {
  // Lógica para identificar o tipo de erro baseado no status code fornecido pelo Express
  const status = err.status >= 400 && err.status < 500 ? err.status : 500;

  if (status === 500) {
    console.error('[Internal Server Error]', err.message);
    // Em produção real, talvez queira enviar log para serviço externo aqui
  } else if (status === 400) {
    console.error('[Bad Request]', err.message);
  }

  // Nunca exiba o stack trace completo ao cliente em produção se for erro interno
  return res.status(status).json({
    error: status === 500 ? 'internal_error' : 'bad_request',
  });
});

export default app;
