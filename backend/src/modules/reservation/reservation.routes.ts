import * as controller from "./reservation.controller";

export const registerReservationRoutes = (app: any) => {
  app.get("/reservations", async () => controller.getReservations());
  app.get("/reservations/:id", async ({ params }: any) => controller.getReservationById(params));
  app.post("/reservations", async ({ body }: any) => controller.createReservation(body));
  app.put("/reservations/:id", async ({ params, body }: any) => controller.updateReservation(params, body));
  app.delete("/reservations/:id", async ({ params }: any) => controller.deleteReservation(params));
};
