import * as controller from "./saleDetailProduct.controller";

export const registerSaleDetailProductRoutes = (app: any) => {
  app.get("/sale-detail-products", async () => controller.getSaleDetailProducts());
  app.get("/sale-detail-products/:id", async ({ params }: any) => controller.getSaleDetailProductById(params));
  app.post("/sale-detail-products", async ({ body }: any) => controller.createSaleDetailProduct(body));
  app.put("/sale-detail-products/:id", async ({ params, body }: any) => controller.updateSaleDetailProduct(params, body));
  app.delete("/sale-detail-products/:id", async ({ params }: any) => controller.deleteSaleDetailProduct(params));
};
