import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { seedCoupons } from './modules/coupons/coupon.service.js';
import { seedHomeServices } from './modules/home/home.service.js';
import { seedTimeSlots } from './modules/slots/slot.service.js';

async function start() {
  await connectDb();
  await seedHomeServices();
  await seedTimeSlots();
  await seedCoupons();
  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
