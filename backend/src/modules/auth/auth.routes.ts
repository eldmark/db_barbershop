import * as controller from "./auth.controller";
import { RouteApp } from "../../types/http";
import { User } from "../../types/entities";

export const registerAuthRoutes = (app: RouteApp) => {
  app.post("/auth/login", async ({ body }: { body: Pick<User, "email" | "password"> }) => {
    try {
      const result = await controller.login(body);
      if (!result) {
        return new Response(JSON.stringify({ error: "Invalid email or password" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      return result;
    } catch (err) {
      console.error("Login route error:", err);
      return new Response(JSON.stringify({ error: "Login failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  });
  app.post("/auth/register", async ({ body }: { body: Pick<User, "name" | "email" | "password"> }) => {
    try {
      return await controller.register(body);
    } catch (err) {
      console.error("Register route error:", err);
      return new Response(JSON.stringify({ error: "Registration failed: " + String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  });
};
