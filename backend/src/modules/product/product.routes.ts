import * as controller from "./product.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { RouteApp, RouteContext, IdParams } from "../../types/http";
import { Product } from "../../types/entities";

export const registerProductRoutes = (app: RouteApp) => {
  app.get("/products", async () => controller.getProducts());
  app.get("/products/:id", async ({ params }: RouteContext<IdParams>) => controller.getProductById(params));
  app.post("/products", requireRole(async ({ body }: RouteContext<Record<string, never>, Product>) => controller.createProduct(body), ["admin"]));
  app.put("/products/:id", requireRole(async ({ params, body }: RouteContext<IdParams, Product>) => controller.updateProduct(params, body), ["admin"]));
  app.delete("/products/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.deleteProduct(params), ["admin"]));
};