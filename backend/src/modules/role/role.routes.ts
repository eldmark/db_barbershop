import * as controller from "./role.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerRoleRoutes = (app: any) => {
  app.get("/roles", requireRole(async () => controller.getRoles(), ["admin"]));
  app.get("/roles/:id", requireRole(async ({ params }: any) => controller.getRoleById(params), ["admin"]));
  app.post("/roles", requireRole(async ({ body }: any) => controller.createRole(body), ["admin"]));
  app.put("/roles/:id", requireRole(async ({ params, body }: any) => controller.updateRole(params, body), ["admin"]));
  app.delete("/roles/:id", requireRole(async ({ params }: any) => controller.deleteRole(params), ["admin"]));
};
