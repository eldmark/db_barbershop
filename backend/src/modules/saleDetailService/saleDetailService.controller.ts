import * as service from "./saleDetailService.service";

export const getSaleDetailServices = async () => service.getSaleDetailServices();
export const getSaleDetailServiceById = async (params: any) => service.getSaleDetailServiceById(Number(params.id));
export const createSaleDetailService = async (body: any) => service.createSaleDetailService(body);
export const updateSaleDetailService = async (params: any, body: any) => service.updateSaleDetailService(Number(params.id), body);
export const deleteSaleDetailService = async (params: any) => service.deleteSaleDetailService(Number(params.id));
