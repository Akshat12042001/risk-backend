import { asyncHandler } from '../../utils/asyncHandler.js';
import { createBooking, getBooking, listBookings } from './booking.service.js';

function baseUrl(req) {
  return `${req.protocol}://${req.get('host')}`;
}

export const createBookingController = asyncHandler(async (req, res) => {
  const booking = await createBooking(req.user._id, baseUrl(req));
  res.status(201).json({
    success: true,
    message: 'Booking confirmed',
    data: { booking },
  });
});

export const listBookingsController = asyncHandler(async (req, res) => {
  const data = await listBookings(req.user._id, baseUrl(req), req.validated?.query?.tab);
  res.status(200).json({
    success: true,
    message: 'Bookings fetched',
    data,
  });
});


export const getBookingController = asyncHandler(async (req, res) => {
  const booking = await getBooking(req.user._id, req.validated.params.bookingId, baseUrl(req));
  res.status(200).json({
    success: true,
    message: 'Booking fetched',
    data: { booking },
  });
});
