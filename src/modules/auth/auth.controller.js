import { asyncHandler } from '../../utils/asyncHandler.js';
import { getCurrentUser, logout, sendOtp, verifyOtp } from './auth.service.js';

export const sendOtpController = asyncHandler(async (req, res) => {
  const data = await sendOtp(req.validated.body.phone);
  res.status(200).json({
    success: true,
    message: 'OTP sent',
    data,
  });
});

export const verifyOtpController = asyncHandler(async (req, res) => {
  const data = await verifyOtp(req.validated.body.phone, req.validated.body.otp);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data,
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  await logout(req.user._id);
  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});

export const meController = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user._id);
  res.status(200).json({
    success: true,
    message: 'Profile fetched',
    data: { user },
  });
});
