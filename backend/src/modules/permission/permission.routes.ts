import * as controller from "./permission.controller";

export const registerPermissionRoutes = (app: any) => {
  app.get("/permissions", async () => controller.getPermissions());
  app.get("/permissions/:id", async ({ params }: any) => controller.getPermissionById(params));
  app.post("/permissions", async ({ body }: any) => controller.createPermission(body));
  app.put("/permissions/:id", async ({ params, body }: any) => controller.updatePermission(params, body));
  app.delete("/permissions/:id", async ({ params }: any) => controller.deletePermission(params));
};
