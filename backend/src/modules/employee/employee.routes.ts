import * as controller from "./employee.controller";

export const registerEmployeeRoutes = (app: any) => {
  app.get("/employees", async () => controller.getEmployees());
  app.get("/employees/:id", async ({ params }: any) => controller.getEmployeeById(params));
  app.post("/employees", async ({ body }: any) => controller.createEmployee(body));
  app.put("/employees/:id", async ({ params, body }: any) => controller.updateEmployee(params, body));
  app.delete("/employees/:id", async ({ params }: any) => controller.deleteEmployee(params));
};
