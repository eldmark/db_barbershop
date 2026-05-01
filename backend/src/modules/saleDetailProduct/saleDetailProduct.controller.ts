import * as service from "./saleDetailProduct.service";

export const getSaleDetailProducts = async () => service.getSaleDetailProducts();
export const getSaleDetailProductById = async (params: any) => service.getSaleDetailProductById(Number(params.id));
export const createSaleDetailProduct = async (body: any) => service.createSaleDetailProduct(body);
export const updateSaleDetailProduct = async (params: any, body: any) => service.updateSaleDetailProduct(Number(params.id), body);
export const deleteSaleDetailProduct = async (params: any) => service.deleteSaleDetailProduct(Number(params.id));
