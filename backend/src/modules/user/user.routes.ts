import { Elysia } from "elysia";
import * as controller from "./user.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerUserRoutes = (app: any) => {
  app.get("/users", requireRole(async () => controller.getUsers(), ["admin"]));
  app.get("/users/:id", requireAuth(async ({ params }: any) => controller.getUserById(params)));
  app.post("/users", requireRole(async ({ body }: any) => controller.createUser(body), ["admin"]));
  app.put("/users/:id", requireAuth(async ({ params, body }: any) => controller.updateUser(params, body)));
  app.delete("/users/:id", requireRole(async ({ params }: any) => controller.deleteUser(params), ["admin"]));
};