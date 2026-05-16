import { query } from "../../utils/db";
import { Reservation } from "../../types/entities";

export const getReservations = async () => query(`
  SELECT r.*, u.name as user_name, e.name as employee_name, s.name as service_name
  FROM reservation r
  JOIN user_account u ON r.id_user = u.id_user
  JOIN user_account e ON r.id_employee = e.id_user
  JOIN service s ON r.id_service = s.id_service
  WHERE r.deleted_at IS NULL
`);

export const getReservationById = async (id: number) => query(`
  SELECT r.*, u.name as user_name, e.name as employee_name, s.name as service_name
  FROM reservation r
  JOIN user_account u ON r.id_user = u.id_user
  JOIN user_account e ON r.id_employee = e.id_user
  JOIN service s ON r.id_service = s.id_service
  WHERE r.id_reservation = $1 AND r.deleted_at IS NULL
`, [id]);
export const createReservation = async (r: Reservation) => query(`INSERT INTO reservation (date, time, status, id_user, id_employee, id_service) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [r.date, r.time, r.status, r.id_user, r.id_employee, r.id_service]);
export const updateReservation = async (id: number, r: Reservation) => query(`UPDATE reservation SET date=$1, time=$2, status=$3, id_user=$4, id_employee=$5, id_service=$6 WHERE id_reservation=$7 RETURNING *`, [r.date, r.time, r.status, r.id_user, r.id_employee, r.id_service, id]);
export const deleteReservation = async (id: number) => query(`UPDATE reservation SET deleted_at = NOW() WHERE id_reservation = $1`, [id]);
