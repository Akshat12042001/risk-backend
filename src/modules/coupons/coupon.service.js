import { Cart } from '../../models/cart.model.js';
import { Coupon } from '../../models/coupon.model.js';
import { ApiError } from '../../utils/apiError.js';
import { getCart } from '../cart/cart.service.js';
import { couponEmptyState, staticCoupons } from './coupon.data.js';
import { calculateCouponDiscount } from './coupon.discount.js';
import { toCouponPayload } from './coupon.mapper.js';

function money(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export async function seedCoupons() {
  await Coupon.deleteMany({
    code: { $nin: staticCoupons.map((coupon) => coupon.code) },
  });

  await Promise.all(
    staticCoupons.map((coupon) =>
      Coupon.updateOne({ code: coupon.code }, coupon, { upsert: true }),
    ),
  );
}

export async function listCoupons() {
  const coupons = await Coupon.find({ isActive: true }).sort({ sortOrder: 1 });
  return {
    placeholder: 'Type coupon code here',
    applyLabel: 'Apply',
    sectionTitle: 'Available coupons',
    emptyState: coupons.length ? null : couponEmptyState,
    coupons: coupons.map(toCouponPayload),
  };
}

export async function applyCoupon(userId, code, baseUrl) {
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
  if (!coupon) {
    throw new ApiError(400, 'Invalid coupon code');
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Add services to cart before applying a coupon');
  }

  const itemTotal = money(cart.items.reduce((sum, item) => sum + item.price, 0));
  calculateCouponDiscount(coupon, itemTotal);

  cart.coupon = coupon._id;
  await cart.save();

  return getCart(userId, baseUrl);
}

export async function removeCoupon(userId, baseUrl) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  cart.coupon = null;
  await cart.save();
  return getCart(userId, baseUrl);
}
