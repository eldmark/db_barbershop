import * as controller from "./category.controller";

export const registerCategoryRoutes = (app: any) => {
  app.get("/categories", async () => controller.getCategories());
  app.get("/categories/:id", async ({ params }: any) => controller.getCategoryById(params));
  app.post("/categories", async ({ body }: any) => controller.createCategory(body));
  app.put("/categories/:id", async ({ params, body }: any) => controller.updateCategory(params, body));
  app.delete("/categories/:id", async ({ params }: any) => controller.deleteCategory(params));
};
