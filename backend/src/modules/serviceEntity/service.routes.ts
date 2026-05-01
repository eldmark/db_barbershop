import * as controller from "./service.controller";

export const registerServiceRoutes = (app: any) => {
  app.get("/services", async () => controller.getServices());
  app.get("/services/:id", async ({ params }: any) => controller.getServiceById(params));
  app.post("/services", async ({ body }: any) => controller.createService(body));
  app.put("/services/:id", async ({ params, body }: any) => controller.updateService(params, body));
  app.delete("/services/:id", async ({ params }: any) => controller.deleteService(params));
};
