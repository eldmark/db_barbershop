import { pool } from "../config/db";

// PARAMETRIZACIÓN DE QUERIES PARA HACERLAS SEGURAS

export const query = async (text: string, params?: unknown[]) => {
  try {
    const res = await pool.query(text, params as any[]);
    return res.rows;
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};