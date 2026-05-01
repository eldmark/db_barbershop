import * as controller from "./role.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Role } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerRoleRoutes = (app: RouteApp) => {
  app.get("/roles", requireRole(async () => controller.getRoles(), ["admin"]));
  app.get("/roles/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.getRoleById(params), ["admin"]));
  app.post("/roles", requireRole(async ({ body }: RouteContext<Record<string, never>, Role>) => controller.createRole(body), ["admin"]));
  app.put("/roles/:id", requireRole(async ({ params, body }: RouteContext<IdParams, Role>) => controller.updateRole(params, body), ["admin"]));
  app.delete("/roles/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.deleteRole(params), ["admin"]));
};
