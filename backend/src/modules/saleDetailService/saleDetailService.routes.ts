import * as controller from "./saleDetailService.controller";
import { createAuthGuard, createRoleGuard } from "../../middleware/auth";
import { SaleDetailService } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerSaleDetailServiceRoutes = (app: RouteApp) => {
  app.get("/sale-detail-services", async () => controller.getSaleDetailServices(), { guard: createAuthGuard() });
  app.get("/sale-detail-services/:id", async ({ params }: RouteContext<IdParams>) => controller.getSaleDetailServiceById(params), { guard: createAuthGuard() });
  app.post("/sale-detail-services", async ({ body }: RouteContext<Record<string, never>, SaleDetailService>) => controller.createSaleDetailService(body), { guard: createRoleGuard(["admin"]) });
  app.put("/sale-detail-services/:id", async ({ params, body }: RouteContext<IdParams, SaleDetailService>) => controller.updateSaleDetailService(params, body), { guard: createRoleGuard(["admin"]) });
  app.delete("/sale-detail-services/:id", async ({ params }: RouteContext<IdParams>) => controller.deleteSaleDetailService(params), { guard: createRoleGuard(["admin"]) });
};
