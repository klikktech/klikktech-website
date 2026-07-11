# Klikktek Website

Marketing site and internal control-plane for [Klikktek](https://klikktek.com). The public experience is a **single scrolling homepage** with anchored sections; the private side hosts a super-admin portal for managing multi-tenant SaaS customers on the separate [retail-software](https://github.com/klikktek/retail-software) platform.

## What you get

### Public marketing site (`/`)

One page, six sections — all navigation uses hash anchors:

| Anchor | Section |
| ------ | ------- |
| `/#services` | Capabilities / service offering cards |
| `/#how-it-works` | Process timeline |
| `/#projects` | Portfolio carousel |
| `/#reviews` | Client testimonials |
| `/#contact` | Book-a-call calendar + contact form |

Legacy routes redirect to the matching anchor:

| Route | Redirect |
| ----- | -------- |
| `/services` | `/#services` |
| `/projects` | `/#projects` |
| `/contact` | `/#contact` |

**Book a call flow:** visitors pick a weekday slot (Pacific time), submit name/email/phone, and both the team and visitor receive confirmation emails via Resend (`POST /api/book-call`).

### Internal tools

| Route | Description |
| ----- | ----------- |
| `/admin` | Super-admin dashboard — tenant registry, feature sync, onboarding links |
| `/kt-invoice` | PDF invoice generator (bearer-token protected; internal/unlisted) |
| `/onboarding/[token]` | One-time tenant store setup form (magic link) |

## Tech stack

| Layer | Choice |
| ----- | ------ |
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 + MD3-inspired design tokens in `src/app/globals.css` |
| Database | PostgreSQL + Prisma 7 (driver adapter → `src/generated/prisma`) |
| Email | Resend (book-a-call confirmations) |
| PDF | `@react-pdf/renderer` (invoice generator) |
| Storage | Vercel Blob (tenant onboarding logos) |

Components follow [Atomic Design](https://atomicdesign.bradfrost.com/) with strict import rules between layers — see `.cursor/rules/code-organization.mdc`.

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL (local or hosted) — required for `/admin`
- Resend account — optional for marketing; required for live booking emails

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin portal: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (not linked from the public site).

### Environment variables

Create `.env.local` in the project root:

```bash
# Database (control-plane — separate from any tenant DB)
DATABASE_URL="postgresql://user:password@localhost:5432/klikktek_control"

# Super admin seed + login
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="your-secure-password"

# Resend (book-a-call emails)
RESEND_API_KEY="re_..."

# Canonical site URL (sitemap, OG, upload base)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Vercel Blob (tenant onboarding logo uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Internal invoice tool (/kt-invoice)
INVOICE_SECRET="..."
NEXT_PUBLIC_INVOICE_SECRET="..."

# Optional — local tenant auto-provisioning only
TENANT_DB_ADMIN_URL="postgresql://user:password@localhost:5432/postgres"
RETAIL_SOFTWARE_REPO_PATH="/path/to/retail-software"
```

Marketing pages work without Resend configured (booking API will fail gracefully). The admin portal requires `DATABASE_URL` and seed credentials.

### Database setup

```bash
npx prisma migrate dev    # apply migrations
npm run db:seed           # create super admin user + sample tenant row
```

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Seed super admin + sample tenant |
| `npx tsc --noEmit` | Type-check (strict mode) |
| `npx prisma migrate dev --name <name>` | Create and apply a migration |
| `npx prisma studio` | Open Prisma Studio |

There is no test suite configured in this repo.

## API routes

| Endpoint | Purpose |
| -------- | ------- |
| `POST /api/book-call` | Discovery-call booking — team + visitor confirmation emails |
| `POST /api/generate-invoice` | PDF invoice generation (requires `INVOICE_SECRET`) |

## Project structure

```
src/
├── app/                    # Next.js routes (marketing, admin, API, onboarding)
├── components/
│   ├── atoms/              # Buttons, inputs, badges, icons…
│   ├── molecules/          # Composed UI (nav links, form fields, cards…)
│   ├── organisms/          # Feature sections (hero, book-call, admin forms…)
│   └── templates/          # Page layouts (marketing-layout, admin-layout)
├── core/logic/             # Admin auth, tenants, tenant sync, provisioning
├── generated/prisma/       # Prisma client (generated, gitignored)
└── lib/
    ├── booking/            # Calendar slot availability
    ├── content/            # Static page copy (home.ts, contact.ts)
    ├── constants/          # Nav links, site config
    ├── seo/                # Metadata, schema.org JSON-LD
    ├── pdf/                # Invoice document template
    └── utils/              # cn(), scroll-to-hash
```

## Content & SEO

- **Copy:** `src/lib/content/home.ts` (homepage sections), `src/lib/content/contact.ts` (book-a-call form labels)
- **SEO:** `src/lib/seo/page-seo.ts` + `createPageMetadata()` in each route
- **Schema:** JSON-LD via `<JsonLd />` (`src/components/atoms/json-ld`)
- **Sitemap:** `publicRoutes` in `src/lib/seo/site-config.ts` (currently just `/`)

To add a new public route: add copy → add SEO entry → export `metadata` → register in `publicRoutes`.

## Design system

Design tokens (colors, spacing, typography, radii) live as CSS custom properties in `src/app/globals.css` and are exposed to Tailwind via `@theme inline`.

**Palette:** black primary, Klikktek blue accents (`#7073ff`, `#d0e1fb`).

**Fonts:** Lora (display/headlines), Inter (body), JetBrains Mono (labels).

**Theme:** light/dark toggle via `ThemeToggle` (`src/components/molecules/theme-toggle`); preference stored in `localStorage` (`klikktek-theme`) with system-preference fallback. Dark tokens live under `.dark` on `<html>` in `globals.css`; an inline init script in `layout.tsx` applies the class before paint.

Prefer project utilities (`text-headline-md`, `rounded-card`, `px-md`, `shadow-overlay`) over ad-hoc Tailwind values.

> **Note:** Custom `--spacing-*` tokens are for padding/gaps. Layout max-widths use separate `--max-width-*` tokens so Tailwind v4 does not resolve them as spacing pixel values.

## Super admin portal (`/admin`)

Internal control-plane for the retail-software multi-tenant SaaS (silo model: one Postgres database per tenant).

- **Auth:** Email/password login with hashed-token sessions (`admin_session` cookie)
- **Provision:** `/admin/tenants/new` creates a Postgres DB, runs retail-software migrations, seeds first admin login (when `TENANT_DB_ADMIN_URL` + `RETAIL_SOFTWARE_REPO_PATH` are set)
- **Tenants:** Edit registry (name, slug, status, plan, feature overrides, database URL)
- **Sync:** Push `planId` and `featureOverrides` to a tenant's `StoreSettings` table
- **Onboarding:** Generate one-time magic links for tenant store setup
- **Delete:** Danger zone — type tenant name to confirm; drops `retail_tenant_{slug}` DB when auto-provisioned

`FEATURE_KEYS` and `PLAN_IDS` in `src/core/logic/feature-keys.ts` are manually kept in sync with retail-software's `core/logic/features.ts`.

## Further reading

See [`CLAUDE.md`](./CLAUDE.md) for detailed architecture notes, env var semantics, and provisioning behavior.
