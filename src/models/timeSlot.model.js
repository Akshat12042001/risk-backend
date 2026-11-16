import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    surcharge: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

timeSlotSchema.index({ period: 1, startTime: 1 }, { unique: true });

export const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);
