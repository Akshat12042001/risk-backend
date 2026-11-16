import { asyncHandler } from '../../utils/asyncHandler.js';
import { listSlots } from './slot.service.js';

export const listSlotsController = asyncHandler(async (req, res) => {
  const data = await listSlots(req.validated?.query || {});
  res.status(200).json({
    success: true,
    message: 'Slots fetched',
    data,
  });
});
