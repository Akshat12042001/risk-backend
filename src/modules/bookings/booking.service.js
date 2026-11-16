import crypto from 'crypto';
import { Address } from '../../models/address.model.js';
import { Booking } from '../../models/booking.model.js';
import { Cart } from '../../models/cart.model.js';
import { Coupon } from '../../models/coupon.model.js';
import { Service } from '../../models/service.model.js';
import { TimeSlot } from '../../models/timeSlot.model.js';
import { User } from '../../models/user.model.js';
import { ApiError } from '../../utils/apiError.js';
import { buildBill } from '../cart/cart.mapper.js';
import { toBookingListItem, toBookingPayload } from './booking.mapper.js';

function formatSlotLabelForDisplay(label) {
  return label.replace(/\s*(am|pm)$/i, (_, period) => period.toUpperCase()).replace(/\s+/g, '');
}

function buildScheduledFor(slotDate, slot) {
  const [year, month, day] = slotDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthLabel = date.toLocaleDateString('en-US', { month: 'short' });
  return `${weekday}, ${monthLabel} ${day} - ${formatSlotLabelForDisplay(slot.label)}`;
}

function addressDisplay(address) {
  return [address.flatOrHouseNo, address.floor, address.building, address.landmark, address.area]
    .map((part) => (part || '').trim())
    .filter(Boolean)
    .join(', ');
}

async function createBookingNumber() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const number = `PRN${Date.now().toString().slice(-8)}${crypto.randomInt(10, 99)}`;
    const exists = await Booking.exists({ bookingNumber: number });
    if (!exists) {
      return number;
    }
  }
  throw new ApiError(500, 'Something went wrong');
}

export async function createBooking(userId, baseUrl) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Add services to cart before booking');
  }
  if (!cart.slot || !cart.slotDate) {
    throw new ApiError(400, 'Select a time slot before booking');
  }
  if (!cart.address) {
    throw new ApiError(400, 'Select an address before booking');
  }

  const [user, services, slot, address, coupon] = await Promise.all([
    User.findById(userId).select('phone name firstName lastName'),
    Service.find({ _id: { $in: cart.items.map((item) => item.service) } }),
    TimeSlot.findById(cart.slot),
    Address.findOne({ _id: cart.address, user: userId }),
    cart.coupon ? Coupon.findById(cart.coupon) : null,
  ]);

  if (!user) {
    throw new ApiError(401, 'Login required');
  }
  if (!slot || !slot.isActive) {
    throw new ApiError(400, 'Selected slot is no longer available');
  }
  if (!address) {
    throw new ApiError(400, 'Selected address was not found');
  }

  const servicesById = new Map(services.map((service) => [String(service._id), service]));
  const items = cart.items.map((item) => {
    const service = servicesById.get(String(item.service));
    if (!service) {
      throw new ApiError(400, 'A service in your cart is no longer available');
    }
    return {
      service: service._id,
      name: service.name,
      imageFile: service.imageFile,
      durationId: item.durationId,
      minutes: item.minutes,
      price: item.price,
      originalPrice: item.originalPrice,
    };
  });

  const bill = buildBill({
    items,
    slotSurcharge: slot.surcharge || 0,
    coupon,
  });

  const contact = {
    name:
      address.receiverName ||
      user.name ||
      [user.firstName, user.lastName].filter(Boolean).join(' ') ||
      '',
    phone: address.receiverPhone || user.phone || '',
  };

  const booking = await Booking.create({
    bookingNumber: await createBookingNumber(),
    user: userId,
    items,
    slotDate: cart.slotDate,
    slot: slot._id,
    slotSnapshot: {
      label: slot.label,
      startTime: slot.startTime,
      period: slot.period,
      surcharge: slot.surcharge || 0,
    },
    scheduledFor: buildScheduledFor(cart.slotDate, slot),
    address: address._id,
    addressSnapshot: {
      displayAddress: addressDisplay(address),
      receiverName: address.receiverName,
      receiverPhone: address.receiverPhone,
      saveAs: address.saveAs,
    },
    contact,
    coupon: coupon?._id || null,
    couponSnapshot: coupon
      ? {
          code: coupon.code,
          title: coupon.title,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        }
      : null,
    bill,
    status: 'confirmed',
    paymentStatus: 'paid',
  });

  cart.items = [];
  cart.slot = null;
  cart.slotDate = null;
  cart.coupon = null;
  await cart.save();

  return toBookingPayload(booking, baseUrl);
}

function bookingDateTime(booking) {
  const [year, month, day] = booking.slotDate.split('-').map(Number);
  const [hours, minutes] = (booking.slotSnapshot?.startTime || '00:00').split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function isUpcomingBooking(booking, now = new Date()) {
  if (booking.status === 'cancelled' || booking.status === 'completed') {
    return false;
  }
  return bookingDateTime(booking) >= now;
}

export async function listBookings(userId, baseUrl, tab = 'upcoming') {
  const selectedTab = tab || 'upcoming';
  const bookings = await Booking.find({ user: userId }).sort({ slotDate: 1, createdAt: -1 });
  const filtered = bookings
    .filter((booking) => {
      const upcoming = isUpcomingBooking(booking);
      return selectedTab === 'upcoming' ? upcoming : !upcoming;
    })
    .sort((left, right) => {
      const leftTime = bookingDateTime(left).getTime();
      const rightTime = bookingDateTime(right).getTime();
      return selectedTab === 'upcoming' ? leftTime - rightTime : rightTime - leftTime;
    });

  return {
    title: 'My Bookings',
    helpLabel: 'Help',
    tabs: [
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'previous', label: 'Previous' },
    ],
    selectedTab,
    emptyState: filtered.length
      ? null
      : {
          title: 'No bookings found',
        },
    bookings: filtered.map((booking) => toBookingListItem(booking, baseUrl, selectedTab)),
  };
}

export async function getBooking(userId, bookingId, baseUrl) {
  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }
  return toBookingPayload(booking, baseUrl);
}
