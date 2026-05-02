import * as controller from "./user.controller";
import { createAuthGuard, createRoleGuard } from "../../middleware/auth";
import { RouteApp, RouteContext, IdParams } from "../../types/http";
import { User } from "../../types/entities";

export const registerUserRoutes = (app: RouteApp) => {
  app.get("/users", async () => controller.getUsers(), { guard: createRoleGuard(["admin", "employee"]) });
  app.get("/users/:id", async ({ params }: RouteContext<IdParams>) => controller.getUserById(params), { guard: createAuthGuard() });
  app.post("/users", async ({ body }: RouteContext<Record<string, never>, Pick<User, "name" | "email" | "password">>) => controller.createUser(body), { guard: createRoleGuard(["admin"]) });
  app.put("/users/:id", async ({ params, body }: RouteContext<IdParams, Pick<User, "name" | "email">>) => controller.updateUser(params, body), { guard: createAuthGuard() });
  app.delete("/users/:id", async ({ params }: RouteContext<IdParams>) => controller.deleteUser(params), { guard: createRoleGuard(["admin"]) });
};
