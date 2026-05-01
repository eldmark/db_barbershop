import * as service from "./permission.service";
import { IdParams } from "../../types/http";
import { Permission } from "../../types/entities";

export const getPermissions = async () => service.getPermissions();
export const getPermissionById = async (params: IdParams) => service.getPermissionById(Number(params.id));
export const createPermission = async (body: Permission) => service.createPermission(body);
export const updatePermission = async (params: IdParams, body: Permission) => service.updatePermission(Number(params.id), body);
export const deletePermission = async (params: IdParams) => service.deletePermission(Number(params.id));
