
# Script to launch Android Emulator automatically

$SdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$EmulatorPath = "$SdkPath\emulator\emulator.exe"

if (-not (Test-Path $EmulatorPath)) {
    Write-Error "Android Emulator not found at $EmulatorPath. Please install Android Studio."
    exit 1
}

$Avds = @(& $EmulatorPath -list-avds)

if (-not $Avds) {
    Write-Error "No AVDs found. Please create a virtual device in Android Studio Device Manager."
    exit 1
}

$TargetAvd = $Avds[0].Trim()
Write-Host "Launching emulator: $TargetAvd"

& $EmulatorPath -avd $TargetAvd
