import * as controller from "./supplier.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Supplier } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerSupplierRoutes = (app: RouteApp) => {
  app.get("/suppliers", async () => controller.getSuppliers());
  app.get("/suppliers/:id", async ({ params }: RouteContext<IdParams>) => controller.getSupplierById(params));
  app.post("/suppliers", requireRole(async ({ body }: RouteContext<Record<string, never>, Supplier>) => controller.createSupplier(body), ["admin"]));
  app.put("/suppliers/:id", requireRole(async ({ params, body }: RouteContext<IdParams, Supplier>) => controller.updateSupplier(params, body), ["admin"]));
  app.delete("/suppliers/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.deleteSupplier(params), ["admin"]));
};
