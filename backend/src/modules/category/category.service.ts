import { query } from "../../utils/db";
import { Category } from "../../types/entities";

export const getCategories = async () => {
  return await query(`SELECT * FROM Category`);
};

export const getCategoryById = async (id: number) => {
  return await query(`SELECT * FROM Category WHERE id_category = $1`, [id]);
};

export const createCategory = async (c: Category) => {
  return await query(
    `INSERT INTO Category (name) VALUES ($1) RETURNING *`,
    [c.name]
  );
};

export const updateCategory = async (id: number, c: Category) => {
  return await query(
    `UPDATE Category SET name = $1 WHERE id_category = $2 RETURNING *`,
    [c.name, id]
  );
};

export const deleteCategory = async (id: number) => {
  return await query(`DELETE FROM Category WHERE id_category = $1`, [id]);
};
