import { query } from "../../utils/db";
import { Product } from "../../types/entities";

export const getProducts = async () => {
  return query(`
    SELECT p.*, c.name AS category, s.name AS supplier
    FROM Product p
    JOIN Category c ON p.id_category = c.id_category
    JOIN Supplier s ON p.id_supplier = s.id_supplier
  `);
};

export const getProductById = async (id: number) => {
  return query(`SELECT * FROM Product WHERE id_product = $1`, [id]);
};

export const createProduct = async (data: Product) => {
  return query(
    `INSERT INTO Product (name, price, stock, id_category, id_supplier)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.name, data.price, data.stock, data.id_category, data.id_supplier]
  );
};

export const updateProduct = async (id: number, data: Product) => {
  return query(
    `UPDATE Product
     SET name = $1, price = $2, stock = $3,
         id_category = $4, id_supplier = $5
     WHERE id_product = $6
     RETURNING *`,
    [data.name, data.price, data.stock, data.id_category, data.id_supplier, id]
  );
};

export const deleteProduct = async (id: number) => {
  return query(`DELETE FROM Product WHERE id_product = $1`, [id]);
};