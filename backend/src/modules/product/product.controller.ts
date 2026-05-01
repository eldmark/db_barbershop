import * as service from "./product.service";
import { Product } from "../../types/entities";
import { IdParams } from "../../types/http";

export const getProducts = async () => {
  return await service.getProducts();
};

export const getProductById = async (params: IdParams) => {
  return await service.getProductById(Number(params.id));
};

export const createProduct = async (body: Product) => {
  return await service.createProduct(body);
};

export const updateProduct = async (params: IdParams, body: Product) => {
  return await service.updateProduct(Number(params.id), body);
};

export const deleteProduct = async (params: IdParams) => {
  return await service.deleteProduct(Number(params.id));
};
