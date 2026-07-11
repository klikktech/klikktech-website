# Vercel-First Tenant Provisioning Plan

Control-plane (`klikktek-website`) automates tenant onboarding: one **Vercel project**, one **Neon database**, and (later) one **Blob store** per tenant. Provisioning runs **asynchronously via Inngest** with live status in the admin UI.

## Goals

- Remove manual `databaseUrl` entry when provisioning is configured
- Match the manual workflow: create Neon from inside Vercel (no separate Neon API key)
- One silo per tenant: isolated Vercel project + Postgres + blob scope
- Show provisioning progress in the admin UI; reveal secrets only when complete

## Architecture

```
Super admin → /admin/tenants/new (form)
    → Create Tenant (provisioningStatus: QUEUED)
    → Inngest event: tenant/provision.requested
    → Background steps (update status after each)
    → ACTIVE → show temp password + onboarding link flow
```



### Per-tenant resources


| Resource             | Naming                         | Created via                  |
| -------------------- | ------------------------------ | ---------------------------- |
| Vercel project       | `retail-{slug}`                | Vercel API                   |
| Neon DB              | via Vercel Storage integration | Vercel Storage API           |
| Blob                 | per Vercel project             | Phase 2 — Vercel integration |
| Control-plane record | `Tenant` row                   | Prisma                       |




### What stays on the control plane

- **klikktek-website** own `DATABASE_URL` (tenant registry)
- **klikktek-website** own `BLOB_READ_WRITE_TOKEN` (onboarding logos)
- `Tenant.databaseUrl` — copied from the tenant project's Vercel env after Neon connect

---



## Prerequisites



### Vercel (personal account — no team required)

- [x] Vercel API token — [vercel.com/account/tokens](https://vercel.com/account/tokens)
- [ ] Neon integration installed on personal account (Storage / Marketplace → Neon)
- [ ] `NEON_INTEGRATION_CONFIGURATION_ID` (`icfg_...`) — Integrations UI or:
  ```bash
  curl -s "https://api.vercel.com/v1/integrations" \
    -H "Authorization: Bearer $VERCEL_API_TOKEN"
  ```

- [ ] GitHub: Vercel GitHub app has access to the `retail-software` repo
- [ ] `RETAIL_SOFTWARE_GITHUB_REPO` — e.g. `org/retail-software`

**Note:** Omit `VERCEL_TEAM_ID` on personal-account API calls unless a team is created later.

### Inngest

- [ ] Inngest account — [inngest.com](https://www.inngest.com)
- [ ] App created (e.g. `klikktek-control-plane`)
- [ ] Local dev: `npx inngest-cli@latest dev` alongside `npm run dev`
- [ ] Env: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`



### Environment variables (control plane)

```bash
# Vercel-first provisioning
VERCEL_API_TOKEN=
NEON_INTEGRATION_CONFIGURATION_ID=icfg_
RETAIL_SOFTWARE_GITHUB_REPO=org/retail-software

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Existing control-plane (unchanged)
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
RESEND_API_KEY=
# ...
```

---



## Phase 1 — Vercel project + Neon + migrate/seed + status UI



### 1.1 Schema (`prisma/schema.prisma`)

Add enum `ProvisioningStatus`:

```
QUEUED
CREATING_VERCEL_PROJECT
CREATING_NEON
CONNECTING_NEON
FETCHING_DATABASE_URL
RUNNING_MIGRATIONS
SEEDING
SYNCING
ACTIVE
FAILED
```

Add optional fields on `Tenant`:


| Field                | Type    | Purpose                    |
| -------------------- | ------- | -------------------------- |
| `provisioningStatus` | enum    | Current step               |
| `provisioningError`  | String? | Last failure message       |
| `vercelProjectId`    | String? | Cleanup / deploy           |
| `vercelProjectUrl`   | String? | Tenant app URL (Phase 2)   |
| `neonResourceId`     | String? | Vercel storage resource id |


- `databaseUrl` remains required in schema but may be empty until `FETCHING_DATABASE_URL` completes
- Migration: backfill existing tenants with `provisioningStatus: ACTIVE`



### 1.2 Backend modules


| File                                        | Responsibility                                                 |
| ------------------------------------------- | -------------------------------------------------------------- |
| `src/core/logic/vercel-client.ts`           | `fetchVercel()` wrapper, auth, optional `teamId`               |
| `src/core/logic/vercel-provisioning.ts`     | Project create, git link, Neon store, connect, read env        |
| `src/core/logic/provisioning-worker.ts`     | Step functions called by Inngest                               |
| `src/core/logic/tenant-provisioning.ts`     | Refactor: migrate + seed only (remove local `CREATE DATABASE`) |
| `src/inngest/client.ts`                     | Inngest client                                                 |
| `src/inngest/functions/provision-tenant.ts` | Multi-step Inngest function                                    |
| `src/app/api/inngest/route.ts`              | Inngest serve handler                                          |




### 1.3 Vercel API sequence (per tenant)

1. **Create project** — `POST /v11/projects` (name: `retail-{slug}`)
2. **Link GitHub repo** — connect `RETAIL_SOFTWARE_GITHUB_REPO`
3. **Create Neon store** — `POST /v1/storage/stores/integration/direct`
  - `integrationConfigurationId`, Neon product slug, `name: retail-{slug}`
4. **Connect to project** — `POST /v1/integrations/installations/{icfg}/resources/{resourceId}/connections`
  - `projectId`, `envVarEnvironments: ["production", "preview"]`
5. **Fetch** `DATABASE_URL` — `GET /v9/projects/{id}/env` → save on `Tenant`
6. **Run migrations** — against `databaseUrl` (bundled migrations artifact — not sibling-repo `execFile`)
7. **Seed tenant** — existing `seedInitialTenantData` (StoreSettings + `TENANT_ADMIN`)
8. **Sync features** — existing `syncFeaturesToTenant`
9. **Set** `ACTIVE` — surface one-time temp password in admin UI



### 1.4 Inngest function

**Event:** `tenant/provision.requested`

**Payload:** `{ tenantId, slug, name, contactEmail, planId }`

```ts
inngest.createFunction(
  { id: "provision-tenant", retries: 3 },
  { event: "tenant/provision.requested" },
  async ({ event, step }) => {
    await step.run("create-vercel-project", ...)
    await step.run("create-neon-store", ...)
    await step.run("connect-neon", ...)
    await step.run("fetch-database-url", ...)
    await step.run("run-migrations", ...)
    await step.run("seed-tenant", ...)
    await step.run("sync-features", ...)
  }
)
```

Each step:

- Updates `Tenant.provisioningStatus`
- On failure: set `FAILED` + `provisioningError`, rethrow for Inngest retry where appropriate



### 1.5 Server action changes

`provisionTenantAction`:

1. Validate input (no `databaseUrl`)
2. Create `Tenant` with `provisioningStatus: QUEUED` and placeholder `databaseUrl`
3. `inngest.send({ name: "tenant/provision.requested", data: { ... } })`
4. Redirect to `/admin/tenants/[id]` (do not block on completion)

`isVercelProvisioningConfigured()`:

- Requires `VERCEL_API_TOKEN`, `NEON_INTEGRATION_CONFIGURATION_ID`, and `RETAIL_SOFTWARE_GITHUB_REPO`

**Fallback:** manual `createTenantAction` + `databaseUrl` when Vercel provisioning is not configured (local dev).

### 1.6 UI


| Location              | Behavior                                                            |
| --------------------- | ------------------------------------------------------------------- |
| `/admin/tenants/new`  | Provision form when Vercel configured; manual form otherwise        |
| `/admin/tenants/[id]` | Provisioning stepper when status ≠ `ACTIVE`                         |
| Poll                  | `GET /api/admin/tenants/[id]/provisioning-status` every 2–3s        |
| Success               | `AdminSecretReveal` for temp password when `ACTIVE`                 |
| Failure               | Error message + "Retry provisioning" button (re-send Inngest event) |




### 1.7 Migration packaging

**Decision:** run `prisma migrate deploy` without `RETAIL_SOFTWARE_REPO_PATH`.

- **Option A (recommended):** Copy `retail-software` `prisma/migrations` into the control-plane as `RETAIL_SOFTWARE_MIGRATIONS_PATH` (or a packaged artifact updated when retail-software migrations change)
- **Option B:** First Vercel deploy runs migrations in `build` — control plane only seeds after deploy webhook (slower, more moving parts)

Phase 1 uses **Option A**.

### 1.8 Phase 1 exit criteria

- [ ] New tenant from admin UI provisions without manual `databaseUrl`
- [ ] Status updates visible in UI within a few seconds
- [ ] `DATABASE_URL` stored on `Tenant`; sync and onboarding work
- [ ] Temp password shown once on success
- [ ] Failed run shows error + retry
- [ ] Local fallback still works without Vercel env vars

---



## Phase 2 — Blob + deploy



### Steps

1. Create Blob store via Vercel Storage API (same integration pattern)
2. Connect to tenant project → `BLOB_READ_WRITE_TOKEN` injected
3. Trigger deployment via Vercel Deployments API
4. Poll until `READY`
5. Store `vercelProjectUrl` on `Tenant`



### Status additions

```
CREATING_BLOB
CONNECTING_BLOB
DEPLOYING
VERIFYING
```



### Phase 2 exit criteria

- [ ] Tenant app URL live after provision
- [ ] Blob uploads work on the tenant app

---



## Phase 3 — Deprovision + hardening

- Delete Vercel project + Neon resource on tenant delete (`deleteTenantAction`)
- Idempotent provisioning (skip steps if resource already exists)
- Retry from last successful step
- Secrets: consider not storing full `databaseUrl` in plaintext long-term
- Remove production dependency on `TENANT_DB_ADMIN_URL` / `RETAIL_SOFTWARE_REPO_PATH`
- Document all env vars in `CLAUDE.md` and `README.md`

---



## Risks and mitigations


| Risk                                             | Mitigation                                                      |
| ------------------------------------------------ | --------------------------------------------------------------- |
| Vercel API git link fails                        | Test manual link once; document required GitHub permissions     |
| Server action timeout                            | Never provision synchronously — Inngest only                    |
| Partial provision (Neon created, project failed) | Store resource IDs; compensating delete or resume               |
| Duplicate projects on retry                      | Idempotent naming; check existing project by slug before create |
| Wrong integration config id                      | Validate in startup or admin settings health check              |


---



## Implementation order

1. Prisma migration + types
2. `vercel-client.ts` + `vercel-provisioning.ts`
3. Inngest setup (`client`, `route`, `provision-tenant` function)
4. Refactor `provisionTenantAction` + `isVercelProvisioningConfigured()`
5. Provisioning status API route
6. Admin UI stepper + poll
7. Migration artifact path for retail-software
8. Update `CLAUDE.md` / `README.md`
9. Manual E2E test against personal Vercel account

---



## References

- [Vercel API tokens](https://vercel.com/kb/guide/how-do-i-use-a-vercel-api-access-token)
- [Vercel Storage / Marketplace](https://vercel.com/docs/marketplace-storage)
- [Create integration store](https://vercel.com/docs/rest-api/integrations/create-integration-store-free-and-paid-plans)
- [Connect integration to project](https://vercel.com/docs/rest-api/integrations/connect-integration-resource-to-project)
- [Inngest + Next.js](https://www.inngest.com/docs/sdk/nextjs)
- [Neon Vercel-managed integration](https://neon.com/docs/guides/vercel-managed-integration)
- Existing code: `src/core/logic/tenant-provisioning.ts`, `src/app/admin/(dashboard)/tenants/actions.ts`

