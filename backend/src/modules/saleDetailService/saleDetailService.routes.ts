import * as controller from "./saleDetailService.controller";

export const registerSaleDetailServiceRoutes = (app: any) => {
  app.get("/sale-detail-services", async () => controller.getSaleDetailServices());
  app.get("/sale-detail-services/:id", async ({ params }: any) => controller.getSaleDetailServiceById(params));
  app.post("/sale-detail-services", async ({ body }: any) => controller.createSaleDetailService(body));
  app.put("/sale-detail-services/:id", async ({ params, body }: any) => controller.updateSaleDetailService(params, body));
  app.delete("/sale-detail-services/:id", async ({ params }: any) => controller.deleteSaleDetailService(params));
};
