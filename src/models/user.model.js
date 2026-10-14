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

export const User = mongoose.model('User', userSchema);
