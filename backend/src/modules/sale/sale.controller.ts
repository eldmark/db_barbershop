import * as service from "./sale.service";
import { IdParams } from "../../types/http";
import { SaleInput } from "../../types/entities";

export const createSale = async (body: SaleInput) => {
  return await service.createSale(body);
};
export const deleteSale = async (params: IdParams) => {
  return await service.deleteSale(Number(params.id));
};
export const getSales = async () => {
  return await service.getSales();
};
export const getSaleById = async (params: IdParams) => {
  return await service.getSaleById(Number(params.id));
};
export const updateSale = async (params: IdParams, body: SaleInput) => {
  return await service.updateSale(Number(params.id), body);
};
export const getSalesByUserId = async (userId: number) => {
  return await service.getSalesByUserId(userId);
};