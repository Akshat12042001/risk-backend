import { ApiError } from '../../utils/apiError.js';

function money(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function calculateCouponDiscount(coupon, itemTotal) {
  if (!coupon) {
    return 0;
  }

  if (itemTotal < coupon.minOrderAmount) {
    throw new ApiError(400, `Add services worth ₹${coupon.minOrderAmount} to use this coupon`);
  }

  let discount = 0;
  if (coupon.discountType === 'flat') {
    discount = coupon.discountValue;
  } else {
    discount = money((itemTotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount != null) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  }

  return money(Math.min(discount, itemTotal));
}
