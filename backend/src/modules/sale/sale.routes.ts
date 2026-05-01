import * as controller from "./sale.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { SaleInput } from "../../types/entities";
import { IdParams, RouteApp, RouteContext, UserIdParams } from "../../types/http";

export const registerSaleRoutes = (app: RouteApp) => {
  app.post("/sales", requireRole(async ({ body }: RouteContext<Record<string, never>, SaleInput>) => controller.createSale(body), ["employee", "admin"]));
  app.get("/sales", requireAuth(async () => controller.getSales()));
  app.get("/sales/:id", requireAuth(async ({ params }: RouteContext<IdParams>) => controller.getSaleById(params)));
  app.get("/sales/user/:userId", requireAuth(async ({ params }: RouteContext<UserIdParams>) => controller.getSalesByUserId(Number(params.userId))));
  app.put("/sales/:id", requireRole(async ({ params, body }: RouteContext<IdParams, SaleInput>) => controller.updateSale(params, body), ["admin"]));
  app.delete("/sales/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.deleteSale(params), ["admin"]));
  app.post("/sales/:id/soft-delete", requireRole(async ({ params }: RouteContext<IdParams>) => controller.deleteSale(params), ["admin"]));
};