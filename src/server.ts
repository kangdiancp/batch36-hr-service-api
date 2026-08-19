import { createApp } from './app';
import { env } from './config/env';
import { checkDatabaseConnection, pool } from './db';

async function bootstrap(): Promise<void> {
  await checkDatabaseConnection();
  console.log(' Koneksi PostgreSQL OK');

  // REST server (Fastify) 
  const app = await createApp();
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
  console.log(`   REST server berjalan di http://localhost:${env.PORT}`);
  console.log(`   Health check : http://localhost:${env.PORT}/health`);
  console.log(`   API prefix   : ${env.API_PREFIX}`);


  const shutdown = async (signal: string) => {
    console.log(`\n${signal} diterima, mematikan server dengan aman...`);

    await app.close();

    await pool.end();
    console.log('Pool database ditutup. See you!');
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('Gagal start aplikasi:', err);
  process.exit(1);
});
