import { query } from "../../utils/db";

export const getUsers = async () => {
  return await query(
    `SELECT id_user, name, email 
     FROM "User"
     WHERE deleted_at IS NULL`
  );
};

export const createUser = async (name: string, email: string, password: string) => {
  return await query(
    `INSERT INTO "User" (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id_user, name, email`,
    [name, email, password]
  );
};

export const getUserById = async (id: number) => {
  return await query(
    `SELECT id_user, name, email 
     FROM "User"
     WHERE id_user = $1 AND deleted_at IS NULL`,
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