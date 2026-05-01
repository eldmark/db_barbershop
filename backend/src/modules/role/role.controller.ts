import * as service from "./role.service";
import { Role } from "../../types/entities";
import { IdParams } from "../../types/http";

export const getRoles = async () => service.getRoles();
export const getRoleById = async (params: IdParams) => service.getRoleById(Number(params.id));
export const createRole = async (body: Role) => service.createRole(body);
export const updateRole = async (params: IdParams, body: Role) => service.updateRole(Number(params.id), body);
export const deleteRole = async (params: IdParams) => service.deleteRole(Number(params.id));
