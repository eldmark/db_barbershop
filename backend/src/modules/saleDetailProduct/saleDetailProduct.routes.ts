import * as controller from "./saleDetailProduct.controller";
import { createAuthGuard, createRoleGuard } from "../../middleware/auth";
import { SaleDetailProduct } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerSaleDetailProductRoutes = (app: RouteApp) => {
  app.get("/sale-detail-products", async () => controller.getSaleDetailProducts(), { guard: createAuthGuard() });
  app.get("/sale-detail-products/:id", async ({ params }: RouteContext<IdParams>) => controller.getSaleDetailProductById(params), { guard: createAuthGuard() });
  app.post("/sale-detail-products", async ({ body }: RouteContext<Record<string, never>, SaleDetailProduct>) => controller.createSaleDetailProduct(body), { guard: createRoleGuard(["admin"]) });
  app.put("/sale-detail-products/:id", async ({ params, body }: RouteContext<IdParams, SaleDetailProduct>) => controller.updateSaleDetailProduct(params, body), { guard: createRoleGuard(["admin"]) });
  app.delete("/sale-detail-products/:id", async ({ params }: RouteContext<IdParams>) => controller.deleteSaleDetailProduct(params), { guard: createRoleGuard(["admin"]) });
};
