import { buildApp } from './app.js';
import { config } from './config.js';
import { initCollab } from './sockets/collab.js';

/**
 * Server entrypoint. Boots Fastify, attaches the realtime collaboration hub to
 * the underlying HTTP server, and handles graceful shutdown.
 */
const app = buildApp();

async function start() {
  try {
    await app.listen({ port: config.PORT, host: '0.0.0.0' });
    const teardownCollab = initCollab(app.server);
    app.log.info(`🚀 tripu-server listening on http://localhost:${config.PORT}`);

    for (const signal of ['SIGINT', 'SIGTERM'] as const) {
      process.on(signal, async () => {
        app.log.info(`${signal} received, shutting down…`);
        await teardownCollab();
        await app.close();
        process.exit(0);
      });
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
