import { prisma } from "../../config/prisma";
import { Reservation } from "../../types/entities";

const reservationInclude = {
  user: true,
  employee: true,
  service: true
};

const toDateOnly = (date: string | Date) => {
  if (date instanceof Date) return date;
  return new Date(`${date.split("T")[0]}T00:00:00.000Z`);
};

const toTimeOnly = (time: string | Date) => {
  if (time instanceof Date) return time;
  const normalized = time.length === 5 ? `${time}:00` : time;
  return new Date(`1970-01-01T${normalized.replace(/Z$/, "")}.000Z`);
};

const formatDate = (date: unknown) => {
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  return String(date);
};

const formatTime = (time: unknown) => {
  if (time instanceof Date) return time.toISOString().slice(11, 19);
  return String(time);
};

const serializeReservation = (reservation: any) => ({
  ...reservation,
  date: formatDate(reservation.date),
  time: formatTime(reservation.time),
  user_name: reservation.user?.name,
  employee_name: reservation.employee?.name,
  service_name: reservation.service?.name
});

export const getReservations = async () => {
  const reservations = await prisma.reservation.findMany({
    where: { deleted_at: null },
    include: reservationInclude,
    orderBy: { id_reservation: "asc" }
  });
  return reservations.map(serializeReservation);
};

export const getReservationById = async (id: number) => {
  const reservation = await prisma.reservation.findFirst({
    where: {
      id_reservation: id,
      deleted_at: null
    },
    include: reservationInclude
  });
  return reservation ? serializeReservation(reservation) : null;
};

export const createReservation = async (r: Reservation) => {
  const reservation = await prisma.reservation.create({
    data: {
      date: toDateOnly(r.date),
      time: toTimeOnly(r.time),
      status: r.status,
      id_user: r.id_user,
      id_employee: r.id_employee,
      id_service: r.id_service
    }
  });
  return serializeReservation(reservation);
};

export const updateReservation = async (id: number, r: Reservation) => {
  const reservation = await prisma.reservation.update({
    where: { id_reservation: id },
    data: {
      date: toDateOnly(r.date),
      time: toTimeOnly(r.time),
      status: r.status,
      id_user: r.id_user,
      id_employee: r.id_employee,
      id_service: r.id_service,
      updated_at: new Date()
    }
  });
  return serializeReservation(reservation);
};

export const deleteReservation = async (id: number) => {
  await prisma.reservation.update({
    where: { id_reservation: id },
    data: { deleted_at: new Date() }
  });
  return { success: true };
};
