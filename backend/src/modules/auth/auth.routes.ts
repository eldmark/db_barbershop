import * as controller from "./auth.controller";
import { RouteApp } from "../../types/http";
import { User } from "../../types/entities";
import {
  buildClearSessionCookie,
  buildSessionCookie,
  getSessionIdFromContext
} from "../../middleware/session";

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
      return new Response(JSON.stringify({ user: result.user }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": buildSessionCookie(result.sessionId)
        }
      });
    } catch (err) {
      console.error("Login route error:", err);
      return new Response(JSON.stringify({ error: "Login failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  });

  app.post("/auth/logout", async (ctx: any) => {
    const sessionId = getSessionIdFromContext(ctx);
    await controller.logout(sessionId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildClearSessionCookie()
      }
    });
  });

  app.get("/auth/session", async (ctx: any) => {
    const sessionId = getSessionIdFromContext(ctx);
    const user = await controller.currentSession(sessionId);

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    return { user };
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
