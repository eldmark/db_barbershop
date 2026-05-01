import * as controller from "./saleDetailProduct.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { SaleDetailProduct } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerSaleDetailProductRoutes = (app: RouteApp) => {
  app.get("/sale-detail-products", requireAuth(async () => controller.getSaleDetailProducts()));
  app.get("/sale-detail-products/:id", requireAuth(async ({ params }: RouteContext<IdParams>) => controller.getSaleDetailProductById(params)));
  app.post("/sale-detail-products", requireRole(async ({ body }: RouteContext<Record<string, never>, SaleDetailProduct>) => controller.createSaleDetailProduct(body), ["admin"]));
  app.put("/sale-detail-products/:id", requireRole(async ({ params, body }: RouteContext<IdParams, SaleDetailProduct>) => controller.updateSaleDetailProduct(params, body), ["admin"]));
  app.delete("/sale-detail-products/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.deleteSaleDetailProduct(params), ["admin"]));
};
