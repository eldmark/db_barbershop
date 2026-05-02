import { pool } from "../../config/db";
import { SaleInput, SaleDetailProduct } from "../../types/entities";

type SaleRow = {
  id_sale: number;
  date: string;
  total: number | null;
  user_name?: string;
  employee_name?: string;
  products?: SaleDetailProduct[];
};

export const createSale = async (sale: SaleInput) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const saleResult = await client.query(
      `INSERT INTO Sale (date, total, id_user, id_employee, id_reservation)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_sale`,
      [sale.date, sale.total, sale.id_user, sale.id_employee, sale.id_reservation || null]
    );

    const saleId: number = saleResult.rows[0].id_sale;

    // Insert products - Trigger trg_update_stock_after_sale handles stock now
    if (sale.products && sale.products.length > 0) {
      for (const item of sale.products) {
        await client.query(
          `INSERT INTO SaleDetailProduct (id_sale, id_product, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [saleId, item.id_product, item.quantity, item.unit_price]
        );
      }
    }

    // Insert services
    if (sale.services && sale.services.length > 0) {
      for (const item of sale.services) {
        await client.query(
          `INSERT INTO SaleDetailService (id_sale, id_service, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [saleId, item.id_service, item.quantity, item.unit_price]
        );
      }
    }

    // If it comes from a reservation, mark reservation as completed using procedure
    if (sale.id_reservation) {
      await client.query(`CALL pr_complete_reservation($1)`, [sale.id_reservation]);
    }

    await client.query("COMMIT");

    return { success: true, saleId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
export const deleteSale = async (id: number) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      `DELETE FROM SaleDetailProduct WHERE id_sale = $1`,
      [id]
    );
    await client.query(
      `DELETE FROM Sale WHERE id_sale = $1`,
      [id]
    );
    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
export const getSales = async () => {
  const res = await pool.query<SaleRow>(
    `SELECT s.id_sale, s.date, s.total, u.name AS user_name, e.name AS employee_name, s.created_at
      FROM Sale s
      JOIN "User" u ON s.id_user = u.id_user
      JOIN "User" e ON s.id_employee = e.id_user
      WHERE s.deleted_at IS NULL
      ORDER BY s.created_at DESC`
  );
  return res.rows;
};

export const getSaleById = async (id: number) => {
  const saleResult = await pool.query<SaleRow>(
    `SELECT s.id_sale, s.date, s.total, u.name AS user_name, e.name AS employee_name
     FROM Sale s
     JOIN "User" u ON s.id_user = u.id_user
     JOIN "User" e ON s.id_employee = e.id_user
     WHERE s.id_sale = $1 AND s.deleted_at IS NULL`,
    [id]
  );
  if (saleResult.rows.length === 0) {
    return null;
  }
  const sale = saleResult.rows[0];

  const productsResult = await pool.query<SaleDetailProduct>( 
    `SELECT sd.id_sale, sd.id_product, sd.quantity, sd.unit_price, p.name AS product_name
     FROM SaleDetailProduct sd
     JOIN Product p ON sd.id_product = p.id_product
     WHERE sd.id_sale = $1`,
    [id]
  );

  const servicesResult = await pool.query(
    `SELECT sd.id_sale, sd.id_service, sd.quantity, sd.unit_price, s.name AS service_name
     FROM SaleDetailService sd
     JOIN Service s ON sd.id_service = s.id_service
     WHERE sd.id_sale = $1`,
    [id]
  );

  sale.products = productsResult.rows;
  (sale as any).services = servicesResult.rows;

  return sale;
};
export const getSalesByUserId = async (userId: number) => {
  const salesResult = await pool.query<SaleRow>(
    `SELECT s.id_sale, s.date, s.total, e.name AS employee_name
      FROM Sale s
      JOIN "User" e ON s.id_employee = e.id_user
      WHERE s.id_user = $1 AND s.deleted_at IS NULL`,
    [userId]
  );  
  const sales = salesResult.rows;
  for (const sale of sales) {
    const productsResult = await pool.query<SaleDetailProduct>(
      `SELECT sd.id_sale, sd.id_product, sd.quantity, sd.unit_price, p.name AS product_name
       FROM SaleDetailProduct sd
        JOIN Product p ON sd.id_product = p.id_product
        WHERE sd.id_sale = $1`,
      [sale.id_sale]
    );
    sale.products = productsResult.rows;
  }
  return sales;
};
export const softDeleteSale = async (id: number) => {
  return await pool.query(
    `UPDATE Sale
      SET deleted_at = NOW()
      WHERE id_sale = $1`,
    [id]
  );
}

export const restoreSale = async (id: number) => {
  return await pool.query(
    `UPDATE Sale
      SET deleted_at = NULL
      WHERE id_sale = $1`,
    [id]
  );
};
export const updateSale = async (id: number, sale: SaleInput) => {
  const client = await pool.connect();
  const { date, total, id_user, id_employee, products } = sale;
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE Sale
       SET date = $1, total = $2, id_user = $3, id_employee = $4
       WHERE id_sale = $5 AND deleted_at IS NULL`,
      [date, total, id_user, id_employee, id]
    ); 
    await client.query(
      `DELETE FROM SaleDetailProduct WHERE id_sale = $1`,
      [id] 
    );
    for (const item of products) {
      await client.query(
        `INSERT INTO SaleDetailProduct (id_sale, id_product, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [id, item.id_product, item.quantity, item.unit_price]
      );
    }
    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};