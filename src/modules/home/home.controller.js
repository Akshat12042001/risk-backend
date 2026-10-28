import { asyncHandler } from '../../utils/asyncHandler.js';
import { toHomeServicePayload } from './home.mapper.js';
import { listHomeServices } from './home.service.js';

export const homeController = asyncHandler(async (req, res) => {
  const services = await listHomeServices();
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  res.status(200).json({
    success: true,
    message: 'Home fetched',
    data: {
      services: services.map((service) => toHomeServicePayload(service, baseUrl)),
    },
  });
});
