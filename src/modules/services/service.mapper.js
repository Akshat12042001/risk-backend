export function toServiceDetailPayload(service, baseUrl) {
  return {
    id: service._id,
    name: service.name,
    label: service.detail.label,
    headline: service.detail.headline,
    imageUrl: `${baseUrl}/services/${service.imageFile}`,
    rating: service.rating,
    ratingCount: service.detail.ratingCount,
    durations: service.detail.durations,
    steps: service.detail.steps,
    included: service.detail.included,
    excluded: service.detail.excluded,
    faqs: service.detail.faqs,
    assurance: service.detail.assurance,
  };
}
