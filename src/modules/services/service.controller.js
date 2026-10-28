import { asyncHandler } from '../../utils/asyncHandler.js';
import { toServiceDetailPayload } from './service.mapper.js';
import { getServiceDetail } from './service.service.js';

export const serviceDetailController = asyncHandler(async (req, res) => {
  const service = await getServiceDetail(req.validated.params.serviceId);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  res.status(200).json({
    success: true,
    message: 'Service fetched',
    data: {
      service: toServiceDetailPayload(service, baseUrl),
    },
  });
});
