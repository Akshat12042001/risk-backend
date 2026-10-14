import dotenv from 'dotenv';

dotenv.config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/risk'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  otpPepper: required('OTP_PEPPER'),
  otpExpiresInSeconds: Number(process.env.OTP_EXPIRES_IN_SECONDS || 300),
  otpResendCooldownSeconds: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60),
  otpMaxAttempts: Number(process.env.OTP_MAX_ATTEMPTS || 5),
  otpLength: 6,
};
