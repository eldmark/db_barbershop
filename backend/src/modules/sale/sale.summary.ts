import { query } from "../../utils/db";

export const getDashboardStats = async () => {
  const today = new Date().toISOString().split("T")[0];
  
  const todaySales = await query(`
    SELECT COALESCE(SUM(total), 0) as total 
    FROM Sale 
    WHERE date = $1 AND deleted_at IS NULL
  `, [today]);

  const weekSales = await query(`
    SELECT COALESCE(SUM(total), 0) as total 
    FROM Sale 
    WHERE date >= CURRENT_DATE - INTERVAL '7 days' AND deleted_at IS NULL
  `);

  const lowStockProducts = await query(`
    SELECT COUNT(*) as count 
    FROM Product 
    WHERE stock < 10
  `);

  return {
    today: Number((todaySales as any)[0]?.total || 0),
    week: Number((weekSales as any)[0]?.total || 0),
    lowStock: Number((lowStockProducts as any)[0]?.count || 0)
  };
};
