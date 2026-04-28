import { pool } from "../../config/db";

export const createSale = async (sale: any) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const saleResult = await client.query(
      `INSERT INTO Sale (date, total, id_user, id_employee)
       VALUES ($1, $2, $3, $4)
       RETURNING id_sale`,
      [sale.date, sale.total, sale.id_user, sale.id_employee]
    );

    const saleId = saleResult.rows[0].id_sale;

    for (const item of sale.products) {
      await client.query(
        `INSERT INTO SaleDetailProduct (id_sale, id_product, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [saleId, item.id_product, item.quantity, item.unit_price]
      );

      await client.query(
        `UPDATE Product
         SET stock = stock - $1
         WHERE id_product = $2`,
        [item.quantity, item.id_product]
      );
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