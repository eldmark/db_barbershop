import * as service from "./service.service";
import { IdParams } from "../../types/http";
import { ServiceEntity } from "../../types/entities";

export const getServices = async () => service.getServices();
export const getServiceById = async (params: IdParams) => service.getServiceById(Number(params.id));
export const createService = async (body: ServiceEntity) => service.createService(body);
export const updateService = async (params: IdParams, body: ServiceEntity) => service.updateService(Number(params.id), body);
export const deleteService = async (params: IdParams) => service.deleteService(Number(params.id));
