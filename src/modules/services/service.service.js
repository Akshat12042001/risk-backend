import { Service } from '../../models/service.model.js';
import { ApiError } from '../../utils/apiError.js';

export async function getServiceDetail(serviceId) {
  const service = await Service.findById(serviceId);
  if (!service || !service.detail) {
    throw new ApiError(404, 'Service not found');
  }
  return service;
}
