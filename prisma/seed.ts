import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env.local");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      fullName: "Super Admin",
    },
  });

  await prisma.tenant.upsert({
    where: { slug: "sample-tenant" },
    update: {},
    create: {
      name: "Sample Tenant",
      slug: "sample-tenant",
      status: "ACTIVE",
      planId: "basic",
      databaseUrl: "postgresql://retail:retail_dev_password@localhost:5432/retail_sample_tenant?schema=public",
      contactEmail: "admin@sample-tenant.test",
      notes: "Local retail-software dev tenant (retail-tenant-sample Docker container).",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
