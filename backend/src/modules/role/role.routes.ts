import * as controller from "./role.controller";
import { createRoleGuard } from "../../middleware/auth";
import { Role } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerRoleRoutes = (app: RouteApp) => {
  app.get("/roles", async () => controller.getRoles(), { guard: createRoleGuard(["admin"]) });
  app.get("/roles/:id", async ({ params }: RouteContext<IdParams>) => controller.getRoleById(params), { guard: createRoleGuard(["admin"]) });
  app.post("/roles", async ({ body }: RouteContext<Record<string, never>, Role>) => controller.createRole(body), { guard: createRoleGuard(["admin"]) });
  app.put("/roles/:id", async ({ params, body }: RouteContext<IdParams, Role>) => controller.updateRole(params, body), { guard: createRoleGuard(["admin"]) });
  app.delete("/roles/:id", async ({ params }: RouteContext<IdParams>) => controller.deleteRole(params), { guard: createRoleGuard(["admin"]) });
};
