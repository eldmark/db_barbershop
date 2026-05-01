import * as service from "./reservation.service";
import { Reservation } from "../../types/entities";
import { IdParams } from "../../types/http";

export const getReservations = async () => service.getReservations();
export const getReservationById = async (params: IdParams) => service.getReservationById(Number(params.id));
export const createReservation = async (body: Reservation) => service.createReservation(body);
export const updateReservation = async (params: IdParams, body: Reservation) => service.updateReservation(Number(params.id), body);
export const deleteReservation = async (params: IdParams) => service.deleteReservation(Number(params.id));
