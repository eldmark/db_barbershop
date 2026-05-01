import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import { signToken } from "../../middleware/auth";
import { User } from "../../types/entities";

export const login = async (email: string, password: string) => {
  const res = await pool.query(`SELECT * FROM "User" WHERE email = $1 AND deleted_at IS NULL`, [email]);
  if (res.rows.length === 0) return null;
  const user: User & { password: string } = res.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  // fetch roles
  const rolesRes = await pool.query(
    `SELECT r.name FROM Role r JOIN UserRole ur ON r.id_role = ur.id_role WHERE ur.id_user = $1`,
    [user.id_user]
  );
  const roles = rolesRes.rows.map((r: { name: string }) => r.name);

  const token = signToken({ id_user: user.id_user, roles });
  return { token, user: { id_user: user.id_user, name: user.name, email: user.email, roles } };
};
