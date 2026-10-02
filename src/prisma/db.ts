import "server-only";
import "temporal-polyfill/full/global";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

const createDb = () => postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});

const globalForDb = globalThis as unknown as {
  prismaDb?: ReturnType<typeof createDb>;
};

export const db = globalForDb.prismaDb ?? createDb();

// Reuse the connection pool across Next.js development reloads.
if (process.env.NODE_ENV !== "production") globalForDb.prismaDb = db;
