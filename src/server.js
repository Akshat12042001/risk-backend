import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { seedHomeServices } from './modules/home/home.service.js';

async function start() {
  await connectDb();
  await seedHomeServices();
  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
