import { Elysia } from "elysia";
import { createSale } from "./sale.service";

export const saleRoutes = new Elysia({ prefix: "/sales" })
  .post("/", ({ body }) => createSale(body));