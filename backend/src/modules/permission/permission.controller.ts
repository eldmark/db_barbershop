import * as service from "./permission.service";

export const getPermissions = async () => service.getPermissions();
export const getPermissionById = async (params: any) => service.getPermissionById(Number(params.id));
export const createPermission = async (body: any) => service.createPermission(body);
export const updatePermission = async (params: any, body: any) => service.updatePermission(Number(params.id), body);
export const deletePermission = async (params: any) => service.deletePermission(Number(params.id));
