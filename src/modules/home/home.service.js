import { Service } from '../../models/service.model.js';
import { serviceDetails } from '../services/service.data.js';
import { homeServices } from './home.data.js';

export async function seedHomeServices() {
  const slugs = homeServices.map((service) => service.slug);
  await Service.deleteMany({ slug: { $nin: slugs } });

  await Promise.all(
    homeServices.map((service) => Service.updateOne(
      { slug: service.slug },
      { ...service, detail: serviceDetails[service.slug] ?? null },
      { upsert: true },
    )),
  );
}

export async function listHomeServices() {
  return Service.find().sort({ sortOrder: 1 });
}
