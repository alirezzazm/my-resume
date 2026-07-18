# Deploy script for Windows Server (nginx + pm2)
# Usage: powershell -ExecutionPolicy Bypass -File deploy.ps1
#
# فرض می‌کند:
#   - Node.js و pm2 نصب هستند (npm install -g pm2)
#   - nginx روی این ماشین نصب شده (reverse proxy را باید جدا کانفیگ کنید)
#   - فایل .env کنار پروژه وجود دارد (از .env.example بسازید)
#
# دیتابیس SQLite (prisma/data/portfolio.db) داخل خود ریپو commit شده،
# پس بعد از clone دیگر نیازی به db:push یا db:seed نیست — دیتای واقعی همراه کد می‌آید.

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
Set-Location $ProjectRoot

Write-Output "Pulling latest changes..."
git pull

if (-not (Test-Path "$ProjectRoot\.env")) {
    Write-Output ".env not found — copying from .env.example. Edit it before continuing!"
    Copy-Item "$ProjectRoot\.env.example" "$ProjectRoot\.env"
    exit 1
}

Write-Output "Installing dependencies..."
npm install

Write-Output "Applying Prisma schema..."
npm run db:push

Write-Output "Building production bundle..."
npm run build

Write-Output "Refreshing standalone output (public/static assets + .env)..."
$Standalone = "$ProjectRoot\.next\standalone"
Remove-Item -Recurse -Force "$Standalone\.next\static", "$Standalone\public" -ErrorAction SilentlyContinue
Copy-Item -Recurse "$ProjectRoot\public" "$Standalone\"
Copy-Item -Recurse "$ProjectRoot\.next\static" "$Standalone\.next\"
Copy-Item "$ProjectRoot\.env" "$Standalone\.env"

Write-Output "Starting/restarting with pm2..."
$exists = pm2 describe my-resume 2>$null
if ($LASTEXITCODE -eq 0) {
    pm2 restart my-resume
} else {
    pm2 start "$Standalone\server.js" --name my-resume --cwd $Standalone --env PORT=3000
}
pm2 save

Write-Output "Done. App running on port 3000 (proxy it with nginx/IIS as needed)."
