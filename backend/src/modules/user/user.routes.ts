import * as controller from "./user.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { RouteApp, RouteContext, IdParams } from "../../types/http";
import { User } from "../../types/entities";

export const registerUserRoutes = (app: RouteApp) => {
  app.get("/users", requireRole(async () => controller.getUsers(), ["admin"]));
  app.get("/users/:id", requireAuth(async ({ params }: RouteContext<IdParams>) => controller.getUserById(params)));
  app.post(
    "/users",
    requireRole(async ({ body }: RouteContext<Record<string, never>, Pick<User, "name" | "email" | "password">>) => controller.createUser(body), ["admin"])
  );
  app.put("/users/:id", requireAuth(async ({ params, body }: RouteContext<IdParams, Pick<User, "name" | "email">>) => controller.updateUser(params, body)));
  app.delete("/users/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.deleteUser(params), ["admin"]));
};