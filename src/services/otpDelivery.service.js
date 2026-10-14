import { env } from '../config/env.js';

export async function deliverOtp({ phone, otp }) {
  if (env.nodeEnv !== 'production') {
    console.log(`[otp] ${phone} code is ${otp}`);
    return;
  }

  // Plug an SMS provider (MSG91, Twilio, etc.) in here before going live.
  console.warn(`[otp] SMS provider is not configured. OTP for ${phone} was not sent.`);
}
