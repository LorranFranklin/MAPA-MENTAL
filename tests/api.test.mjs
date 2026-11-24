import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

describe('API', () => {
  let server;
  let base;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    base = `http://127.0.0.1:${server.address().port}`;
  });

  after(() => {
    server.closeAllConnections?.();
    server.close();
  });

  it('GET /api/health responde ok', async () => {
    const res = await fetch(`${base}/api/health`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: 'ok' });
  });

  it('rota /api inexistente devolve 404 em JSON', async () => {
    const res = await fetch(`${base}/api/nao-existe`);
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'not_found' });
  });

  it('JSON inválido devolve 400 sem vazar detalhes', async () => {
    const res = await fetch(`${base}/api/health`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{quebrado',
    });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: 'bad_request' });
  });

  it('não expõe o cabeçalho x-powered-by', async () => {
    const res = await fetch(`${base}/api/health`);
    assert.equal(res.headers.get('x-powered-by'), null);
  });
});
