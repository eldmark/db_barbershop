import * as controller from "./reservation.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Reservation } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerReservationRoutes = (app: RouteApp) => {
  app.get("/reservations", requireAuth(async () => controller.getReservations()));
  app.get("/reservations/:id", requireAuth(async ({ params }: RouteContext<IdParams>) => controller.getReservationById(params)));
  app.post("/reservations", requireAuth(async ({ body }: RouteContext<Record<string, never>, Reservation>) => controller.createReservation(body)));
  app.put("/reservations/:id", requireAuth(async ({ params, body }: RouteContext<IdParams, Reservation>) => controller.updateReservation(params, body)));
  app.delete("/reservations/:id", requireAuth(async ({ params }: RouteContext<IdParams>) => controller.deleteReservation(params)));
};
