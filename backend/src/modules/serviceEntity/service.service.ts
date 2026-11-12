import { prisma } from "../../config/prisma";
import { ServiceEntity } from "../../types/entities";

const serializeService = (service: any) => ({
  ...service,
  price: service.price?.toString?.() ?? service.price
});

export const getServices = async () => {
  const services = await prisma.service.findMany({
    orderBy: { id_service: "asc" }
  });
  return services.map(serializeService);
};

export const getServiceById = async (id: number) => {
  const service = await prisma.service.findUnique({ where: { id_service: id } });
  return service ? serializeService(service) : null;
};

export const createService = async (s: ServiceEntity) => {
  const service = await prisma.service.create({
    data: {
      name: s.name,
      price: s.price
    }
  });
  return serializeService(service);
};

export const updateService = async (id: number, s: ServiceEntity) => {
  const service = await prisma.service.update({
    where: { id_service: id },
    data: {
      name: s.name,
      price: s.price
    }
  });
  return serializeService(service);
};

export const deleteService = async (id: number) => {
  await prisma.service.delete({ where: { id_service: id } });
  return { success: true };
};
