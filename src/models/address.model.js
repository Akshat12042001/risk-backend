import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    saveAs: {
      type: String,
      enum: ['home', 'other'],
      required: true,
    },
    flatOrHouseNo: {
      type: String,
      trim: true,
      required: true,
    },
    floor: {
      type: String,
      trim: true,
      default: '',
    },
    building: {
      type: String,
      trim: true,
      required: true,
    },
    landmark: {
      type: String,
      trim: true,
      default: '',
    },
    area: {
      type: String,
      trim: true,
      required: true,
    },
    receiverName: {
      type: String,
      trim: true,
      required: true,
    },
    receiverPhone: {
      type: String,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Address = mongoose.model('Address', addressSchema);
