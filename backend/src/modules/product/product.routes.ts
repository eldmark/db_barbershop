import { Elysia } from "elysia";
import * as controller from "./product.controller";

export const registerProductRoutes = (app: any) => {
  app.get("/products", async () => controller.getProducts());
  app.get("/products/:id", async ({ params }: any) => controller.getProductById(params));
  app.post("/products", async ({ body }: any) => controller.createProduct(body));
  app.put("/products/:id", async ({ params, body }: any) => controller.updateProduct(params, body));
  app.delete("/products/:id", async ({ params }: any) => controller.deleteProduct(params));
};