# Ganesh Nursery — Macadamia Website

Premium, animated, SEO-ready website and admin dashboard for **Ganesh Nursery – Macadamia Nut Plants and Plantation Solutions** (Thanjavur, Tamil Nadu).

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion (Framer Motion) · Prisma 6 · PostgreSQL (Neon) · Zod · React Hook Form · Resend (email, optional) · Cloudinary (image uploads)

---

## Quick start (one command)

```bash
cp .env.example .env        # then fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET
bash setup.sh https://github.com/<you>/<repo>.git
npm run admin:create        # create your administrator login (password typed privately)
npm run dev                 # http://localhost:3000   ·   admin: http://localhost:3000/admin
```

`setup.sh` installs dependencies, creates and applies the first Prisma migration, seeds the initial content, runs the type-check, lint, tests and a production build, then commits and pushes to the repo URL you pass (omit the URL to skip pushing).

**Windows (PowerShell) without Git Bash:** run the same steps manually:

```powershell
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run typecheck; npm run lint; npm test; npm run build
npm run admin:create
```

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon **pooled** connection string (`…-pooler…?sslmode=require`) |
| `DIRECT_URL` | ✅ | Neon **direct** connection string (used by migrations) |
| `AUTH_SECRET` | ✅ | ≥ 32 random characters — `openssl rand -base64 32` |
| `ADMIN_EMAIL` | – | Default email for `npm run admin:create` |
| `NEXT_PUBLIC_SITE_URL` | ✅ in prod | Canonical URL, e.g. `https://ganeshnursery.co.in` (used for SEO, sitemap, OG) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | – | Default WhatsApp number (digits with country code). Editable in admin. |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | ✅ on Vercel | Image uploads (Vercel's filesystem is read-only). Locally, uploads fall back to `public/uploads`. |
| `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_EMAIL` | – | Enquiry notification + customer confirmation emails. Without them, enquiries are still saved. |

No secrets are hard-coded and nothing secret is exposed to the browser (only `NEXT_PUBLIC_*` values are public).

---

## Database (Neon PostgreSQL + Prisma)

1. Create a Neon project → copy the **pooled** and **direct** connection strings into `.env`.
2. First time: `npx prisma migrate dev --name init` (creates `prisma/migrations/…` — commit it).
3. Production / Vercel: `npx prisma migrate deploy`.
4. Seed initial content: `npm run db:seed` (idempotent; creates articles, FAQs, services, gallery and a general product listing — **no admin users and no customer data**).
5. Browse data: `npm run db:studio`.

Models: `AdminUser`, `LoginAttempt`, `AuditLog`, `Product`, `ProductImage`, `Service`, `Enquiry`, `EnquiryNote`, `BlogCategory`, `BlogPost`, `GalleryImage`, `Faq`, `Testimonial`, `WebsiteSetting`.

---

## Deploying to Vercel

1. Push the repo to GitHub (`setup.sh` does this).
2. Vercel → **Add New Project** → import the repo (framework: Next.js; build command stays `npm run build`).
3. Add every variable from the table above (Production + Preview).
4. Deploy. After the first deploy, run migrations against production once from your machine:
   `npx prisma migrate deploy` (with the production `DATABASE_URL`/`DIRECT_URL` in `.env`).
5. Create the admin account against production: `npm run admin:create`.
6. Point your domain (GoDaddy DNS) at Vercel: add the domain in Vercel → Domains and follow the DNS records it shows.

---

## Project structure

```
src/
  app/
    (website)/          public pages: home, about, macadamia-plants, why-macadamia, cultivation-guide,
                        plantation-services, gallery, blog, faq, contact, privacy-policy, terms
    admin/              login + (panel): overview, enquiries, products, blog, gallery, faqs,
                        services, testimonials, settings, users, audit-log, account
    api/admin/enquiries/export   CSV export (auth-protected)
    sitemap.ts, robots.ts, not-found.tsx, icon.svg
  actions/              server actions (public enquiry, auth, admin CRUD)
  components/
    motion/             animation primitives: Reveal, Stagger, SplitText, Counter, Parallax,
                        ImageReveal, Magnetic, TiltCard, Marquee, ScrollProgress, decor
    layout/ home/ products/ forms/ blog/ gallery/ faq/ content/ admin/ ui/ seo/
  config/site.ts        default business details (overridable in Admin → Settings)
  content/macadamia.ts  cultivation guide & Why Macadamia content + references
  lib/                  db, auth, validations, seo, email, upload, csv, rate-limit, …
prisma/                 schema.prisma, seed.ts, seed-content/posts.ts
scripts/create-admin.ts
tests/                  node:test unit tests (validation, CSV safety, upload sniffing, pricing rules…)
```

---

## Animation

Every page uses the shared motion primitives: word-by-word headline reveals, scroll-triggered fade/rise and staggered grids, curtain image reveals, parallax and Ken Burns backgrounds, a pointer-parallax photo stack in the hero, magnetic CTAs, 3D tilt product cards, an animated growing-sapling illustration, counters, a keyword marquee, a scroll-pinned horizontal gallery on desktop, a timeline that fills as you scroll, stacked sticky service cards, animated FAQ accordions, a filterable masonry gallery with shared-element lightbox, a scroll-spy table of contents, animated diagrams in the cultivation guide, a reading-progress ring on articles, and a scroll progress bar.

All animation respects the visitor's **“reduce motion”** OS setting (`MotionConfig reducedMotion="user"` + CSS media query).

Styling lives in Tailwind classes and `globals.css`. The only inline `style` values are runtime-computed animation values (Motion) and data-driven diagram positions, which can't be expressed as static classes.

---

## Admin dashboard (`/admin`)

- **Roles:** Administrator (everything) and Editor (products, enquiries, blog, gallery, FAQ, services, testimonials; cannot delete key records, change settings or manage users).
- **Enquiries:** search, filter by status / type / date, status workflow (New → Contacted → Interested → Quotation Sent → Converted → Closed), follow-up dates, internal notes, one-click call / WhatsApp / email, CSV export (formula-injection safe).
- **Products:** full CRUD, multiple images with alt text and order, pricing modes (fixed / on request / quotation), hide prices, stock, availability, featured, SEO fields. Unverified specs are simply left blank and are never shown.
- **Blog:** Markdown editor, categories, draft/publish, featured image, SEO fields.
- **Gallery:** multi-upload, categories, captions, ordering, **“genuine company photo” vs “illustrative”** flag (shown publicly).
- **FAQ / Services / Testimonials:** CRUD + publish; services have a separate **“confirmed available”** switch; testimonials require a “genuine testimonial” confirmation before publishing.
- **Settings:** business name, logo, hero image, phones, WhatsApp, email, addresses, hours, social links, SEO defaults, show-prices and show-process switches.
- **Users & audit log:** create users, deactivate, sign out all sessions; every admin action is logged.

## Security summary

bcrypt (cost 12) password hashing · signed HTTP-only `SameSite=Lax` session cookie (8 h) re-validated against the database on every request · session revocation via `sessionVersion` · server-side role checks in every action, page and route (no middleware-only auth) · DB-backed login rate limiting (5 fails / email / 15 min, 20 / IP) · enquiry rate limiting, honeypot and minimum fill-time · Zod validation on every input · Prisma parameterised queries · magic-byte image validation (JPG/PNG/WebP/AVIF only, ≤ 5 MB; SVG rejected) · CSV formula-injection protection · IP addresses stored only as salted hashes · security headers (HSTS, nosniff, frame options, referrer, permissions) · `noindex` on admin · JSON-LD output escaped · Next.js Server Actions' built-in origin check for CSRF.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` + production build |
| `npm run typecheck` / `npm run lint` / `npm test` | Quality checks |
| `npm run db:migrate` / `db:deploy` / `db:seed` / `db:studio` | Database |
| `npm run admin:create` | Create or reset an administrator |

See **TESTING.md** for the test report and **BUSINESS-CONFIRMATION.md** for details Ganesh Nursery still needs to confirm.
