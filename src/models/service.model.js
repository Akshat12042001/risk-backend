import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    imageFile: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    ratingCount: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    badge: {
      type: String,
      default: null,
    },
    sortOrder: {
      type: Number,
      required: true,
    },
    detail: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true },
);

export const Service = mongoose.model('Service', serviceSchema);
