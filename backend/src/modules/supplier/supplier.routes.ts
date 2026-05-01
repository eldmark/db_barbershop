import * as controller from "./supplier.controller";

export const registerSupplierRoutes = (app: any) => {
  app.get("/suppliers", async () => controller.getSuppliers());
  app.get("/suppliers/:id", async ({ params }: any) => controller.getSupplierById(params));
  app.post("/suppliers", async ({ body }: any) => controller.createSupplier(body));
  app.put("/suppliers/:id", async ({ params, body }: any) => controller.updateSupplier(params, body));
  app.delete("/suppliers/:id", async ({ params }: any) => controller.deleteSupplier(params));
};
