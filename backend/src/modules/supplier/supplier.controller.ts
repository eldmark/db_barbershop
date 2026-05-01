import * as service from "./supplier.service";

export const getSuppliers = async () => service.getSuppliers();
export const getSupplierById = async (params: any) => service.getSupplierById(Number(params.id));
export const createSupplier = async (body: any) => service.createSupplier(body);
export const updateSupplier = async (params: any, body: any) => service.updateSupplier(Number(params.id), body);
export const deleteSupplier = async (params: any) => service.deleteSupplier(Number(params.id));
