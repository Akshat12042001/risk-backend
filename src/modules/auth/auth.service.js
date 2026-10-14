import { env } from '../../config/env.js';
import { Otp } from '../../models/otp.model.js';
import { User } from '../../models/user.model.js';
import { deliverOtp } from '../../services/otpDelivery.service.js';
import { ApiError } from '../../utils/apiError.js';
import { signAccessToken } from '../../utils/jwt.js';
import { generateOtp, hashOtp, otpMatches } from '../../utils/otp.js';
import { normalizePhone } from '../../utils/phone.js';

function toUserPayload(user, isNewUser) {
  return {
    id: user._id,
    phone: user.phone,
    name: user.name,
    isNewUser,
  };
}

export async function sendOtp(rawPhone) {
  const phone = normalizePhone(rawPhone);
  const latest = await Otp.findOne({ phone, consumedAt: null }).sort({ createdAt: -1 });

  if (latest && latest.expiresAt > new Date()) {
    const elapsedMs = Date.now() - latest.createdAt.getTime();
    const cooldownMs = env.otpResendCooldownSeconds * 1000;
    if (elapsedMs < cooldownMs) {
      const waitSeconds = Math.ceil((cooldownMs - elapsedMs) / 1000);
      throw new ApiError(429, `Please wait ${waitSeconds} seconds before requesting another OTP`);
    }
  }

  await Otp.updateMany({ phone, consumedAt: null }, { consumedAt: new Date() });

  const otp = generateOtp(env.otpLength);
  const expiresAt = new Date(Date.now() + env.otpExpiresInSeconds * 1000);

  await Otp.create({
    phone,
    otpHash: hashOtp(otp, env.otpPepper),
    expiresAt,
  });

  await deliverOtp({ phone, otp });

  return {
    phone,
    expiresInSeconds: env.otpExpiresInSeconds,
    ...(env.nodeEnv !== 'production' ? { devOtp: otp } : {}),
  };
}

export async function verifyOtp(rawPhone, otp) {
  const phone = normalizePhone(rawPhone);
  const record = await Otp.findOne({ phone, consumedAt: null }).sort({ createdAt: -1 });

  if (!record || record.expiresAt <= new Date()) {
    throw new ApiError(400, 'OTP expired. Request a new one');
  }

  if (record.attempts >= env.otpMaxAttempts) {
    throw new ApiError(429, 'Too many incorrect attempts. Request a new OTP');
  }

  const updated = await Otp.findOneAndUpdate(
    { _id: record._id, consumedAt: null, attempts: record.attempts },
    { $inc: { attempts: 1 } },
    { new: true },
  );

  if (!updated) {
    throw new ApiError(400, 'OTP expired. Request a new one');
  }

  if (!otpMatches(otp, env.otpPepper, updated.otpHash)) {
    const attemptsLeft = env.otpMaxAttempts - updated.attempts;
    if (attemptsLeft <= 0) {
      throw new ApiError(429, 'Too many incorrect attempts. Request a new OTP');
    }
    throw new ApiError(400, `Incorrect OTP. ${attemptsLeft} attempts left`);
  }

  updated.consumedAt = new Date();
  await updated.save();

  let user = await User.findOne({ phone });
  const isNewUser = !user;

  if (!user) {
    try {
      user = await User.create({ phone, lastLoginAt: new Date() });
    } catch (error) {
      if (error?.code !== 11000) {
        throw error;
      }
      user = await User.findOne({ phone });
    }
  } else {
    user.lastLoginAt = new Date();
    await user.save();
  }

  return {
    token: signAccessToken(user._id, user.tokenVersion ?? 0),
    user: toUserPayload(user, isNewUser),
  };
}

export async function logout(userId) {
  const user = await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
  if (!user) {
    throw new ApiError(401, 'Login required');
  }
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId).select('_id phone name');
  if (!user) {
    throw new ApiError(401, 'Login required');
  }
  return toUserPayload(user, false);
}
