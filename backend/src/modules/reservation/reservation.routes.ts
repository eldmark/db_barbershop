import * as controller from "./reservation.controller";
import { createAuthGuard } from "../../middleware/auth";
import { Reservation } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerReservationRoutes = (app: RouteApp) => {
  app.get("/reservations", async () => controller.getReservations(), { guard: createAuthGuard() });
  app.get("/reservations/:id", async ({ params }: RouteContext<IdParams>) => controller.getReservationById(params), { guard: createAuthGuard() });
  app.post("/reservations", async ({ body }: RouteContext<Record<string, never>, Reservation>) => controller.createReservation(body), { guard: createAuthGuard() });
  app.put("/reservations/:id", async ({ params, body }: RouteContext<IdParams, Reservation>) => controller.updateReservation(params, body), { guard: createAuthGuard() });
  app.delete("/reservations/:id", async ({ params }: RouteContext<IdParams>) => controller.deleteReservation(params), { guard: createAuthGuard() });
};
