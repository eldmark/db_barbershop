import { Elysia } from "elysia";
import * as controller from "./product.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerProductRoutes = (app: any) => {
  app.get("/products", async () => controller.getProducts());
  app.get("/products/:id", async ({ params }: any) => controller.getProductById(params));
  app.post("/products", requireRole(async ({ body }: any) => controller.createProduct(body), ["admin"]));
  app.put("/products/:id", requireRole(async ({ params, body }: any) => controller.updateProduct(params, body), ["admin"]));
  app.delete("/products/:id", requireRole(async ({ params }: any) => controller.deleteProduct(params), ["admin"]));
};