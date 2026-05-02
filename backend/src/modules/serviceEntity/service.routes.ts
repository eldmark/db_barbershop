import * as controller from "./service.controller";
import { createRoleGuard } from "../../middleware/auth";
import { ServiceEntity } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerServiceRoutes = (app: RouteApp) => {
  app.get("/services", async () => controller.getServices());
  app.get("/services/:id", async ({ params }: RouteContext<IdParams>) => controller.getServiceById(params));
  app.post("/services", async ({ body }: RouteContext<Record<string, never>, ServiceEntity>) => controller.createService(body), { guard: createRoleGuard(["admin", "employee"]) });
  app.put("/services/:id", async ({ params, body }: RouteContext<IdParams, ServiceEntity>) => controller.updateService(params, body), { guard: createRoleGuard(["admin", "employee"]) });
  app.delete("/services/:id", async ({ params }: RouteContext<IdParams>) => controller.deleteService(params), { guard: createRoleGuard(["admin", "employee"]) });
};
