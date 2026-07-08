# Klikktek Website

Marketing site and internal control-plane for [Klikktek](https://klikktek.com) — a Next.js app that serves the public website (services, portfolio, contact, payments) and a super-admin portal for managing multi-tenant SaaS customers on the separate [retail-software](https://github.com/klikktek/retail-software) platform.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling:** Tailwind CSS v4 with a Material Design 3–inspired token system in `src/app/globals.css`
- **Database:** PostgreSQL + Prisma 7 (driver adapter, client generated to `src/generated/prisma`)
- **Payments:** Stripe (PaymentIntents + webhooks)
- **Email:** Resend
- **PDF:** `@react-pdf/renderer` (invoice generator)



## Getting started



### Prerequisites

- Node.js 20+
- PostgreSQL (local or hosted)
- Stripe and Resend accounts (for payment and email features)



### Install

```bash
npm install
```



### Environment variables

Create `.env.local` in the project root:

```bash
# Database (control-plane — separate from any tenant DB)
DATABASE_URL="postgresql://user:password@localhost:5432/klikktek_control"

# Super admin seed + login
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="your-secure-password"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend (contact forms + payment emails)
RESEND_API_KEY="re_..."

# Internal invoice tool (/kt-invoice)
INVOICE_SECRET="..."
NEXT_PUBLIC_INVOICE_SECRET="..."
```

Marketing pages work without Stripe/Resend configured. The admin portal requires `DATABASE_URL` and the seed credentials.

### Database setup

```bash
npx prisma migrate dev    # apply migrations
npm run db:seed           # create super admin user + sample tenant row
```



### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin portal: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Scripts


| Command                                | Description                      |
| -------------------------------------- | -------------------------------- |
| `npm run dev`                          | Start development server         |
| `npm run build`                        | Production build                 |
| `npm run start`                        | Serve production build           |
| `npm run lint`                         | Run ESLint                       |
| `npm run db:seed`                      | Seed super admin + sample tenant |
| `npx tsc --noEmit`                     | Type-check (strict mode)         |
| `npx prisma migrate dev --name <name>` | Create and apply a migration     |
| `npx prisma studio`                    | Open Prisma Studio               |


There is no test suite configured in this repo.

## What's in the app



### Public marketing site


| Route       | Description                                 |
| ----------- | ------------------------------------------- |
| `/`         | Home                                        |
| `/services` | Services overview                           |
| `/projects` | Portfolio / case studies                    |
| `/contact`  | Inquiry form, social proof, Stripe payments |


Content lives in `src/lib/content/`. SEO metadata is in `src/lib/seo/` and applied per route via `createPageMetadata()`.

### Internal tools


| Route         | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| `/kt-invoice` | PDF invoice generator (bearer-token protected; treat as internal/unlisted) |
| `/admin`      | Super-admin dashboard — tenant registry and feature sync                   |




### API routes


| Endpoint                          | Purpose                                                        |
| --------------------------------- | -------------------------------------------------------------- |
| `POST /api/inquiry`               | Contact form — team notification + visitor confirmation emails |
| `POST /api/cta-contact`           | CTA banner form submissions                                    |
| `POST /api/create-payment-intent` | Stripe PaymentIntent creation                                  |
| `POST /api/webhook`               | Stripe webhook — payment confirmation emails                   |
| `POST /api/generate-invoice`      | PDF invoice generation (requires `INVOICE_SECRET`)             |




## Super admin portal (`/admin`)

Internal control-plane for the retail-software multi-tenant SaaS (silo model: one Postgres database per tenant). This app is a **registry + remote control** that also provisions new tenant databases locally.

- **Auth:** Email/password login with hashed-token sessions (`admin_session` cookie)
- **Provision:** `/admin/tenants/new` creates a Postgres DB, runs retail-software migrations, seeds first admin login (`TENANT_DB_ADMIN_URL`, `RETAIL_SOFTWARE_REPO_PATH`)
- **Tenants:** Edit registry (name, slug, status, plan, feature overrides, database URL)
- **Sync:** Push `planId` and `featureOverrides` to a tenant's `StoreSettings` table via direct Postgres connection
- **Delete:** Danger zone on tenant detail — type tenant name to confirm; drops `retail_tenant_{slug}` DB when provisioned by this app, otherwise registry-only (manual DB cleanup)

`FEATURE_KEYS` and `PLAN_IDS` in `src/core/logic/feature-keys.ts` are manually kept in sync with retail-software's `core/logic/features.ts`.

## Project structure

```
src/
├── app/                  # Next.js routes (marketing, admin, API)
├── components/
│   ├── atoms/            # Buttons, inputs, badges…
│   ├── molecules/        # Composed UI (form fields, cards…)
│   ├── organisms/        # Feature sections (hero, payment, admin forms…)
│   └── templates/        # Page layouts (marketing-layout)
├── core/logic/           # Admin auth, tenants, tenant sync, feature keys
├── generated/prisma/     # Prisma client (generated, gitignored)
└── lib/
    ├── content/          # Static page copy
    ├── seo/              # Metadata, schema.org JSON-LD
    ├── pdf/              # Invoice document template
    └── utils/            # Shared utilities (cn)
```

Components follow [Atomic Design](https://atomicdesign.bradfrost.com/) with strict import rules between layers. See `.cursor/rules/code-organization.mdc`.

## Design system

Design tokens (colors, spacing, typography, radii) are defined as CSS custom properties in `src/app/globals.css` and exposed to Tailwind via `@theme inline`. Prefer project utilities like `text-headline-md`, `rounded-card`, `px-md`, and `shadow-overlay` over ad-hoc Tailwind values.

**Note:** Custom `--spacing-`* tokens (e.g. `--spacing-sm: 8px`) are for padding and gaps. Layout max-widths (`max-w-sm`, `max-w-lg`, etc.) use separate `--max-width-*` tokens to avoid Tailwind v4 resolving them to spacing pixel values.

Fonts: Geist (display), Inter (body), JetBrains Mono (labels).

## Adding a new public route

1. Add page copy in `src/lib/content/`
2. Add SEO entry in `src/lib/seo/page-seo.ts`
3. Export `metadata` via `createPageMetadata()`
4. Add the route to `publicRoutes` in `src/lib/seo/site-config.ts` (for sitemap)

