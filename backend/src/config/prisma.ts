import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString =
  process.env.DATABASE_URL ??
  `postgresql://${process.env.DB_USER ?? "proy3"}:${process.env.DB_PASSWORD ?? "secret"}@${process.env.DB_HOST ?? "localhost"}:${process.env.DB_PORT ?? "5432"}/${process.env.DB_NAME ?? "barbershop"}`;

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });

