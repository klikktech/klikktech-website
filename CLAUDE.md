# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Next.js, localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint (flat config: eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit # type-check (no dedicated script; strict mode is on)
npm run db:seed  # tsx prisma/seed.ts — seeds the super admin user + sample tenant registry row

npx prisma migrate dev --name <name>   # create + apply a control-plane migration
npx prisma studio                       # inspect the control-plane DB visually
```

There is no test suite/framework configured in this repo.

## Architecture

Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind CSS v4. Path alias `@/*` → `src/*`.

### Atomic Design component structure

`src/components` is strictly layered (enforced by `.cursor/rules/code-organization.mdc`, not by lint/build tooling — respect it manually):

- `atoms/` — smallest presentational elements (button, input, badge, tag, icon…). Must not import from molecules/organisms/templates.
- `molecules/` — groups of atoms, no business logic. May only import atoms.
- `organisms/` — feature sections with business logic (hero-section, cta-banner, testimonials-section, payment-section…). May import atoms + molecules.
- `templates/` — page-level layout shells (`marketing-layout`, `marketing-container`). May import atoms/molecules/organisms.
- `src/app/**` — routes; may import from any layer.

Each component lives in its own folder with a barrel `index.ts` re-exporting the component (e.g. `atoms/button/button.tsx` + `atoms/button/index.ts`).

Styling is done via Tailwind utility classes composed with `cn()` (`src/lib/utils/cn.ts`, a `clsx` + `tailwind-merge` wrapper) — always use `cn()` rather than raw string concatenation when a `className` prop can be overridden.

### Design tokens

`src/app/globals.css` defines the entire design system as CSS custom properties (Material-Design-3-style surface/primary/secondary/tertiary tokens) under `:root`, then maps them into Tailwind v4 via `@theme inline`. Custom typography utilities (`text-display`, `text-headline-lg`, `text-body-md`, `text-label-md`, etc.) and layout utilities (`rounded-card`, `shadow-overlay`, `max-w-container`) are declared with `@utility` — prefer these over ad-hoc Tailwind font/spacing utilities so type scale and radii stay consistent. Fonts: Geist (display), Inter (body), JetBrains Mono (label), wired up as CSS variables in `src/app/layout.tsx`.

### Content/SEO separation

- `src/lib/content/*.ts` — static page copy (home, services, projects, contact) kept out of components.
- `src/lib/seo/site-config.ts` — canonical site config (`siteSeoConfig`), `siteUrl`, `absoluteUrl()`, and the site's public route list used for the sitemap.
- `src/lib/seo/page-seo.ts` — per-route title/description/keyword definitions.
- `src/lib/seo/metadata.ts` — `createPageMetadata()` builds a Next `Metadata` object (canonical, OG, Twitter, robots) from a page-seo entry; use it in every route's exported `metadata`.
- `src/lib/seo/schema.ts` — schema.org JSON-LD builders (organization, localBusiness, website, webPage, breadcrumb, service, FAQ, creativeWork, contactPage) plus `combineSchemas()` to merge them into a `@graph`; rendered via `<JsonLd data={...} />` (`components/atoms/json-ld`).

When adding a new route, follow the existing pattern: define its copy in `lib/content`, its SEO metadata in `lib/seo/page-seo.ts`, call `createPageMetadata` for the exported `metadata`, and add the route to `publicRoutes` in `site-config.ts` so it appears in `src/app/sitemap.ts`.

### API routes (`src/app/api/*/route.ts`)

- `create-payment-intent` — creates a Stripe PaymentIntent (`force-dynamic`); Stripe client is lazily instantiated and memoized module-level (`getStripe()`).
- `webhook` — Stripe webhook handler, verifies `stripe-signature` against `STRIPE_WEBHOOK_SECRET`, and on `payment_intent.succeeded` sends confirmation/notification emails via Resend.
- `generate-invoice` — protected by a static bearer token (`INVOICE_SECRET`); renders a PDF with `@react-pdf/renderer` from `src/lib/pdf/invoice-document.tsx` and streams it back as `application/pdf`. The client caller is `src/app/kt-invoice/page.tsx`, which sends `Authorization: Bearer ${NEXT_PUBLIC_INVOICE_SECRET}` — this is a client-exposed secret, so treat `kt-invoice` as an internal/unlisted tool, not a public-facing page.
- `inquiry` / `cta-contact` — form submission endpoints that send paired emails through Resend (team notification + visitor confirmation), inline HTML templates, from `contact@klikktek.com`. They intentionally don't fail the whole request if only the visitor-confirmation send fails (logged, not thrown).

Required env vars (see `.env.local`, not committed): `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `INVOICE_SECRET`, `NEXT_PUBLIC_INVOICE_SECRET`, `DATABASE_URL`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `BLOB_READ_WRITE_TOKEN` (Vercel Blob, image uploads), `NEXT_PUBLIC_SITE_URL` (canonical/upload URL base — defaults to `https://klikktek.com` if unset). `TENANT_DB_ADMIN_URL`/`RETAIL_SOFTWARE_REPO_PATH` are optional and local-dev-only (see "Automated local provisioning" below).

### Super admin portal (`/admin`)

This repo also hosts the **control-plane app** for the separate `retail-software` multi-tenant SaaS project (a silo-model billing platform: one Postgres DB per tenant, no shared `tenant_id` columns). Under that silo model a tenant's feature entitlements live in *that tenant's own* database, not here — so this portal is a **registry + remote control** that also provisions new tenant databases locally (see below); a real deployment would swap the local-provisioning step for a cloud provider's API (Neon/RDS) plus a Vercel project per tenant, per retail-software's own plan.

- **Own Postgres + Prisma** (v7, driver-adapter, generator output `src/generated/prisma`, imported as `@/generated/prisma/client`) — entirely separate from any tenant's database. `prisma.config.ts` loads env from `.env.local` (this project's convention) rather than Prisma's `.env` default.
- **Auth**: `AdminUser`/`AdminSession` (`src/core/logic/admin-auth.ts`) — single internal-ops login, hashed-token session in an `admin_session` cookie, mirrors retail-software's own `Staff`/`StaffSession` pattern. Route-gating uses a Next.js route-group split: `src/app/admin/(auth)/login/` is unguarded, `src/app/admin/(dashboard)/layout.tsx` calls `requireAdmin()` — a single `layout.tsx` directly at `src/app/admin/` would also wrap `/admin/login` and redirect-loop.
- **Tenant registry** (`src/core/logic/tenants.ts`): `Tenant` rows hold `name`, `slug`, `status`, `planId`, `featureOverrides` (Json `{enabled?: string[], disabled?: string[]}`), and `databaseUrl` (plaintext in this pass — no secrets vault yet, acceptable for one internal tenant, revisit before onboarding real customers).
- `src/core/logic/feature-keys.ts` — `FEATURE_KEYS`/`PLAN_IDS` are a **manually-synced copy** of retail-software's `core/logic/features.ts`; there's no shared package between the two repos, so keep this list in sync by hand whenever a feature key changes on that side.
- **The sync mechanism** (`src/core/logic/tenant-sync.ts::syncFeaturesToTenant`) is the part that actually closes the loop: it opens a direct `pg.Client` connection using the tenant's stored `databaseUrl` and runs a parameterized `UPDATE "StoreSettings" SET "planId" = $1, "featureOverrides" = $2 WHERE id = 1` — the exact table/columns retail-software's `core/logic/features.ts::resolveFeatures()` reads. Triggered by a "Sync to tenant DB" button on `/admin/tenants/[id]`, surfaced as a plain success/error message rather than throwing.
- Tenant create/edit are plain pages (`/admin/tenants/new`, `/admin/tenants/[id]`), not modals — unlike retail-software's own admin (which uses modals per its CLAUDE.md convention), this repo has no `Modal` primitive and is a much smaller two-screen internal tool, so a dedicated component wasn't worth adding.
- **Automated local provisioning** (`src/core/logic/tenant-provisioning.ts::provisionTenantDatabase`, wired to `provisionTenantAction` behind `/admin/tenants/new`'s form): creates a fresh Postgres database on the same local server that hosts retail-software's sample tenant (`TENANT_DB_ADMIN_URL`, a separate database per tenant rather than a separate server — the local stand-in for a real per-tenant managed instance), shells out to retail-software's own `npx prisma migrate deploy` against it (`RETAIL_SOFTWARE_REPO_PATH` — assumes that repo is checked out as a sibling directory on this machine; a real pipeline would package migrations as a build artifact instead), then seeds just enough via raw `pg` inserts for the tenant to log in for the first time: the `StoreSettings` singleton row (placeholder `storeName`, real values come later from onboarding) and one `TENANT_ADMIN` `Staff` row with a random temp password. That password and the admin email are returned once in the action's response state (never persisted in plaintext, same one-time-reveal pattern as the onboarding link) before the control-plane `Tenant` record is created pointing at the new `databaseUrl`.
  - **Both env vars are local-only** — neither a Postgres admin connection nor a sibling repo checkout exists in a deployed environment (e.g. Vercel). `isAutoProvisioningConfigured()` checks both are set; `/admin/tenants/new` falls back to the original manual flow (`createTenantAction`, plain `AdminTenantForm` with a hand-typed `databaseUrl`) whenever they're not, rather than showing a form that would always fail with a provisioning error.
- **Tenant deletion** (`deprovisionTenantDatabase` + `deleteTenantAction` on `/admin/tenants/[id]` danger zone): super admin must type the tenant's exact `name` to confirm. If `databaseUrl` matches the slug-derived `retail_tenant_*` name from provisioning (`canDeprovisionTenantDatabase`), terminates connections and `DROP DATABASE` via `TENANT_DB_ADMIN_URL`, then deletes the control-plane row and any local onboarding logo in `public/uploads`. Externally registered tenants (e.g. seed `retail_sample_tenant`) only get registry removal — the UI warns that the database must be deleted manually.

### Tenant onboarding (`/onboarding/[token]`)

The tenant's own store configuration (store name, logo, theme, contact info, currency, brand colors, open/closed) is filled in by **the tenant themselves**, not the super admin — and afterward read-only in their retail-software `/admin/settings`. Access is a one-time magic link, not a password account, since the link only ever renders this one form:

- `generateOnboardingLink()` / `getTenantByOnboardingToken()` / `completeOnboarding()` (`src/core/logic/tenants.ts`) mint a token (hash + 7-day expiry stored on `Tenant`, raw token shown exactly once), validate it, and on submit clear the hash (single-use) — reusing `generateSessionToken`/`hashToken` from `src/core/logic/session-token.ts` rather than new crypto code. Regenerating a link later (e.g. to fix a typo) doesn't gate on `onboardingCompletedAt`, so it just reopens the same form pre-filled with current values.
- `src/app/onboarding/[token]/page.tsx` has **no admin auth** — the token in the URL is the entire access control, same trust model as a password-reset link.
- `src/core/logic/feature-keys.ts` also carries a manually-synced copy of retail-software's `resolveFeatures()`/`entitledThemeIds()` (not just the key lists) — this is the only remaining place that enforces "only show/accept themes this tenant's plan actually entitles," since retail-software's own settings page no longer validates anything (it's read-only display now).
- The logo is a real file upload, stored in **this repo's own** Vercel Blob store (`src/lib/uploads.ts::saveUploadedImage`, `@vercel/blob`'s `put()` — same swap made in retail-software, since Vercel's serverless filesystem is read-only) rather than the tenant's — there's no shared storage between the two servers. It returns Blob's own absolute URL, and retail-software just renders it as an ordinary external `<img src>` (`StoreLogo.tsx` already does this, no `next/image` domain config needed). Requires `BLOB_READ_WRITE_TOKEN` in `.env.local`.
- `src/core/logic/tenant-sync.ts::syncOnboardingToTenant` is a **separate** function/UPDATE from `syncFeaturesToTenant`, deliberately not merged — combining them would mean clicking the existing plan/feature "Sync" button before onboarding is complete could blast the tenant's real `storeName`/etc. to `NULL`.
- The super admin's only involvement is generating/regenerating the link from `/admin/tenants/[id]` (`generateOnboardingLinkAction`) — the raw link is returned once in the action's response state and never persisted in plaintext.

## Project-specific conventions (from Cursor rules)

- Favor React Server Components; minimize `'use client'`, `useEffect`, and `useState` — reach for them only where interactivity genuinely requires it (forms, the invoice generator, payment flow).
- Directory names are lowercase-with-dashes.
- Use early returns / guard clauses for error conditions in API routes (already the pattern in every route handler — follow it for new ones).


### Code structure

```bash
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── prisma
│   ├── migrations
│   │   ├── 20260707052931_init
│   │   │   └── migration.sql
│   │   └── 20260707013536_add_onboarding
│   │       └── migration.sql
│   ├── schema.prisma
│   └── seed.ts
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── images
│   │   ├── chatbot-abstract.svg
│   │   ├── code-screen.svg
│   │   ├── hero-dashboard.png
│   │   ├── hero-dashboard.svg
│   │   ├── hero.webp
│   │   ├── klikktek-logo-horizontal.svg
│   │   ├── project-dashboard.svg
│   │   ├── project-map.svg
│   │   ├── server-room.svg
│   │   └── sigma-wholesale
│   │       ├── admin
│   │       │   ├── admin-2.png
│   │       │   ├── admin-3.png
│   │       │   ├── admin-4.png
│   │       │   ├── admin-5.png
│   │       │   └── admin-6.png
│   │       └── customer
│   │           ├── customer-1.png
│   │           ├── customer-2.png
│   │           ├── customer-3.png
│   │           ├── customer-4.png
│   │           ├── customer-5.png
│   │           ├── customer-6.png
│   │           ├── customer-7.png
│   │           └── Screenshot 2026-06-16 at 11.53.07 AM.png
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── src
│   ├── app
│   │   ├── admin
│   │   │   ├── actions.ts
│   │   │   ├── (auth)
│   │   │   │   └── login
│   │   │   │      ├── actions.ts
│   │   │   │      └── page.tsx
│   │   │   └── (dashboard)
│   │   │      ├── layout.tsx
│   │   │      ├── page.tsx
│   │   │      └── tenants
│   │   │         ├── actions.ts
│   │   │         ├── new
│   │   │         │   └── page.tsx
│   │   │         └── [id]
│   │   │            └── page.tsx
│   │   ├── api
│   │   │   ├── create-payment-intent
│   │   │   │   └── route.ts
│   │   │   ├── cta-contact
│   │   │   │   └── route.ts
│   │   │   ├── generate-invoice
│   │   │   │   └── route.ts
│   │   │   ├── inquiry
│   │   │   │   └── route.ts
│   │   │   └── webhook
│   │   │       └── route.ts
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── kt-invoice
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── onboarding
│   │   │   └── [token]
│   │   │      ├── actions.ts
│   │   │      └── page.tsx
│   │   ├── page.tsx
│   │   ├── projects
│   │   │   └── page.tsx
│   │   ├── robots.ts
│   │   ├── services
│   │   │   └── page.tsx
│   │   └── sitemap.ts
│   ├── components
│   │   ├── atoms
│   │   │   ├── avatar
│   │   │   │   ├── avatar.tsx
│   │   │   │   └── index.ts
│   │   │   ├── badge
│   │   │   │   ├── badge.tsx
│   │   │   │   └── index.ts
│   │   │   ├── button
│   │   │   │   ├── button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── divider
│   │   │   │   ├── divider.tsx
│   │   │   │   └── index.ts
│   │   │   ├── icon
│   │   │   │   ├── icon.tsx
│   │   │   │   └── index.ts
│   │   │   ├── input
│   │   │   │   ├── index.ts
│   │   │   │   └── input.tsx
│   │   │   ├── json-ld
│   │   │   │   ├── index.ts
│   │   │   │   └── json-ld.tsx
│   │   │   ├── select
│   │   │   │   ├── index.ts
│   │   │   │   └── select.tsx
│   │   │   ├── tag
│   │   │   │   ├── index.ts
│   │   │   │   └── tag.tsx
│   │   │   └── textarea
│   │   │       ├── index.ts
│   │   │       └── textarea.tsx
│   │   ├── molecules
│   │   │   ├── admin-section-card
│   │   │   │   ├── admin-section-card.tsx
│   │   │   │   └── index.ts
│   │   │   ├── breadcrumbs
│   │   │   │   ├── breadcrumbs.tsx
│   │   │   │   └── index.ts
│   │   │   ├── compact-testimonial-card
│   │   │   │   ├── compact-testimonial-card.tsx
│   │   │   │   └── index.ts
│   │   │   ├── contact-info-block
│   │   │   │   ├── contact-info-block.tsx
│   │   │   │   └── index.ts
│   │   │   ├── copy-button
│   │   │   │   ├── copy-button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── featured-case-study-card
│   │   │   │   ├── featured-case-study-card.tsx
│   │   │   │   └── index.ts
│   │   │   ├── form-field
│   │   │   │   ├── form-field.tsx
│   │   │   │   └── index.ts
│   │   │   ├── metric-card
│   │   │   │   ├── index.ts
│   │   │   │   └── metric-card.tsx
│   │   │   ├── mobile-nav
│   │   │   │   ├── index.ts
│   │   │   │   └── mobile-nav.tsx
│   │   │   ├── nav-link
│   │   │   │   ├── index.ts
│   │   │   │   └── nav-link.tsx
│   │   │   ├── newsletter-form
│   │   │   │   ├── index.ts
│   │   │   │   └── newsletter-form.tsx
│   │   │   ├── progress-bar
│   │   │   │   ├── index.ts
│   │   │   │   └── progress-bar.tsx
│   │   │   ├── project-card
│   │   │   │   ├── index.ts
│   │   │   │   └── project-card.tsx
│   │   │   ├── project-carousel
│   │   │   │   ├── index.tsx
│   │   │   │   └── project-carousel.tsx
│   │   │   ├── project-carousel-card
│   │   │   │   ├── index.tsx
│   │   │   │   └── project-carousel-card.tsx
│   │   │   ├── satisfaction-stat-card
│   │   │   │   ├── index.ts
│   │   │   │   └── satisfaction-stat-card.tsx
│   │   │   ├── service-card
│   │   │   │   ├── index.ts
│   │   │   │   └── service-card.tsx
│   │   │   ├── status-badge
│   │   │   │   ├── index.ts
│   │   │   │   └── status-badge.tsx
│   │   │   ├── tenant-status-badge
│   │   │   │   ├── index.ts
│   │   │   │   └── tenant-status-badge.tsx
│   │   │   └── testimonial-card
│   │   │       ├── index.ts
│   │   │       └── testimonial-card.tsx
│   │   ├── organisms
│   │   │   ├── admin-delete-tenant-form
│   │   │   │   ├── admin-delete-tenant-form.tsx
│   │   │   │   └── index.ts
│   │   │   ├── admin-effective-features
│   │   │   │   ├── admin-effective-features.tsx
│   │   │   │   └── index.ts
│   │   │   ├── admin-feature-overrides-editor
│   │   │   │   ├── admin-feature-overrides-editor.tsx
│   │   │   │   └── index.ts
│   │   │   ├── admin-login-form
│   │   │   │   ├── admin-login-form.tsx
│   │   │   │   └── index.ts
│   │   │   ├── admin-onboarding-link-form
│   │   │   │   ├── admin-onboarding-link-form.tsx
│   │   │   │   └── index.ts
│   │   │   ├── admin-onboarding-summary
│   │   │   │   ├── admin-onboarding-summary.tsx
│   │   │   │   └── index.ts
│   │   │   ├── admin-sync-tenant-form
│   │   │   │   ├── admin-sync-tenant-form.tsx
│   │   │   │   └── index.ts
│   │   │   ├── admin-tenant-form
│   │   │   │   ├── admin-tenant-form.tsx
│   │   │   │   └── index.ts
│   │   │   ├── admin-tenant-header
│   │   │   │   ├── admin-tenant-header.tsx
│   │   │   │   └── index.ts
│   │   │   ├── admin-tenants-table
│   │   │   │   ├── admin-tenants-table.tsx
│   │   │   │   └── index.ts
│   │   │   ├── atoms-preview
│   │   │   ├── contact-hero
│   │   │   │   ├── contact-hero.tsx
│   │   │   │   └── index.ts
│   │   │   ├── cta-banner
│   │   │   │   ├── cta-banner.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hero-section
│   │   │   │   ├── hero-section.tsx
│   │   │   │   └── index.ts
│   │   │   ├── innovation-section
│   │   │   │   ├── index.ts
│   │   │   │   └── innovation-section.tsx
│   │   │   ├── inquiry-section
│   │   │   │   ├── index.ts
│   │   │   │   └── inquiry-section.tsx
│   │   │   ├── onboarding-form
│   │   │   │   ├── index.ts
│   │   │   │   └── onboarding-form.tsx
│   │   │   ├── page-hero
│   │   │   │   ├── index.ts
│   │   │   │   └── page-hero.tsx
│   │   │   ├── payment-section
│   │   │   │   ├── index.ts
│   │   │   │   ├── payment-section.tsx
│   │   │   │   └── payment-success-banner.tsx
│   │   │   ├── portfolio-featured
│   │   │   │   ├── index.ts
│   │   │   │   └── portfolio-featured.tsx
│   │   │   ├── provision-tenant-form
│   │   │   │   ├── index.ts
│   │   │   │   └── provision-tenant-form.tsx
│   │   │   ├── services-bento-grid
│   │   │   │   ├── index.ts
│   │   │   │   └── services-bento-grid.tsx
│   │   │   ├── services-overview
│   │   │   │   ├── index.ts
│   │   │   │   └── services-overview.tsx
│   │   │   ├── services-preview
│   │   │   │   ├── index.ts
│   │   │   │   └── services-preview.tsx
│   │   │   ├── site-footer
│   │   │   │   ├── index.ts
│   │   │   │   └── site-footer.tsx
│   │   │   ├── site-header
│   │   │   │   ├── index.ts
│   │   │   │   └── site-header.tsx
│   │   │   ├── social-proof-grid
│   │   │   │   ├── index.ts
│   │   │   │   └── social-proof-grid.tsx
│   │   │   ├── success-story-section
│   │   │   │   ├── index.ts
│   │   │   │   └── success-story-section.tsx
│   │   │   └── testimonials-section
│   │   │       ├── index.ts
│   │   │       └── testimonials-section.tsx
│   │   └── templates
│   │       └── marketing-layout
│   │           ├── index.ts
│   │           ├── marketing-container.tsx
│   │           └── marketing-layout.tsx
│   ├── core
│   │   └── logic
│   │      ├── admin-auth.ts
│   │      ├── feature-keys.ts
│   │      ├── password.ts
│   │      ├── session-token.ts
│   │      ├── tenant-provisioning.ts
│   │      ├── tenant-sync.ts
│   │      └── tenants.ts
│   ├── generated
│   │   └── prisma           # Prisma-generated client (gitignored), custom output path
│   └── lib
│       ├── constants
│       │   └── navigation.ts
│       ├── content
│       │   ├── contact.ts
│       │   ├── home.ts
│       │   ├── projects.ts
│       │   └── services.ts
│       ├── pdf
│       │   └── invoice-document.tsx
│       ├── prisma.ts
│       ├── seo
│       │   ├── metadata.ts
│       │   ├── page-seo.ts
│       │   ├── projects-seo.ts
│       │   ├── schema.ts
│       │   └── site-config.ts
│       ├── uploads.ts
│       └── utils
│           └── cn.ts
├── tsconfig.json
└── tsconfig.tsbuildinfo
```
Every time you add or delete a file, update the claude.md file to have the latest code folder structure