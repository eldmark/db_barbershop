import * as controller from "./employee.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

export const registerEmployeeRoutes = (app: any) => {
  app.get("/employees", requireRole(async () => controller.getEmployees(), ["admin"]));
  app.get("/employees/:id", requireAuth(async ({ params }: any) => controller.getEmployeeById(params)));
  app.post("/employees", requireRole(async ({ body }: any) => controller.createEmployee(body), ["admin"]));
  app.put("/employees/:id", requireRole(async ({ params, body }: any) => controller.updateEmployee(params, body), ["admin"]));
  app.delete("/employees/:id", requireRole(async ({ params }: any) => controller.deleteEmployee(params), ["admin"]));
};
