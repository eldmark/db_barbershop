import { query } from "../../utils/db";
import { ServiceEntity } from "../../types/entities";

export const getServices = async () => query(`SELECT * FROM Service`);
export const getServiceById = async (id: number) => query(`SELECT * FROM Service WHERE id_service = $1`, [id]);
export const createService = async (s: ServiceEntity) => query(`INSERT INTO Service (name, price) VALUES ($1, $2) RETURNING *`, [s.name, s.price]);
export const updateService = async (id: number, s: ServiceEntity) => query(`UPDATE Service SET name=$1, price=$2 WHERE id_service=$3 RETURNING *`, [s.name, s.price, id]);
export const deleteService = async (id: number) => query(`DELETE FROM Service WHERE id_service = $1`, [id]);
