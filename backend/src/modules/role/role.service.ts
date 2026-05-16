import { query } from "../../utils/db";
import { Role } from "../../types/entities";

export const getRoles = async () => query(`SELECT * FROM role`);
export const getRoleById = async (id: number) => query(`SELECT * FROM role WHERE id_role = $1`, [id]);
export const createRole = async (r: Role) => query(`INSERT INTO role (name) VALUES ($1) RETURNING *`, [r.name]);
export const updateRole = async (id: number, r: Role) => query(`UPDATE role SET name=$1 WHERE id_role=$2 RETURNING *`, [r.name, id]);
export const deleteRole = async (id: number) => query(`DELETE FROM role WHERE id_role = $1`, [id]);
