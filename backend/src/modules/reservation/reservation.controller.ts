import * as service from "./reservation.service";

export const getReservations = async () => service.getReservations();
export const getReservationById = async (params: any) => service.getReservationById(Number(params.id));
export const createReservation = async (body: any) => service.createReservation(body);
export const updateReservation = async (params: any, body: any) => service.updateReservation(Number(params.id), body);
export const deleteReservation = async (params: any) => service.deleteReservation(Number(params.id));
