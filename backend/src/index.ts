import { Elysia } from "elysia";
import { registerProductRoutes } from "./modules/product/product.routes";
import { registerUserRoutes } from "./modules/user/user.routes";
import { registerSaleRoutes } from "./modules/sale/sale.routes";
import { registerCategoryRoutes } from "./modules/category/category.routes";
import { registerSupplierRoutes } from "./modules/supplier/supplier.routes";
import { registerServiceRoutes } from "./modules/serviceEntity/service.routes";
import { registerReservationRoutes } from "./modules/reservation/reservation.routes";
import { registerRoleRoutes } from "./modules/role/role.routes";
import { registerPermissionRoutes } from "./modules/permission/permission.routes";
import { registerSaleDetailProductRoutes } from "./modules/saleDetailProduct/saleDetailProduct.routes";
import { registerSaleDetailServiceRoutes } from "./modules/saleDetailService/saleDetailService.routes";
import { registerAuthRoutes } from "./modules/auth/auth.routes";
import { pool } from "./config/db";

const app = new Elysia();

registerProductRoutes(app);
registerUserRoutes(app);
registerSaleRoutes(app);
registerCategoryRoutes(app);
registerSupplierRoutes(app);
registerServiceRoutes(app);
registerReservationRoutes(app);
registerRoleRoutes(app);
registerPermissionRoutes(app);
registerSaleDetailProductRoutes(app);
registerSaleDetailServiceRoutes(app);
registerAuthRoutes(app);

app.get("/", () => "Server is running");

app.get("/health", async () => {
	const server = { status: "ok" };
	try {
		await pool.query("SELECT 1");
		return { server, db: { status: "ok" } };
	} catch (err) {
		return { server, db: { status: "down", error: String(err) } };
	}
});

const server = app.listen(3000);

console.log(` Server is running at ${server.server?.hostname}:${server.server?.port}`);
