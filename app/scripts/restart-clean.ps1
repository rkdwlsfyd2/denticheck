Write-Host "NOTE: Killing all Node.js processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe /T 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "No Node.js processes found to kill." -ForegroundColor Gray
} else {
    Write-Host "All Node.js processes killed." -ForegroundColor Green
}

Write-Host "NOTE: Clearing Metro Bundler cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:TEMP\metro-cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:TEMP\haste-map-*" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "NOTE: Starting Expo with cache cleared..." -ForegroundColor Green
npx expo start --clear
