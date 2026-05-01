import * as service from "./category.service";
import { Category } from "../../types/entities";
import { IdParams } from "../../types/http";

export const getCategories = async () => service.getCategories();
export const getCategoryById = async (params: IdParams) => service.getCategoryById(Number(params.id));
export const createCategory = async (body: Category) => service.createCategory(body);
export const updateCategory = async (params: IdParams, body: Category) => service.updateCategory(Number(params.id), body);
export const deleteCategory = async (params: IdParams) => service.deleteCategory(Number(params.id));
