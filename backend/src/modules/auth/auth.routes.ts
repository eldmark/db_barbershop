import * as controller from "./auth.controller";
import { RouteApp } from "../../types/http";
import { User } from "../../types/entities";

export const registerAuthRoutes = (app: RouteApp) => {
  app.post("/auth/login", async ({ body }: { body: Pick<User, "email" | "password"> }) => controller.login(body));
  app.post("/auth/register", async ({ body }: { body: Pick<User, "name" | "email" | "password"> }) => controller.register(body));
};
