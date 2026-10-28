export function toHomeServicePayload(service, baseUrl) {
  return {
    id: service._id,
    name: service.name,
    imageUrl: `${baseUrl}/services/${service.imageFile}`,
    rating: service.rating,
    ratingCount: service.ratingCount,
    price: service.price,
    originalPrice: service.originalPrice,
    badge: service.badge,
  };
}
