import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartBooking,
  updateCartItem,
} from './cart.service.js';

function baseUrl(req) {
  return `${req.protocol}://${req.get('host')}`;
}

export const getCartController = asyncHandler(async (req, res) => {
  const cart = await getCart(req.user._id, baseUrl(req));
  res.status(200).json({
    success: true,
    message: 'Cart fetched',
    data: { cart },
  });
});

export const addCartItemController = asyncHandler(async (req, res) => {
  const cart = await addCartItem(req.user._id, req.validated.body, baseUrl(req));
  res.status(200).json({
    success: true,
    message: 'Service added to cart',
    data: { cart },
  });
});

export const updateCartItemController = asyncHandler(async (req, res) => {
  const cart = await updateCartItem(
    req.user._id,
    req.validated.params.itemId,
    req.validated.body,
    baseUrl(req),
  );
  res.status(200).json({
    success: true,
    message: 'Cart item updated',
    data: { cart },
  });
});

export const removeCartItemController = asyncHandler(async (req, res) => {
  const cart = await removeCartItem(req.user._id, req.validated.params.itemId, baseUrl(req));
  res.status(200).json({
    success: true,
    message: 'Cart item removed',
    data: { cart },
  });
});

export const updateCartBookingController = asyncHandler(async (req, res) => {
  const cart = await updateCartBooking(req.user._id, req.validated.body, baseUrl(req));
  res.status(200).json({
    success: true,
    message: 'Cart booking updated',
    data: { cart },
  });
});
