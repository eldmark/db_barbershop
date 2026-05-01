import * as service from "./service.service";

export const getServices = async () => service.getServices();
export const getServiceById = async (params: any) => service.getServiceById(Number(params.id));
export const createService = async (body: any) => service.createService(body);
export const updateService = async (params: any, body: any) => service.updateService(Number(params.id), body);
export const deleteService = async (params: any) => service.deleteService(Number(params.id));
