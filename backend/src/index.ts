import { Elysia } from "elysia";
import { registerProductRoutes } from "./modules/product/product.routes";
import { registerUserRoutes } from "./modules/user/user.routes";
import { registerSaleRoutes } from "./modules/sale/sale.routes";
import { registerCategoryRoutes } from "./modules/category/category.routes";
import { registerSupplierRoutes } from "./modules/supplier/supplier.routes";
import { registerEmployeeRoutes } from "./modules/employee/employee.routes";
import { registerServiceRoutes } from "./modules/serviceEntity/service.routes";
import { registerReservationRoutes } from "./modules/reservation/reservation.routes";
import { registerRoleRoutes } from "./modules/role/role.routes";
import { registerPermissionRoutes } from "./modules/permission/permission.routes";
import { registerSaleDetailProductRoutes } from "./modules/saleDetailProduct/saleDetailProduct.routes";
import { registerSaleDetailServiceRoutes } from "./modules/saleDetailService/saleDetailService.routes";

const app = new Elysia();

registerProductRoutes(app);
registerUserRoutes(app);
registerSaleRoutes(app);
registerCategoryRoutes(app);
registerSupplierRoutes(app);
registerEmployeeRoutes(app);
registerServiceRoutes(app);
registerReservationRoutes(app);
registerRoleRoutes(app);
registerPermissionRoutes(app);
registerSaleDetailProductRoutes(app);
registerSaleDetailServiceRoutes(app);

app.get("/", () => "Hello Elysia");

const server = app.listen(3000);

console.log(`🦊 Elysia is running at ${server.server?.hostname}:${server.server?.port}`);
