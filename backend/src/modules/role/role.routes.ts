import * as controller from "./role.controller";

export const registerRoleRoutes = (app: any) => {
  app.get("/roles", async () => controller.getRoles());
  app.get("/roles/:id", async ({ params }: any) => controller.getRoleById(params));
  app.post("/roles", async ({ body }: any) => controller.createRole(body));
  app.put("/roles/:id", async ({ params, body }: any) => controller.updateRole(params, body));
  app.delete("/roles/:id", async ({ params }: any) => controller.deleteRole(params));
};
