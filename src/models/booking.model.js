import mongoose from 'mongoose';

const bookingItemSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    imageFile: {
      type: String,
      default: '',
    },
    durationId: {
      type: String,
      required: true,
    },
    minutes: {
      type: Number,
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
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [bookingItemSchema],
      required: true,
    },
    slotDate: {
      type: String,
      required: true,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      required: true,
    },
    slotSnapshot: {
      label: String,
      startTime: String,
      period: String,
      surcharge: Number,
    },
    scheduledFor: {
      type: String,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    addressSnapshot: {
      displayAddress: String,
      receiverName: String,
      receiverPhone: String,
      saveAs: String,
    },
    contact: {
      name: String,
      phone: String,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null,
    },
    couponSnapshot: {
      code: String,
      title: String,
      discountType: String,
      discountValue: Number,
    },
    bill: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'failed', 'refunded'],
      default: 'paid',
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model('Booking', bookingSchema);
