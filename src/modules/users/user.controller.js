import { asyncHandler } from '../../utils/asyncHandler.js';
import { updateProfile } from './user.service.js';

export const updateProfileController = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user._id, req.validated.body);
  res.status(200).json({
    success: true,
    message: 'Profile updated',
    data: { user },
  });
});
