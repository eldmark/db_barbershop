import * as controller from "./saleDetailProduct.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerSaleDetailProductRoutes = (app: any) => {
  app.get("/sale-detail-products", requireAuth(async () => controller.getSaleDetailProducts()));
  app.get("/sale-detail-products/:id", requireAuth(async ({ params }: any) => controller.getSaleDetailProductById(params)));
  app.post("/sale-detail-products", requireRole(async ({ body }: any) => controller.createSaleDetailProduct(body), ["admin"]));
  app.put("/sale-detail-products/:id", requireRole(async ({ params, body }: any) => controller.updateSaleDetailProduct(params, body), ["admin"]));
  app.delete("/sale-detail-products/:id", requireRole(async ({ params }: any) => controller.deleteSaleDetailProduct(params), ["admin"]));
};
