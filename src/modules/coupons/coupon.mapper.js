export function toCouponPayload(coupon) {
  return {
    id: coupon._id,
    code: coupon.code,
    title: coupon.title,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    maxDiscount: coupon.maxDiscount,
    minOrderAmount: coupon.minOrderAmount,
    terms: coupon.terms || [],
  };
}
