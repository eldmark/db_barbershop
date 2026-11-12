import { query } from "../../utils/db";
import { SaleDetailService } from "../../types/entities";

export const getSaleDetailServices = async () => query(`SELECT * FROM sale_detail_service`);
export const getSaleDetailServiceById = async (id: number) => query(`SELECT * FROM sale_detail_service WHERE id_sale_detail_service = $1`, [id]);
export const createSaleDetailService = async (d: SaleDetailService) => query(`INSERT INTO sale_detail_service (id_sale, id_service, quantity, unit_price) VALUES ($1,$2,$3,$4) RETURNING *`, [d.id_sale, d.id_service, d.quantity, d.unit_price]);
export const updateSaleDetailService = async (id: number, d: SaleDetailService) => query(`UPDATE sale_detail_service SET id_sale=$1, id_service=$2, quantity=$3, unit_price=$4 WHERE id_sale_detail_service=$5 RETURNING *`, [d.id_sale, d.id_service, d.quantity, d.unit_price, id]);
export const deleteSaleDetailService = async (id: number) => query(`DELETE FROM sale_detail_service WHERE id_sale_detail_service = $1`, [id]);
