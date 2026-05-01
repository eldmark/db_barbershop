import * as controller from "./saleDetailService.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { SaleDetailService } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerSaleDetailServiceRoutes = (app: RouteApp) => {
  app.get("/sale-detail-services", requireAuth(async () => controller.getSaleDetailServices()));
  app.get("/sale-detail-services/:id", requireAuth(async ({ params }: RouteContext<IdParams>) => controller.getSaleDetailServiceById(params)));
  app.post("/sale-detail-services", requireRole(async ({ body }: RouteContext<Record<string, never>, SaleDetailService>) => controller.createSaleDetailService(body), ["admin"]));
  app.put("/sale-detail-services/:id", requireRole(async ({ params, body }: RouteContext<IdParams, SaleDetailService>) => controller.updateSaleDetailService(params, body), ["admin"]));
  app.delete("/sale-detail-services/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.deleteSaleDetailService(params), ["admin"]));
};
