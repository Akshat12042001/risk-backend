import { asyncHandler } from '../../utils/asyncHandler.js';
import { applyCoupon, listCoupons, removeCoupon } from './coupon.service.js';

function baseUrl(req) {
  return `${req.protocol}://${req.get('host')}`;
}

export const listCouponsController = asyncHandler(async (req, res) => {
  const data = await listCoupons();
  res.status(200).json({
    success: true,
    message: 'Coupons fetched',
    data,
  });
});

export const applyCouponController = asyncHandler(async (req, res) => {
  const cart = await applyCoupon(req.user._id, req.validated.body.code, baseUrl(req));
  res.status(200).json({
    success: true,
    message: 'Coupon applied',
    data: { cart },
  });
});

export const removeCouponController = asyncHandler(async (req, res) => {
  const cart = await removeCoupon(req.user._id, baseUrl(req));
  res.status(200).json({
    success: true,
    message: 'Coupon removed',
    data: { cart },
  });
});
