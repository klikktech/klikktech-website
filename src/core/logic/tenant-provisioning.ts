import "server-only";
import { Client } from "pg";
import { randomUUID, randomBytes } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { hashPassword } from "./password";

const execFileAsync = promisify(execFile);

function tenantDatabaseName(slug: string): string {
  return `retail_tenant_${slug.replace(/-/g, "_")}`;
}

function databaseNameFromUrl(databaseUrl: string): string | null {
  try {
    return decodeURIComponent(new URL(databaseUrl).pathname.replace(/^\//, ""));
  } catch {
    return null;
  }
}

// True when databaseUrl points at the database this provisioner would have
// created for the slug — used as a safety gate before DROP DATABASE.
export function canDeprovisionTenantDatabase(slug: string, databaseUrl: string): boolean {
  const expected = tenantDatabaseName(slug);
  const actual = databaseNameFromUrl(databaseUrl);
  return actual !== null && actual === expected;
}

// Creates a fresh, empty Postgres database for the tenant on the same local
// server that already hosts retail-software's sample tenant (TENANT_DB_ADMIN_URL
// points at its "postgres" maintenance database). A stand-in for a real
// per-tenant managed instance in production, where this would call a cloud
// provider's API (e.g. Neon, RDS) instead.
async function createTenantDatabase(slug: string): Promise<string> {
  const adminUrl = process.env.TENANT_DB_ADMIN_URL;
  if (!adminUrl) throw new Error("TENANT_DB_ADMIN_URL is not configured.");
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Slug must contain only lowercase letters, numbers, and hyphens.");
  }

  const dbName = tenantDatabaseName(slug);
  const client = new Client({ connectionString: adminUrl });
  await client.connect();
  try {
    await client.query(`CREATE DATABASE "${dbName}"`);
  } finally {
    await client.end();
  }

  const url = new URL(adminUrl);
  url.pathname = `/${dbName}`;
  return url.toString();
}

// Shells out to retail-software's own "prisma migrate deploy" against the
// new database. Assumes retail-software is checked out as a sibling repo on
// this machine (RETAIL_SOFTWARE_REPO_PATH) — a real deployment pipeline
// would package migrations as a build artifact instead of reaching into a
// sibling directory.
async function runMigrations(databaseUrl: string): Promise<void> {
  const repoPath = process.env.RETAIL_SOFTWARE_REPO_PATH;
  if (!repoPath) throw new Error("RETAIL_SOFTWARE_REPO_PATH is not configured.");

  await execFileAsync("npx", ["prisma", "migrate", "deploy"], {
    cwd: repoPath,
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
}

interface SeedResult {
  adminEmail: string;
  tempPassword: string;
}

// Seeds only what the tenant needs to log into their own /admin for the
// first time: the StoreSettings singleton row (storeName is a placeholder —
// the real one gets set via the onboarding form) and one TENANT_ADMIN Staff
// account with a random temp password, returned once so the super admin can
// hand it to the tenant.
async function seedInitialTenantData(
  databaseUrl: string,
  input: { storeName: string; contactEmail: string }
): Promise<SeedResult> {
  const tempPassword = randomBytes(9).toString("base64url");
  const passwordHash = await hashPassword(tempPassword);

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query(
      `INSERT INTO "StoreSettings" (id, "storeName", "contactEmail", "updatedAt")
       VALUES (1, $1, $2, now())
       ON CONFLICT (id) DO NOTHING`,
      [input.storeName, input.contactEmail]
    );
    await client.query(
      `INSERT INTO "Staff" (id, email, "passwordHash", "fullName", role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, 'TENANT_ADMIN', now(), now())`,
      [randomUUID(), input.contactEmail, passwordHash, `${input.storeName} Admin`]
    );
  } finally {
    await client.end();
  }

  return { adminEmail: input.contactEmail, tempPassword };
}

export interface ProvisionTenantResult {
  databaseUrl: string;
  adminEmail: string;
  tempPassword: string;
}

// Automates the previously-manual steps of tenant creation: provision a
// database, run retail-software's migrations against it, and seed the one
// admin login the tenant needs before they complete onboarding (which fills
// in the rest of StoreSettings via /onboarding/[token]).
export async function provisionTenantDatabase(input: {
  slug: string;
  storeName: string;
  contactEmail: string;
}): Promise<ProvisionTenantResult> {
  const databaseUrl = await createTenantDatabase(input.slug);
  await runMigrations(databaseUrl);
  const seed = await seedInitialTenantData(databaseUrl, input);
  return { databaseUrl, ...seed };
}

// Drops the provisioned Postgres database for this tenant. Only runs when
// databaseUrl matches the slug-derived retail_tenant_* name — external or
// seed databases are never touched (registry-only delete handles those).
export async function deprovisionTenantDatabase(
  slug: string,
  databaseUrl: string
): Promise<void> {
  if (!canDeprovisionTenantDatabase(slug, databaseUrl)) {
    throw new Error(
      "This tenant's database was not created by the provisioner and cannot be dropped automatically."
    );
  }

  const adminUrl = process.env.TENANT_DB_ADMIN_URL;
  if (!adminUrl) throw new Error("TENANT_DB_ADMIN_URL is not configured.");

  const dbName = tenantDatabaseName(slug);
  const client = new Client({ connectionString: adminUrl });
  await client.connect();
  try {
    await client.query(
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()`,
      [dbName]
    );
    await client.query(`DROP DATABASE IF EXISTS "${dbName}"`);
  } finally {
    await client.end();
  }
}
