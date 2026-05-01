import { query } from "../../utils/db";
import { Supplier } from "../../types/entities";

export const getSuppliers = async () => {
  return await query(`SELECT * FROM Supplier`);
};

export const getSupplierById = async (id: number) => {
  return await query(`SELECT * FROM Supplier WHERE id_supplier = $1`, [id]);
};

export const createSupplier = async (s: Supplier) => {
  return await query(`INSERT INTO Supplier (name, contact) VALUES ($1, $2) RETURNING *`, [s.name, s.contact]);
};

export const updateSupplier = async (id: number, s: Supplier) => {
  return await query(`UPDATE Supplier SET name = $1, contact = $2 WHERE id_supplier = $3 RETURNING *`, [s.name, s.contact, id]);
};

export const deleteSupplier = async (id: number) => {
  return await query(`DELETE FROM Supplier WHERE id_supplier = $1`, [id]);
};
