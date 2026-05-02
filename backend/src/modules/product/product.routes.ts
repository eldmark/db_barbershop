import * as controller from "./product.controller";
import { createAuthGuard, createRoleGuard } from "../../middleware/auth";
import { RouteApp, RouteContext, IdParams } from "../../types/http";
import { Product } from "../../types/entities";

export const registerProductRoutes = (app: RouteApp) => {
  app.get("/products", async () => controller.getProducts());
  app.get("/products/:id", async ({ params }: RouteContext<IdParams>) => controller.getProductById(params));
  app.post("/products", async ({ body }: RouteContext<Record<string, never>, Product>) => controller.createProduct(body), { guard: createRoleGuard(["admin", "employee"]) });
  app.put("/products/:id", async ({ params, body }: RouteContext<IdParams, Product>) => controller.updateProduct(params, body), { guard: createRoleGuard(["admin", "employee"]) });
  app.delete("/products/:id", async ({ params }: RouteContext<IdParams>) => controller.deleteProduct(params), { guard: createRoleGuard(["admin", "employee"]) });
};