import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// This project's convention is .env.local (Next.js default), not .env.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
