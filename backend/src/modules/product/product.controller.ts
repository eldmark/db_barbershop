import * as service from "./product.service";
import { Product } from "../../types/entities";

export const getProducts = async () => {
  return await service.getProducts();
};

export const getProductById = async (params: any) => {
  return await service.getProductById(Number(params.id));
};

export const createProduct = async (body: Product) => {
  return await service.createProduct(body);
};

export const updateProduct = async (params: any, body: Product) => {
  return await service.updateProduct(Number(params.id), body);
};

export const deleteProduct = async (params: any) => {
  return await service.deleteProduct(Number(params.id));
};
