import * as controller from "./reservation.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerReservationRoutes = (app: any) => {
  app.get("/reservations", requireAuth(async () => controller.getReservations()));
  app.get("/reservations/:id", requireAuth(async ({ params }: any) => controller.getReservationById(params)));
  app.post("/reservations", requireAuth(async ({ body }: any) => controller.createReservation(body)));
  app.put("/reservations/:id", requireAuth(async ({ params, body }: any) => controller.updateReservation(params, body)));
  app.delete("/reservations/:id", requireAuth(async ({ params }: any) => controller.deleteReservation(params)));
};
