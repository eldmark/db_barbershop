import * as controller from "./supplier.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerSupplierRoutes = (app: any) => {
  app.get("/suppliers", async () => controller.getSuppliers());
  app.get("/suppliers/:id", async ({ params }: any) => controller.getSupplierById(params));
  app.post("/suppliers", requireRole(async ({ body }: any) => controller.createSupplier(body), ["admin"]));
  app.put("/suppliers/:id", requireRole(async ({ params, body }: any) => controller.updateSupplier(params, body), ["admin"]));
  app.delete("/suppliers/:id", requireRole(async ({ params }: any) => controller.deleteSupplier(params), ["admin"]));
};
