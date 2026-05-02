import { query } from "../../utils/db";

export const getDashboardStats = async () => {
  const today = new Date().toISOString().split("T")[0];
  
  // Requirement: CTE (WITH)
  const stats = await query(`
    WITH DailySales AS (
      SELECT total FROM Sale WHERE date = $1 AND deleted_at IS NULL
    ),
    WeeklySales AS (
      SELECT total FROM Sale WHERE date >= CURRENT_DATE - INTERVAL '7 days' AND deleted_at IS NULL
    ),
    LowStockCount AS (
      SELECT COUNT(*) as count FROM Product WHERE stock < 10
    )
    SELECT 
      (SELECT COALESCE(SUM(total), 0) FROM DailySales) as today_total,
      (SELECT COALESCE(SUM(total), 0) FROM WeeklySales) as week_total,
      (SELECT count FROM LowStockCount) as low_stock
  `, [today]);

  return {
    today: Number((stats as any)[0]?.today_total || 0),
    week: Number((stats as any)[0]?.week_total || 0),
    lowStock: Number((stats as any)[0]?.low_stock || 0)
  };
};

// Requirement: GROUP BY, HAVING, and Aggregation
export const getTopSellingProducts = async () => {
  return await query(`
    SELECT p.name, SUM(sd.quantity) as total_sold, SUM(sd.quantity * sd.unit_price) as total_revenue
    FROM SaleDetailProduct sd
    JOIN Product p ON sd.id_product = p.id_product
    GROUP BY p.name
    HAVING SUM(sd.quantity) > 1
    ORDER BY total_sold DESC
    LIMIT 5
  `);
};

// Requirement: Subquery (IN or EXISTS)
export const getActiveCustomers = async () => {
  return await query(`
    SELECT name, email 
    FROM "User" 
    WHERE id_user IN (
      SELECT DISTINCT id_user FROM Sale
    )
    LIMIT 10
  `);
};
