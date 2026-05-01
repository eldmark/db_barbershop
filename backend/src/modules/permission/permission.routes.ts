import * as controller from "./permission.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Permission } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerPermissionRoutes = (app: RouteApp) => {
  app.get("/permissions", requireRole(async () => controller.getPermissions(), ["admin"]));
  app.get("/permissions/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.getPermissionById(params), ["admin"]));
  app.post("/permissions", requireRole(async ({ body }: RouteContext<Record<string, never>, Permission>) => controller.createPermission(body), ["admin"]));
  app.put("/permissions/:id", requireRole(async ({ params, body }: RouteContext<IdParams, Permission>) => controller.updatePermission(params, body), ["admin"]));
  app.delete("/permissions/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.deletePermission(params), ["admin"]));
};
