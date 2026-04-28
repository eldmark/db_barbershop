import { pool } from "../config/db";

export const query = async (text: string, params?: any[]) => {
  try {
    const res = await pool.query(text, params);
    return res.rows;
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};