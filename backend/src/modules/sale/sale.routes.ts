import * as controller from "./sale.controller";
import { getDashboardStats } from "./sale.summary";
import { createAuthGuard, createRoleGuard } from "../../middleware/auth";
import { SaleInput } from "../../types/entities";
import { IdParams, RouteApp, RouteContext, UserIdParams } from "../../types/http";

export const registerSaleRoutes = (app: RouteApp) => {
  app.get("/sales/summary", async () => getDashboardStats(), { guard: createAuthGuard() });
  app.post("/sales", async ({ body }: RouteContext<Record<string, never>, SaleInput>) => controller.createSale(body), { guard: createRoleGuard(["employee", "admin"]) });
  app.get("/sales", async () => controller.getSales(), { guard: createAuthGuard() });
  app.get("/sales/:id", async ({ params }: RouteContext<IdParams>) => controller.getSaleById(params), { guard: createAuthGuard() });
  app.get("/sales/user/:userId", async ({ params }: RouteContext<UserIdParams>) => controller.getSalesByUserId(Number(params.userId)), { guard: createAuthGuard() });
  app.put("/sales/:id", async ({ params, body }: RouteContext<IdParams, SaleInput>) => controller.updateSale(params, body), { guard: createRoleGuard(["admin"]) });
  app.delete("/sales/:id", async ({ params }: RouteContext<IdParams>) => controller.deleteSale(params), { guard: createRoleGuard(["admin"]) });
  app.post("/sales/:id/soft-delete", async ({ params }: RouteContext<IdParams>) => controller.deleteSale(params), { guard: createRoleGuard(["admin"]) });
};