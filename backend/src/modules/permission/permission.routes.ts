import * as controller from "./permission.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerPermissionRoutes = (app: any) => {
  app.get("/permissions", requireRole(async () => controller.getPermissions(), ["admin"]));
  app.get("/permissions/:id", requireRole(async ({ params }: any) => controller.getPermissionById(params), ["admin"]));
  app.post("/permissions", requireRole(async ({ body }: any) => controller.createPermission(body), ["admin"]));
  app.put("/permissions/:id", requireRole(async ({ params, body }: any) => controller.updatePermission(params, body), ["admin"]));
  app.delete("/permissions/:id", requireRole(async ({ params }: any) => controller.deletePermission(params), ["admin"]));
};
