#!/usr/bin/env bash
# One-command setup: install → migrate → seed → verify → build → push.
#
#   bash setup.sh https://github.com/<you>/<repo>.git
#
# Requires: Node 20.9+, a .env file with DATABASE_URL, DIRECT_URL and AUTH_SECRET.
set -euo pipefail

REPO_URL="${1:-}"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✖ Created .env from .env.example — fill in DATABASE_URL, DIRECT_URL and AUTH_SECRET, then run this again."
  echo "  Generate AUTH_SECRET with:  openssl rand -base64 32"
  exit 1
fi

set -a; . ./.env; set +a
for v in DATABASE_URL DIRECT_URL AUTH_SECRET; do
  if [ -z "${!v:-}" ]; then echo "✖ $v is empty in .env"; exit 1; fi
done

echo "▶ Installing dependencies…";            npm install
if [ -d prisma/migrations ]; then
  echo "▶ Applying migrations…";              npx prisma migrate deploy
else
  echo "▶ Creating initial migration…";       npx prisma migrate dev --name init
fi
echo "▶ Seeding initial content…";            npm run db:seed
echo "▶ Type-checking…";                      npm run typecheck
echo "▶ Linting…";                            npm run lint
echo "▶ Running tests…";                      npm test
echo "▶ Production build…";                   npm run build

if [ -n "$REPO_URL" ]; then
  echo "▶ Pushing to $REPO_URL…"
  [ -d .git ] || git init -b main
  git add -A
  git commit -m "Ganesh Nursery macadamia website: Next.js app, admin, Prisma schema & migration" || true
  git remote remove origin 2>/dev/null || true
  git remote add origin "$REPO_URL"
  git push -u origin main
fi

echo
echo "✔ Done. Next steps:"
echo "  1. Create your admin login:   npm run admin:create"
echo "  2. Start locally:              npm run dev   →  http://localhost:3000  (admin: /admin)"
echo "  3. Deploy: import the repo in Vercel and add the same environment variables."
