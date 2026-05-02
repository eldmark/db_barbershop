import * as controller from "./supplier.controller";
import { createRoleGuard } from "../../middleware/auth";
import { Supplier } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerSupplierRoutes = (app: RouteApp) => {
  app.get("/suppliers", async () => controller.getSuppliers());
  app.get("/suppliers/:id", async ({ params }: RouteContext<IdParams>) => controller.getSupplierById(params));
  app.post("/suppliers", async ({ body }: RouteContext<Record<string, never>, Supplier>) => controller.createSupplier(body), { guard: createRoleGuard(["admin"]) });
  app.put("/suppliers/:id", async ({ params, body }: RouteContext<IdParams, Supplier>) => controller.updateSupplier(params, body), { guard: createRoleGuard(["admin"]) });
  app.delete("/suppliers/:id", async ({ params }: RouteContext<IdParams>) => controller.deleteSupplier(params), { guard: createRoleGuard(["admin"]) });
};
