import * as controller from "./service.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { ServiceEntity } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerServiceRoutes = (app: RouteApp) => {
  app.get("/services", async () => controller.getServices());
  app.get("/services/:id", async ({ params }: RouteContext<IdParams>) => controller.getServiceById(params));
  app.post("/services", requireRole(async ({ body }: RouteContext<Record<string, never>, ServiceEntity>) => controller.createService(body), ["admin"]));
  app.put("/services/:id", requireRole(async ({ params, body }: RouteContext<IdParams, ServiceEntity>) => controller.updateService(params, body), ["admin"]));
  app.delete("/services/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.deleteService(params), ["admin"]));
};
