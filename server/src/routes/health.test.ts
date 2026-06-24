import { describe, it, expect, afterAll } from 'vitest';
import { buildApp } from '../app.js';

const app = buildApp();

afterAll(async () => {
  await app.close();
});

describe('GET /health', () => {
  it('reports ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ok', service: 'tripu-server' });
  });
});
