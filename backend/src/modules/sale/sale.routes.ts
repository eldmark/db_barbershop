import { Elysia } from "elysia";
import * as controller from "./sale.controller";

export const registerSaleRoutes = (app: any) => {
  app.post("/sales", async ({ body }: any) => controller.createSale(body));
  app.get("/sales", async () => controller.getSales());
  app.get("/sales/:id", async ({ params }: any) => controller.getSaleById(params));
  app.get("/sales/user/:userId", async ({ params }: any) => controller.getSalesByUserId(Number(params.userId)));
  app.put("/sales/:id", async ({ params, body }: any) => controller.updateSale(params, body));
  app.delete("/sales/:id", async ({ params }: any) => controller.deleteSale(params));
  app.post("/sales/:id/soft-delete", async ({ params }: any) => controller.deleteSale(params));
};