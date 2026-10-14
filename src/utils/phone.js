import { ApiError } from './apiError.js';

export function normalizePhone(input) {
  const digits = String(input).replace(/\D/g, '');

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length >= 11 && digits.length <= 15) {
    return `+${digits}`;
  }

  throw new ApiError(400, 'Enter a valid phone number');
}
