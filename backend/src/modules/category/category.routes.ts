import * as controller from "./category.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Category } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerCategoryRoutes = (app: RouteApp) => {
  app.get("/categories", async () => controller.getCategories());
  app.get("/categories/:id", async ({ params }: RouteContext<IdParams>) => controller.getCategoryById(params));
  app.post("/categories", requireRole(async ({ body }: RouteContext<Record<string, never>, Category>) => controller.createCategory(body), ["admin"]));
  app.put("/categories/:id", requireRole(async ({ params, body }: RouteContext<IdParams, Category>) => controller.updateCategory(params, body), ["admin"]));
  app.delete("/categories/:id", requireRole(async ({ params }: RouteContext<IdParams>) => controller.deleteCategory(params), ["admin"]));
};
