import { Elysia } from "elysia";
import * as controller from "./sale.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerSaleRoutes = (app: any) => {
  app.post("/sales", requireRole(async ({ body }: any) => controller.createSale(body), ["employee", "admin"]));
  app.get("/sales", requireAuth(async () => controller.getSales()));
  app.get("/sales/:id", requireAuth(async ({ params }: any) => controller.getSaleById(params)));
  app.get("/sales/user/:userId", requireAuth(async ({ params }: any) => controller.getSalesByUserId(Number(params.userId))));
  app.put("/sales/:id", requireRole(async ({ params, body }: any) => controller.updateSale(params, body), ["admin"]));
  app.delete("/sales/:id", requireRole(async ({ params }: any) => controller.deleteSale(params), ["admin"]));
  app.post("/sales/:id/soft-delete", requireRole(async ({ params }: any) => controller.deleteSale(params), ["admin"]));
};