import express from 'express';
import app from './app.js';

const port = process.env.PORT ?? 3000;

// Serve os arquivos da pasta public (HTML, CSS, JS do front-end)
app.use(express.static('public'));

// Inicia localmente se não estiver na Vercel
if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`Servidor em http://localhost:${port}`));
}

export default app;
