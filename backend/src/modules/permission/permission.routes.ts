import * as controller from "./permission.controller";
import { createRoleGuard } from "../../middleware/auth";
import { Permission } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerPermissionRoutes = (app: RouteApp) => {
  app.get("/permissions", async () => controller.getPermissions(), { guard: createRoleGuard(["admin"]) });
  app.get("/permissions/:id", async ({ params }: RouteContext<IdParams>) => controller.getPermissionById(params), { guard: createRoleGuard(["admin"]) });
  app.post("/permissions", async ({ body }: RouteContext<Record<string, never>, Permission>) => controller.createPermission(body), { guard: createRoleGuard(["admin"]) });
  app.put("/permissions/:id", async ({ params, body }: RouteContext<IdParams, Permission>) => controller.updatePermission(params, body), { guard: createRoleGuard(["admin"]) });
  app.delete("/permissions/:id", async ({ params }: RouteContext<IdParams>) => controller.deletePermission(params), { guard: createRoleGuard(["admin"]) });
};
