param([Parameter(Mandatory = $true)][string]$Executable)

$ErrorActionPreference = 'Stop'
$processName = 'openpets-pixel-duo'
if (Get-Process -Name $processName -ErrorAction SilentlyContinue) {
  throw 'Close the existing Pixel Duo process before running this startup check.'
}

$startedAt = [DateTime]::UtcNow
$timer = [Diagnostics.Stopwatch]::StartNew()
$launcher = Start-Process -FilePath $Executable -PassThru
$foundProcess = $false
$sawLogger = $false
$sawWindow = $false
$log = $null
try {
  while ($timer.Elapsed.TotalSeconds -lt 150) {
    if (!$foundProcess -and (Get-Process -Name $processName -ErrorAction SilentlyContinue)) {
      $foundProcess = $true
      Write-Host ('Electron process started at {0:n1}s' -f $timer.Elapsed.TotalSeconds)
    }
    if (!$log) {
      $log = Get-ChildItem $env:APPDATA -Directory |
        Where-Object Name -Match 'open.?pets' |
        ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -Filter 'openpets.log' -File -Recurse -Depth 2 -ErrorAction SilentlyContinue } |
        Where-Object LastWriteTimeUtc -GE $startedAt |
        Select-Object -ExpandProperty FullName -First 1
    }
    if ($log) {
      $lines = Get-Content -LiteralPath $log -Tail 300 | Where-Object {
        if ($_ -match '^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d+Z') {
          [DateTimeOffset]::Parse($Matches[0]).UtcDateTime -ge $startedAt
        }
      }
      if (!$sawLogger -and ($lines -match 'startup begin')) {
        $sawLogger = $true
        Write-Host ('OpenPets startup began at {0:n1}s' -f $timer.Elapsed.TotalSeconds)
      }
      if ($lines -match 'load file complete') {
        $sawWindow = $true
        Write-Host ('Pet window HTML loaded at {0:n1}s' -f $timer.Elapsed.TotalSeconds)
        $lines | Select-String 'startup begin|default window create|show requested|load file complete|startup complete' | ForEach-Object { $_.Line }
        break
      }
      if ($lines -match 'startup failed|renderer process gone') {
        $lines | Select-String 'startup failed|renderer process gone' | ForEach-Object { $_.Line }
        break
      }
    }
    if ($launcher.HasExited -and !$foundProcess) {
      throw "Portable launcher exited before Electron started. Exit code: $($launcher.ExitCode)."
    }
    Start-Sleep -Milliseconds 300
  }
  if (!$sawWindow) { throw 'The default pet window did not finish loading.' }
} finally {
  Get-Process -Name $processName -ErrorAction SilentlyContinue |
    Where-Object { $_.StartTime.ToUniversalTime() -ge $startedAt } |
    Stop-Process -Force -ErrorAction SilentlyContinue
  if (!$launcher.HasExited) { Wait-Process -Id $launcher.Id -Timeout 10 -ErrorAction SilentlyContinue }
}
