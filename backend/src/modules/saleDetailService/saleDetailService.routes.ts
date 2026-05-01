import * as controller from "./saleDetailService.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerSaleDetailServiceRoutes = (app: any) => {
  app.get("/sale-detail-services", requireAuth(async () => controller.getSaleDetailServices()));
  app.get("/sale-detail-services/:id", requireAuth(async ({ params }: any) => controller.getSaleDetailServiceById(params)));
  app.post("/sale-detail-services", requireRole(async ({ body }: any) => controller.createSaleDetailService(body), ["admin"]));
  app.put("/sale-detail-services/:id", requireRole(async ({ params, body }: any) => controller.updateSaleDetailService(params, body), ["admin"]));
  app.delete("/sale-detail-services/:id", requireRole(async ({ params }: any) => controller.deleteSaleDetailService(params), ["admin"]));
};
