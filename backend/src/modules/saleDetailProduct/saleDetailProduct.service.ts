import { query } from "../../utils/db";
import { SaleDetailProduct } from "../../types/entities";

export const getSaleDetailProducts = async () => query(`SELECT * FROM sale_detail_product`);
export const getSaleDetailProductById = async (id: number) => query(`SELECT * FROM sale_detail_product WHERE id_sale_detail_product = $1`, [id]);
export const createSaleDetailProduct = async (d: SaleDetailProduct) => query(`INSERT INTO sale_detail_product (id_sale, id_product, quantity, unit_price) VALUES ($1,$2,$3,$4) RETURNING *`, [d.id_sale, d.id_product, d.quantity, d.unit_price]);
export const updateSaleDetailProduct = async (id: number, d: SaleDetailProduct) => query(`UPDATE sale_detail_product SET id_sale=$1, id_product=$2, quantity=$3, unit_price=$4 WHERE id_sale_detail_product=$5 RETURNING *`, [d.id_sale, d.id_product, d.quantity, d.unit_price, id]);
export const deleteSaleDetailProduct = async (id: number) => query(`DELETE FROM sale_detail_product WHERE id_sale_detail_product = $1`, [id]);
