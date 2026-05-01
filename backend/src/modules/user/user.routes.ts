import { Elysia } from "elysia";
import * as controller from "./user.controller";

export const registerUserRoutes = (app: any) => {
  app.get("/users", async () => controller.getUsers());
  app.get("/users/:id", async ({ params }: any) => controller.getUserById(params));
  app.post("/users", async ({ body }: any) => controller.createUser(body));
  app.put("/users/:id", async ({ params, body }: any) => controller.updateUser(params, body));
  app.delete("/users/:id", async ({ params }: any) => controller.deleteUser(params));
};