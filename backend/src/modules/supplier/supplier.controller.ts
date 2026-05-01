import * as service from "./supplier.service";
import { Supplier } from "../../types/entities";
import { IdParams } from "../../types/http";

export const getSuppliers = async () => service.getSuppliers();
export const getSupplierById = async (params: IdParams) => service.getSupplierById(Number(params.id));
export const createSupplier = async (body: Supplier) => service.createSupplier(body);
export const updateSupplier = async (params: IdParams, body: Supplier) => service.updateSupplier(Number(params.id), body);
export const deleteSupplier = async (params: IdParams) => service.deleteSupplier(Number(params.id));
