import dotenv from "dotenv";
dotenv.config();

import { defineConfig } from "drizzle-kit";

console.log("DB URL:", process.env.DATABASE_URL);

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
