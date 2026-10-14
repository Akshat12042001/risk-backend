import crypto from 'crypto';

export function generateOtp(length) {
  const max = 10 ** length;
  return String(crypto.randomInt(0, max)).padStart(length, '0');
}

export function hashOtp(otp, pepper) {
  return crypto.createHmac('sha256', pepper).update(otp).digest('hex');
}

export function otpMatches(otp, pepper, otpHash) {
  const computed = hashOtp(otp, pepper);
  const left = Buffer.from(computed);
  const right = Buffer.from(otpHash);
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}
