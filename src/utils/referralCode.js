import crypto from 'crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateReferralCode(length = 6) {
  const bytes = crypto.randomBytes(length);
  let code = '';

  for (let index = 0; index < length; index += 1) {
    code += ALPHABET[bytes[index] % ALPHABET.length];
  }

  return code;
}
