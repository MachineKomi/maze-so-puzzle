param(
  [Parameter(Mandatory = $true)]
  [string]$Executable,
  [Parameter(Mandatory = $true)]
  [string]$Output,
  [ValidateRange(5, 30)]
  [int]$Iterations = 5,
  [ValidateSet("clean", "not-attested", "contaminated")]
  [string]$HostGate = "not-attested",
  [switch]$InventoryOnly
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$exePath = (Resolve-Path -LiteralPath $Executable).Path
$outputPath = [System.IO.Path]::GetFullPath($Output)
$repoRootNormalized = [System.IO.Path]::GetFullPath($repoRoot).TrimEnd('\')
if (
  $outputPath.Equals($repoRootNormalized, [System.StringComparison]::OrdinalIgnoreCase) -or
  $outputPath.StartsWith("$repoRootNormalized\", [System.StringComparison]::OrdinalIgnoreCase)
) {
  throw "Raw performance evidence must be written outside the repository: $outputPath"
}
if (Test-Path -LiteralPath $outputPath) { throw "Evidence output already exists; use a fresh path: $outputPath" }

function Invoke-Git([string[]]$Arguments) {
  return (& git -C $repoRoot @Arguments | Out-String).Trim()
}

function Get-FileSha256([string]$Path) {
  $algorithm = [System.Security.Cryptography.SHA256]::Create()
  $stream = [System.IO.File]::OpenRead($Path)
  try {
    $bytes = $algorithm.ComputeHash($stream)
    return -join ($bytes | ForEach-Object { $_.ToString("x2") })
  }
  finally {
    $stream.Dispose()
    $algorithm.Dispose()
  }
}

function Measure-WindowReadyLaunchProxy([string]$Path, [int]$Ordinal) {
  $timer = [System.Diagnostics.Stopwatch]::StartNew()
  $process = Start-Process -FilePath $Path -PassThru -WindowStyle Hidden
  $readyAtMs = $null
  $deadline = [DateTime]::UtcNow.AddSeconds(15)
  try {
    while ([DateTime]::UtcNow -lt $deadline) {
      Start-Sleep -Milliseconds 25
      $process.Refresh()
      if ($process.HasExited) { break }
      if ($process.Responding -and $process.MainWindowHandle -ne 0) {
        $readyAtMs = [Math]::Round($timer.Elapsed.TotalMilliseconds, 3)
        break
      }
    }
    $process.Refresh()
    return [ordered]@{
      capturedAtUtc = [DateTime]::UtcNow.ToString("o")
      sampleOrdinal = $Ordinal
      readyMs = $readyAtMs
      processExitedBeforeReady = $process.HasExited
      responding = if ($process.HasExited) { $false } else { $process.Responding }
      mainWindowHandleObserved = if ($process.HasExited) { $false } else { $process.MainWindowHandle -ne 0 }
      workingSetBytes = if ($process.HasExited) { $null } else { $process.WorkingSet64 }
      privateMemoryBytes = if ($process.HasExited) { $null } else { $process.PrivateMemorySize64 }
      handleCount = if ($process.HasExited) { $null } else { $process.HandleCount }
    }
  }
  finally {
    if (-not $process.HasExited) {
      [void]$process.CloseMainWindow()
      if (-not $process.WaitForExit(2000)) {
        Stop-Process -Id $process.Id -Force
      }
    }
    $process.Dispose()
  }
}

$os = Get-CimInstance Win32_OperatingSystem
$computer = Get-CimInstance Win32_ComputerSystem
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
$gpu = Get-CimInstance Win32_VideoController | Select-Object -First 1
$webViewRoot = "C:\Program Files (x86)\Microsoft\EdgeWebView\Application"
$webViewVersions = if (Test-Path -LiteralPath $webViewRoot) {
  @(Get-ChildItem -LiteralPath $webViewRoot -Directory |
    Where-Object Name -Match '^\d+\.\d+\.\d+\.\d+$' |
    Select-Object -ExpandProperty Name)
} else { @() }
$runtimeStatus = Invoke-Git @("status", "--short", "--", "src", "public", "index.html", "vite.config.ts", "tsconfig.app.json", "src-tauri")
$rejectionReasons = @()
if ($HostGate -ne "clean") { $rejectionReasons += "host-gate:$HostGate" }
if ($runtimeStatus.Length -gt 0) { $rejectionReasons += "runtime-inputs-dirty" }
if ($InventoryOnly) { $rejectionReasons += "inventory-only-no-launch-timing" }
if (-not $InventoryOnly) { $rejectionReasons += "native-window-proxy-is-not-semantic-webview-readiness" }
$samples = @()
$measuredScenarios = [object[]]@()
if (-not $InventoryOnly) {
  $measuredScenarios = [object[]]@("S11:native-window-ready-launch-proxy")
  for ($iteration = 0; $iteration -lt $Iterations; $iteration += 1) {
    $samples += Measure-WindowReadyLaunchProxy $exePath ($iteration + 1)
  }
  if (@($samples | Where-Object { $null -eq $_.readyMs }).Count -gt 0) {
    $rejectionReasons += "one-or-more-launches-did-not-reach-window-ready"
  }
}

$acceptance = if ($InventoryOnly) { "pending-hardware" } else { "contaminated-report-only" }
$report = [ordered]@{
  schema = "maze-performance-tauri-cohort/v1"
  generatedAtUtc = [DateTime]::UtcNow.ToString("o")
  acceptance = $acceptance
  evidenceClass = if ($InventoryOnly) { "artifact-inventory-only" } else { "native-window-ready-launch-proxy" }
  timingPolicy = "report-only"
  readinessDefinition = "Root process is responding and exposes a nonzero native MainWindowHandle. This does not prove that WebView2 content is visible, loaded, or semantically interactive."
  rejectionReasons = $rejectionReasons
  provenance = [ordered]@{
    commit = Invoke-Git @("rev-parse", "HEAD")
    workingTreeStatus = @((Invoke-Git @("status", "--short")) -split "`r?`n" | Where-Object Length)
    runtimeInputStatus = @($runtimeStatus -split "`r?`n" | Where-Object Length)
    packageLockSha256 = Get-FileSha256 (Join-Path $repoRoot "package-lock.json")
    cargoLockSha256 = Get-FileSha256 (Join-Path $repoRoot "src-tauri\Cargo.lock")
    executablePath = $exePath
    executableBytes = (Get-Item -LiteralPath $exePath).Length
    executableSha256 = Get-FileSha256 $exePath
    buildMode = "prebuilt-tauri-release-artifact"
  }
  environment = [ordered]@{
    os = "$($os.Caption) $($os.Version) build $($os.BuildNumber)"
    architecture = $os.OSArchitecture
    manufacturer = $computer.Manufacturer
    model = $computer.Model
    totalMemoryBytes = [int64]$computer.TotalPhysicalMemory
    cpu = $cpu.Name
    physicalCores = $cpu.NumberOfCores
    logicalProcessors = $cpu.NumberOfLogicalProcessors
    gpu = $gpu.Name
    gpuDriver = $gpu.DriverVersion
    webView2Versions = $webViewVersions
    powerMode = (& powercfg /getactivescheme | Out-String).Trim()
    thermalState = "unavailable-on-host"
    hostGate = $HostGate
  }
  plannedScenarios = @("S11:cold-start", "S11:warm-start", "S11:idle", "S11:sustained-play", "S11:resize", "S11:save-resume-reopen")
  measuredScenarios = $measuredScenarios
  runCount = $samples.Count
  samples = $samples
  unavailable = @(
    "semantic WebView2 visible-and-interactive readiness",
    "qualified cold-start timing",
    "qualified warm-start timing",
    "selected WebView2 runtime verification",
    "process-tree memory",
    "WebView frame timing",
    "idle and sustained-play resource use",
    "resize cohort",
    "save-resume-reopen cohort"
  )
}

$parent = Split-Path -Parent $outputPath
if (-not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
$report | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath $outputPath -Encoding utf8
Write-Output "performance-tauri: acceptance=$acceptance"
Write-Output "performance-tauri: samples=$($samples.Count)"
Write-Output "performance-tauri: $outputPath"
