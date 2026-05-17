import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { RouteApp } from "./types/http";
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
import bcrypt from "bcrypt";
const port = process.env.PORT || 3000;

const app = new Elysia().use(
	cors({
		origin: (origin) => {
			// allow any origin for development; adjust in production
			return true;
		},
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"]
	})
);

app.onError(({ code, error }) => {
	if (error?.message === "Missing token" || error?.message === "Invalid token") {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
	}
	if (error?.message === "Forbidden") {
		return new Response(JSON.stringify({ error: "Forbidden" }), {
			status: 403,
			headers: { "Content-Type": "application/json" }
		});
	}
	// Default error handling
	return new Response(JSON.stringify({ error: error?.message || "Internal Server Error" }), {
		status: 500,
		headers: { "Content-Type": "application/json" }
	});
});

const routeApp = app as unknown as RouteApp;

registerAuthRoutes(routeApp);
registerUserRoutes(routeApp);
registerProductRoutes(routeApp);
registerSaleRoutes(routeApp);
registerCategoryRoutes(routeApp);
registerSupplierRoutes(routeApp);
registerServiceRoutes(routeApp);
registerReservationRoutes(routeApp);
registerRoleRoutes(routeApp);
registerPermissionRoutes(routeApp);
registerSaleDetailProductRoutes(routeApp);
registerSaleDetailServiceRoutes(routeApp);

app.get("/", () => "Server is running");

// Debug endpoint: list users with roles (temporary)
app.get("/debug/users", async () => {
	try {
		const res = await pool.query(
			`SELECT u.id_user, u.name, u.email, COALESCE(json_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '[]') AS roles
			 FROM user_account u
			 LEFT JOIN user_role ur ON u.id_user = ur.id_user
			 LEFT JOIN role r ON ur.id_role = r.id_role
			 GROUP BY u.id_user, u.name, u.email`
		);
		return { users: res.rows };
	} catch (err) {
		console.error("Debug users error:", err);
		return { error: String(err) };
	}
});

// Setup endpoint to create demo users with proper bcrypt hashing
import createDemoUsers from "./modules/auth/setupDemo";

app.get("/setup-demo", async () => {
  try {
	await createDemoUsers();
	return { message: "Demo users created successfully", credentials: { email: "employee@example.com", password: "password123" } };
  } catch (err) {
	console.error("Setup error:", err);
	return { error: String(err), status: 500 };
  }
});

// Utility endpoint to correct demo user role mappings (temporary)
// Temporary role-fix endpoint removed after verification.
const server = app.listen({
	port: Number(port),
	hostname: "0.0.0.0"
});

// Attempt to create demo users on startup (idempotent)
void (async () => {
	try {
		await createDemoUsers();
		console.log("Demo users ensured on startup");
	} catch (err) {
		console.error("Failed to ensure demo users at startup:", err);
	}
})();

console.log(` Server is running at ${server.server?.hostname}:${server.server?.port}`);
