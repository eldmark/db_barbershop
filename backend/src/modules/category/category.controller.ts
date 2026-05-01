import * as service from "./category.service";

export const getCategories = async () => service.getCategories();
export const getCategoryById = async (params: any) => service.getCategoryById(Number(params.id));
export const createCategory = async (body: any) => service.createCategory(body);
export const updateCategory = async (params: any, body: any) => service.updateCategory(Number(params.id), body);
export const deleteCategory = async (params: any) => service.deleteCategory(Number(params.id));
