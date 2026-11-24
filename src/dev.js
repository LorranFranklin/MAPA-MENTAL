import express from 'express';
import app from './app.js';

const port = process.env.PORT ?? 3000;

// Na Vercel a pasta public/ é servida pela plataforma; localmente fazemos isso aqui.
app.use(express.static('public'));

app.listen(port, () => console.log(`Servidor em http://localhost:${port}`));
