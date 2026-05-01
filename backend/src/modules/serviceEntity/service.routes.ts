import * as controller from "./service.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerServiceRoutes = (app: any) => {
  app.get("/services", async () => controller.getServices());
  app.get("/services/:id", async ({ params }: any) => controller.getServiceById(params));
  app.post("/services", requireRole(async ({ body }: any) => controller.createService(body), ["admin"]));
  app.put("/services/:id", requireRole(async ({ params, body }: any) => controller.updateService(params, body), ["admin"]));
  app.delete("/services/:id", requireRole(async ({ params }: any) => controller.deleteService(params), ["admin"]));
};
