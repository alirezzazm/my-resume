# Deploy script for Windows Server (nginx + pm2)
# Usage: powershell -ExecutionPolicy Bypass -File deploy.ps1
#
# فرض می‌کند:
#   - Node.js و pm2 نصب هستند (npm install -g pm2)
#   - nginx روی این ماشین نصب شده (reverse proxy را باید جدا کانفیگ کنید)
#
# دیتابیس SQLite (prisma/data/portfolio.db) داخل خود ریپو commit شده،
# پس بعد از clone دیتای واقعی همراه کد می‌آید (بدون نیاز به db:seed).

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
Set-Location $ProjectRoot

Write-Output "Pulling latest changes..."
git pull

# --- .env (auto-created; DATABASE_URL forced to an absolute path so the ---
# --- Next.js standalone server — which runs from .next\standalone — can  ---
# --- always find the SQLite file instead of silently falling back to     ---
# --- static placeholder data.                                            ---
$DbPath = (Join-Path $ProjectRoot "prisma\data\portfolio.db") -replace '\\', '/'
if (-not (Test-Path "$ProjectRoot\.env")) {
    Write-Output ".env not found — creating from .env.example..."
    Copy-Item "$ProjectRoot\.env.example" "$ProjectRoot\.env"
}
$envLines = Get-Content "$ProjectRoot\.env"
if ($envLines -match '^\s*DATABASE_URL=') {
    $envLines = $envLines -replace '^\s*DATABASE_URL=.*', "DATABASE_URL=`"file:$DbPath`""
} else {
    $envLines += "DATABASE_URL=`"file:$DbPath`""
}
$envLines | Set-Content "$ProjectRoot\.env" -Encoding UTF8
Write-Output "DATABASE_URL -> file:$DbPath"

Write-Output "Installing dependencies..."
npm install

Write-Output "Applying Prisma schema (safe; keeps existing data)..."
npm run db:push

# --- Stop the running server BEFORE building. On Windows the running     ---
# --- standalone server keeps files under .next locked, which makes       ---
# --- `next build` hang forever while trying to rebuild that folder.      ---
$isRunning = pm2 describe my-resume 2>$null
$wasRunning = ($LASTEXITCODE -eq 0)
if ($wasRunning) {
    Write-Output "Stopping my-resume to release .next file locks during build..."
    pm2 stop my-resume
    Start-Sleep -Seconds 2
}

Write-Output "Building production bundle..."
npm run build

Write-Output "Refreshing standalone output (public/static assets + .env)..."
$Standalone = "$ProjectRoot\.next\standalone"
Remove-Item -Recurse -Force "$Standalone\.next\static", "$Standalone\public" -ErrorAction SilentlyContinue
Copy-Item -Recurse "$ProjectRoot\public" "$Standalone\"
Copy-Item -Recurse "$ProjectRoot\.next\static" "$Standalone\.next\"
Copy-Item "$ProjectRoot\.env" "$Standalone\.env"

Write-Output "Starting/restarting with pm2..."
if ($wasRunning) {
    pm2 restart my-resume --update-env
} else {
    pm2 start "$Standalone\server.js" --name my-resume --cwd $Standalone --env PORT=3000
}
pm2 save

Write-Output "Done. App running on port 3000 (proxy it with nginx/IIS as needed)."
