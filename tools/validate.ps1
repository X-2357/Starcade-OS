param(
    [string]$View
)
$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
if (-not $View) { $View = Join-Path $Root 'Web-and-Papyrus\starcade.arcade\launcher' }

Get-Content -LiteralPath (Join-Path $View 'manifest.json') -Raw | ConvertFrom-Json | Out-Null
$JavaScript = Get-ChildItem -LiteralPath $View -Recurse -Filter '*.js'
foreach ($File in $JavaScript) {
    & node --check $File.FullName
    if ($LASTEXITCODE -ne 0) { throw "JavaScript validation failed: $($File.FullName)" }
}
$CatalogText = Get-Content -LiteralPath (Join-Path $View 'games\catalog.js') -Raw
$Entries = [regex]::Matches($CatalogText, 'entry:\s*"([^"]+)"')
foreach ($Entry in $Entries) {
    $Target = Join-Path $View ($Entry.Groups[1].Value -replace '/', '\')
    if (-not (Test-Path -LiteralPath $Target)) { throw "Missing catalog entry: $Target" }
}
if ($Entries.Count -ne 32) { throw "Expected 32 embedded catalog games, found $($Entries.Count)" }
if ($CatalogText -notmatch 'external:"openmw"') { throw 'OpenMW external integration is missing' }
if ($CatalogText -notmatch 'Freedoom: Phase 1') { throw 'Freedoom catalog identity is missing' }
$IndexText = Get-Content -LiteralPath (Join-Path $View 'index.html') -Raw
$GameCss = Get-Content -LiteralPath (Join-Path $View 'games\game.css') -Raw
if ($IndexText -notmatch 'CREATED BY X-2357' -or $GameCss -notmatch 'CREATED BY X-2357') { throw 'Creator branding is missing' }
Write-Host "Validated $($JavaScript.Count) JavaScript files and $($Entries.Count) game entries."
