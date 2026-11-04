# One-command setup for Windows PowerShell:
#   powershell -ExecutionPolicy Bypass -File .\setup.ps1 https://github.com/<you>/<repo>.git
param([string]$RepoUrl = "")
$ErrorActionPreference = "Continue"

function Step($msg, [scriptblock]$cmd) {
  Write-Host "`n> $msg" -ForegroundColor Green
  & $cmd
  if ($LASTEXITCODE -and $LASTEXITCODE -ne 0) { Write-Host "x Failed: $msg" -ForegroundColor Red; exit $LASTEXITCODE }
}

# Apply the update package if it's sitting next to the project folder
$update = Join-Path (Split-Path $PWD -Parent) "ganesh-macadamia-update-01.zip"
if (Test-Path $update) {
  Write-Host "> Applying $update" -ForegroundColor Green
  Expand-Archive -Path $update -DestinationPath . -Force
}
Remove-Item "src\components\layout\footer-wordmark.tsx" -ErrorAction SilentlyContinue

# .env
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  $b = New-Object byte[] 32
  [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
  $secret = [Convert]::ToBase64String($b)
  (Get-Content ".env") -replace '^AUTH_SECRET=.*', "AUTH_SECRET=`"$secret`"" | Set-Content ".env"
  Write-Host "`nCreated .env with a random AUTH_SECRET." -ForegroundColor Yellow
  Write-Host "Now paste your Neon DATABASE_URL and DIRECT_URL into .env, save, and run this script again." -ForegroundColor Yellow
  notepad .env
  exit 1
}
$envText = Get-Content ".env" -Raw
foreach ($v in "DATABASE_URL", "DIRECT_URL", "AUTH_SECRET") {
  if ($envText -notmatch "(?m)^$v=`"?[^`"\s]+") { Write-Host "x $v is empty in .env" -ForegroundColor Red; exit 1 }
}

Step "Installing dependencies" { npm install }
if (Test-Path "prisma\migrations") { Step "Applying migrations" { npx prisma migrate deploy } }
else { Step "Creating initial migration" { npx prisma migrate dev --name init } }
Step "Seeding content" { npm run db:seed }
Step "Type-checking" { npm run typecheck }
Step "Linting" { npm run lint }
Step "Running tests" { npm test }
Step "Production build" { npm run build }

if ($RepoUrl) {
  if (-not (Test-Path ".git")) { git init -b main }
  git add -A
  git commit -m "Ganesh Nursery macadamia website"
  git remote remove origin
  git remote add origin $RepoUrl
  Step "Pushing to GitHub" { git push -u origin main }
}

Write-Host "`nDone. Next:" -ForegroundColor Green
Write-Host "  npm run admin:create   (create your admin login)"
Write-Host "  npm run dev            (http://localhost:3000, admin at /admin)"
