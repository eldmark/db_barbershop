import { query } from "../../utils/db";
import { Reservation } from "../../types/entities";

export const getReservations = async () => query(`SELECT * FROM Reservation WHERE deleted_at IS NULL`);
export const getReservationById = async (id: number) => query(`SELECT * FROM Reservation WHERE id_reservation = $1 AND deleted_at IS NULL`, [id]);
export const createReservation = async (r: Reservation) => query(`INSERT INTO Reservation (date, time, status, id_user, id_employee, id_service) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [r.date, r.time, r.status, r.id_user, r.id_employee, r.id_service]);
export const updateReservation = async (id: number, r: Reservation) => query(`UPDATE Reservation SET date=$1, time=$2, status=$3, id_user=$4, id_employee=$5, id_service=$6 WHERE id_reservation=$7 RETURNING *`, [r.date, r.time, r.status, r.id_user, r.id_employee, r.id_service, id]);
export const deleteReservation = async (id: number) => query(`UPDATE Reservation SET deleted_at = NOW() WHERE id_reservation = $1`, [id]);
