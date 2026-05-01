import * as controller from "./auth.controller";

export const registerAuthRoutes = (app: any) => {
  app.post("/auth/login", async ({ body }: any) => controller.login(body));
  app.post("/auth/register", async ({ body }: any) => controller.register(body));
};
