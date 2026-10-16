import { User } from '../../models/user.model.js';
import { ApiError } from '../../utils/apiError.js';
import { generateReferralCode } from '../../utils/referralCode.js';
import { toUserPayload } from './user.mapper.js';

export async function ensureReferralCode(user) {
  if (user.referralCode) {
    return user;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateReferralCode();
    try {
      const updated = await User.findOneAndUpdate(
        {
          _id: user._id,
          $or: [{ referralCode: { $exists: false } }, { referralCode: null }, { referralCode: '' }],
        },
        { $set: { referralCode: code } },
        { new: true },
      ).select('referralCode');

      if (updated?.referralCode) {
        user.referralCode = updated.referralCode;
        return user;
      }
    } catch (error) {
      if (error?.code !== 11000 || !error.keyPattern?.referralCode) {
        throw error;
      }
    }
  }

  throw new ApiError(500, 'Something went wrong');
}

async function applyReferralCode(user, rawCode) {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return;
  }

  if (user.referredByCode) {
    if (user.referredByCode === code) {
      return;
    }
    throw new ApiError(400, 'Referral code already applied');
  }

  if (user.referralCode === code) {
    throw new ApiError(400, 'You cannot use your own referral code');
  }

  const referrer = await User.findOne({ referralCode: code }).select('_id');
  if (!referrer) {
    throw new ApiError(400, 'Invalid referral code');
  }

  user.referredBy = referrer._id;
  user.referredByCode = code;
}

export async function updateProfile(userId, input) {
  const existing = await User.findById(userId);
  if (!existing) {
    throw new ApiError(401, 'Login required');
  }

  const user = await ensureReferralCode(existing);

  if (input.firstName !== undefined) {
    user.firstName = input.firstName;
  }
  if (input.lastName !== undefined) {
    user.lastName = input.lastName;
  }
  if (input.email !== undefined) {
    user.email = input.email ? input.email.toLowerCase() : undefined;
  }
  if (input.referralCode !== undefined) {
    await applyReferralCode(user, input.referralCode);
  }

  user.name = [user.firstName, user.lastName].filter(Boolean).join(' ');

  try {
    await user.save();
  } catch (error) {
    if (error?.code === 11000 && error.keyPattern?.email) {
      throw new ApiError(400, 'Email is already in use');
    }
    throw error;
  }

  return toUserPayload(user, false);
}
