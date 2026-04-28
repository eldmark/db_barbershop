import { Elysia } from "elysia";
import * as controller from "./user.controller";

export const userRoutes = new Elysia({ prefix: "/users" })
  .get("/", controller.getUsers)
  .get("/:id", ({ params }) => controller.getUserById(params))
  .post("/", ({ body }) => controller.createUser(body))
  .delete("/:id", ({ params }) => controller.deleteUser(params));