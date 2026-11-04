# Testing report

**Honest status:** this project was written in a workspace that could not reach the npm registry, so `npm install`, `next build`, ESLint, Prisma and the browser could **not** be run there. Everything below marked ✅ was actually executed; everything marked ⏳ must be run on your machine (`bash setup.sh` runs the automated parts).

## Executed during development

| Check | Result |
|---|---|
| Syntax + module resolution of all 115 source files (esbuild bundle of every page, component, action, seed and script) | ✅ 0 errors |
| TypeScript strict check against the real `zod` / `clsx` / `tailwind-merge` / `@types/node` typings, with Next/React/Prisma stubbed | ✅ 1 real error found and fixed (`ActionState.errors` typing). Remaining messages were caused only by the stubs (e.g. `redirect()` not typed as `never`). |
| Unused-code scan (`--noUnusedLocals`) | ✅ nothing unused (flags were type-only imports the stubs can't resolve) |
| Client/server boundary scan — no `"use client"` file imports database, auth, upload, email or other server-only modules | ✅ clean |
| Unit tests — `tests/*.test.ts` (19 tests) | ✅ 19 / 19 passed |
| Image pipeline — uploaded photos cropped from banner collages and converted to optimised WebP (23–219 KB each) + 1200×630 OG image | ✅ visually checked |

### What the unit tests cover
- Indian mobile validation and normalisation (`98765 43210`, `+91…`, `0…` accepted; landlines, short and foreign numbers rejected)
- Enquiry form: required fields, invalid email, non-numeric/zero plant counts, unknown enquiry types, honeypot
- Product schema: blank → hidden specs, checkbox parsing, fixed price requires a price, slug format
- Settings schema: WhatsApp number normalised to digits, non-HTTPS social links rejected
- CSV export: formula-injection neutralised (`=`, `+`, `-`, `@`, tab), quoting, UTF-8 BOM
- Upload sniffing: JPG/PNG/WebP detected by magic bytes; SVG and PHP payloads rejected
- Enquiry filters ignore malicious/invalid status, type and date values
- Prices shown only when fixed **and** enabled on the product **and** enabled site-wide
- Unverified (blank) product specifications are never displayed
- Stored settings merge over defaults; wrong types fall back to defaults

## To run on your machine (automated by `setup.sh`)

| Check | Command |
|---|---|
| ⏳ Install | `npm install` |
| ⏳ Prisma schema validation + first migration | `npx prisma migrate dev --name init` |
| ⏳ Seed | `npm run db:seed` |
| ⏳ Full TypeScript check with real Next/React/Prisma types | `npm run typecheck` |
| ⏳ ESLint (next/core-web-vitals + typescript) | `npm run lint` |
| ⏳ Unit tests | `npm test` |
| ⏳ Production build | `npm run build` |

If any of these report an error, send me the output and I'll send back a changes-only fix.

## Manual QA checklist (⏳ after `npm run dev`)

**A. Homepage** — header turns into a floating pill on scroll and hides when scrolling down · active nav pill slides between links · mobile menu opens with circular reveal and staggered links · hero headline words rise in, photo stack follows the mouse · both hero CTAs work · WhatsApp button opens the 4-topic menu · every section animates in once · desktop gallery pins and scrolls sideways; mobile swipes.

**B. Products** — listing filters animate · card tilt + image zoom on hover · detail page gallery zoom and thumbnails · blank specs don't appear · price hidden unless enabled in both places · product enquiry saves with the product linked.

**C. Forms** — submit empty → inline errors · bad email / phone → errors · fill hidden `website` field via devtools → fake success, nothing saved · submit within 3 s of load → asked to retry · 6th enquiry within an hour from one IP → blocked · success screen shows reference · row appears in Admin → Enquiries · emails arrive when Resend is configured.

**D. Admin** — `/admin` redirects to login when signed out · wrong password ×5 → locked 15 min · Editor cannot open Settings / Users / Audit log or delete products · CRUD for products (incl. image upload, alt text, remove), enquiries (status, follow-up, notes, delete), blog (draft/publish, cover), gallery, FAQ (reorder), services, testimonials (publish requires genuine confirmation), settings, users · sign out / “sign out sessions” invalidates other devices.

**E. SEO** — view source on each page: unique `<title>`, description, canonical, OG/Twitter tags · `/sitemap.xml` lists pages, products and posts · `/robots.txt` disallows `/admin` · validate JSON-LD (LocalBusiness, Breadcrumb, Article, FAQPage, Product without invented offers) with Google's Rich Results Test.

**F. Security** — `curl /api/admin/enquiries/export` without a cookie → 401 · upload an `.svg` or renamed `.php` → rejected · exported CSV opened in Excel shows `'=…` as text · response headers include HSTS, `X-Frame-Options`, `nosniff`.

**G. Performance & responsive** — Lighthouse (mobile) on Home, Plants and Guide · check 360 px, 768 px, 1280 px widths for horizontal overflow · turn on OS “reduce motion” and confirm animations are minimised.
