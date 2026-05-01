import * as controller from "./category.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerCategoryRoutes = (app: any) => {
  app.get("/categories", async () => controller.getCategories());
  app.get("/categories/:id", async ({ params }: any) => controller.getCategoryById(params));
  app.post("/categories", requireRole(async ({ body }: any) => controller.createCategory(body), ["admin"]));
  app.put("/categories/:id", requireRole(async ({ params, body }: any) => controller.updateCategory(params, body), ["admin"]));
  app.delete("/categories/:id", requireRole(async ({ params }: any) => controller.deleteCategory(params), ["admin"]));
};
