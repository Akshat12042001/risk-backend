import { Address } from '../../models/address.model.js';
import { Cart } from '../../models/cart.model.js';
import { Coupon } from '../../models/coupon.model.js';
import { Service } from '../../models/service.model.js';
import { TimeSlot } from '../../models/timeSlot.model.js';
import { User } from '../../models/user.model.js';
import { ApiError } from '../../utils/apiError.js';
import { toCartPayload } from './cart.mapper.js';

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

function findDuration(service, durationId) {
  const duration = service.detail?.durations?.find((item) => item.id === durationId);
  if (!duration) {
    throw new ApiError(400, 'Select a valid duration');
  }
  if (!duration.minutes) {
    throw new ApiError(400, 'This service duration cannot be added to cart yet');
  }
  return duration;
}

async function loadCartContext(cart) {
  const [user, services, slot, address, coupon] = await Promise.all([
    User.findById(cart.user).select('phone name firstName lastName'),
    Service.find({ _id: { $in: cart.items.map((item) => item.service) } }),
    cart.slot ? TimeSlot.findById(cart.slot) : null,
    cart.address ? Address.findById(cart.address) : null,
    cart.coupon ? Coupon.findById(cart.coupon) : null,
  ]);

  if (!user) {
    throw new ApiError(401, 'Login required');
  }

  const servicesById = new Map(services.map((service) => [String(service._id), service]));
  return { user, servicesById, slot, address, coupon };
}

async function respondCart(cart, baseUrl) {
  const context = await loadCartContext(cart);
  return toCartPayload({ cart, baseUrl, ...context });
}

export async function getCart(userId, baseUrl) {
  const cart = await getOrCreateCart(userId);
  return respondCart(cart, baseUrl);
}

export async function addCartItem(userId, { serviceId, durationId }, baseUrl) {
  const service = await Service.findById(serviceId);
  if (!service || !service.detail) {
    throw new ApiError(404, 'Service not found');
  }

  const duration = findDuration(service, durationId);
  const cart = await getOrCreateCart(userId);
  const existing = cart.items.find((item) => String(item.service) === String(serviceId));

  if (existing) {
    existing.durationId = duration.id;
    existing.minutes = duration.minutes;
    existing.price = duration.price;
    existing.originalPrice = duration.originalPrice;
  } else {
    cart.items.push({
      service: service._id,
      durationId: duration.id,
      minutes: duration.minutes,
      price: duration.price,
      originalPrice: duration.originalPrice,
    });
  }

  await cart.save();
  return respondCart(cart, baseUrl);
}

export async function updateCartItem(userId, itemId, { durationId }, baseUrl) {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) {
    throw new ApiError(404, 'Cart item not found');
  }

  const service = await Service.findById(item.service);
  if (!service || !service.detail) {
    throw new ApiError(404, 'Service not found');
  }

  const duration = findDuration(service, durationId);
  item.durationId = duration.id;
  item.minutes = duration.minutes;
  item.price = duration.price;
  item.originalPrice = duration.originalPrice;
  await cart.save();
  return respondCart(cart, baseUrl);
}

export async function removeCartItem(userId, itemId, baseUrl) {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) {
    throw new ApiError(404, 'Cart item not found');
  }
  item.deleteOne();
  await cart.save();
  return respondCart(cart, baseUrl);
}

export async function updateCartBooking(userId, input, baseUrl) {
  const cart = await getOrCreateCart(userId);

  if (input.slotId || input.slotDate) {
    if (!input.slotId || !input.slotDate) {
      throw new ApiError(400, 'Slot date and slot are required together');
    }

    const slot = await TimeSlot.findOne({ _id: input.slotId, isActive: true });
    if (!slot) {
      throw new ApiError(404, 'Slot not found');
    }

    cart.slot = slot._id;
    cart.slotDate = input.slotDate;
  }

  if (input.addressId) {
    const address = await Address.findOne({ _id: input.addressId, user: userId });
    if (!address) {
      throw new ApiError(404, 'Address not found');
    }
    cart.address = address._id;
  }

  await cart.save();
  return respondCart(cart, baseUrl);
}
