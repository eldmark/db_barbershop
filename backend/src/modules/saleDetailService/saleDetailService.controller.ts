import * as service from "./saleDetailService.service";
import { SaleDetailService } from "../../types/entities";
import { IdParams } from "../../types/http";

export const getSaleDetailServices = async () => service.getSaleDetailServices();
export const getSaleDetailServiceById = async (params: IdParams) => service.getSaleDetailServiceById(Number(params.id));
export const createSaleDetailService = async (body: SaleDetailService) => service.createSaleDetailService(body);
export const updateSaleDetailService = async (params: IdParams, body: SaleDetailService) => service.updateSaleDetailService(Number(params.id), body);
export const deleteSaleDetailService = async (params: IdParams) => service.deleteSaleDetailService(Number(params.id));
