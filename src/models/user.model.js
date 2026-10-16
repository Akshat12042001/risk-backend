import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    firstName: {
      type: String,
      trim: true,
      default: '',
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    referralCode: {
      type: String,
      uppercase: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    referredByCode: {
      type: String,
      uppercase: true,
      default: '',
    },
    lastLoginAt: {
      type: Date,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ referralCode: 1 }, { unique: true, sparse: true });

export const User = mongoose.model('User', userSchema);
