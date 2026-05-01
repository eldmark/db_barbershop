import * as service from "./role.service";

export const getRoles = async () => service.getRoles();
export const getRoleById = async (params: any) => service.getRoleById(Number(params.id));
export const createRole = async (body: any) => service.createRole(body);
export const updateRole = async (params: any, body: any) => service.updateRole(Number(params.id), body);
export const deleteRole = async (params: any) => service.deleteRole(Number(params.id));
