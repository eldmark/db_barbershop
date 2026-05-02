import * as controller from "./category.controller";
import { createRoleGuard } from "../../middleware/auth";
import { Category } from "../../types/entities";
import { IdParams, RouteApp, RouteContext } from "../../types/http";

export const registerCategoryRoutes = (app: RouteApp) => {
  app.get("/categories", async () => controller.getCategories());
  app.get("/categories/:id", async ({ params }: RouteContext<IdParams>) => controller.getCategoryById(params));
  app.post("/categories", async ({ body }: RouteContext<Record<string, never>, Category>) => controller.createCategory(body), { guard: createRoleGuard(["admin"]) });
  app.put("/categories/:id", async ({ params, body }: RouteContext<IdParams, Category>) => controller.updateCategory(params, body), { guard: createRoleGuard(["admin"]) });
  app.delete("/categories/:id", async ({ params }: RouteContext<IdParams>) => controller.deleteCategory(params), { guard: createRoleGuard(["admin"]) });
};
