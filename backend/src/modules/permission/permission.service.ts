import { query } from "../../utils/db";
import { Permission } from "../../types/entities";

export const getPermissions = async () => query(`SELECT * FROM permission`);
export const getPermissionById = async (id: number) => query(`SELECT * FROM permission WHERE id_permission = $1`, [id]);
export const createPermission = async (p: Permission) => query(`INSERT INTO permission (name) VALUES ($1) RETURNING *`, [p.name]);
export const updatePermission = async (id: number, p: Permission) => query(`UPDATE permission SET name=$1 WHERE id_permission=$2 RETURNING *`, [p.name, id]);
export const deletePermission = async (id: number) => query(`DELETE FROM permission WHERE id_permission = $1`, [id]);
