import { query } from "../../utils/db";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";

export const getUsers = async () => {
  return await query(
    `SELECT u.id_user, u.name, u.email,
     COALESCE(MIN(ur.id_role), 0) AS role
     FROM "User" u
     LEFT JOIN UserRole ur ON u.id_user = ur.id_user
     WHERE u.deleted_at IS NULL
     GROUP BY u.id_user, u.name, u.email`
  );
};

export const createUser = async (name: string, email: string, password: string) => {
  const hashed = await bcrypt.hash(password, 10);
  try {
    const res = await pool.query(
      `INSERT INTO "User" (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id_user, name, email`,
      [name, email, hashed]
    );

    const user = res.rows[0];
    // assign default role 'client'
    const roleRes = await pool.query(`SELECT id_role FROM Role WHERE name = $1 LIMIT 1`, ["client"]);
    const roleId = roleRes.rows[0]?.id_role;
    if (roleId) {
      await pool.query(`INSERT INTO UserRole (id_user, id_role) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [user.id_user, roleId]);
    }
    return user;
  } catch (err) {
    // rethrow for controller/routing layer to handle
    throw err;
  }
};

export const getUserById = async (id: number) => {
  return await query(
    `SELECT u.id_user, u.name, u.email,
     COALESCE((SELECT ur.id_role FROM UserRole ur WHERE ur.id_user = u.id_user LIMIT 1), 0) AS role
     FROM "User" u
     WHERE u.id_user = $1 AND u.deleted_at IS NULL`,
    [id]
  );
};

export const deleteUser = async (id: number) => {
  return await query(
    `UPDATE "User"
     SET deleted_at = NOW()
     WHERE id_user = $1`,
    [id]
  );
};
export const updateUser = async (id: number, name: string, email: string) => {
  return await query(
    `UPDATE "User"
      SET name = $1, email = $2
      WHERE id_user = $3 AND deleted_at IS NULL
      RETURNING id_user, name, email`,
    [name, email, id]
  );
};