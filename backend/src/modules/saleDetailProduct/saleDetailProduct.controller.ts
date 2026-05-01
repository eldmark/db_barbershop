import * as service from "./saleDetailProduct.service";
import { SaleDetailProduct } from "../../types/entities";
import { IdParams } from "../../types/http";

export const getSaleDetailProducts = async () => service.getSaleDetailProducts();
export const getSaleDetailProductById = async (params: IdParams) => service.getSaleDetailProductById(Number(params.id));
export const createSaleDetailProduct = async (body: SaleDetailProduct) => service.createSaleDetailProduct(body);
export const updateSaleDetailProduct = async (params: IdParams, body: SaleDetailProduct) => service.updateSaleDetailProduct(Number(params.id), body);
export const deleteSaleDetailProduct = async (params: IdParams) => service.deleteSaleDetailProduct(Number(params.id));
