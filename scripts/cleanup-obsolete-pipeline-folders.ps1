<#
.SYNOPSIS
  Rimuove le cartelle di step obsoleti dalla cartella di lavoro Cowork
  della pipeline "Produzioni Sviluppo Bambino".

.DESCRIPTION
  Pipeline attiva (vedi local/src/pipeline/constants.ts STEP_FOLDER_MAP):
    F2  →  f2_step_2, 2a, 3, 4, 4b, 5, 6
    F3  →  f3_step_1..5  (v3.0, ridotta da 11 step)

  Le cartelle elencate in $obsolete corrispondono a step rimossi:
    - f2-step-1-ricerca-temi      (sostituito dall'Archivio temi)
    - f3-step-{1-dispositivo-lettura, 2-stress-test, 3-correzione-strutturale,
               4-indistinguibilità, 5-audit, 6-stabilizzazione-proxy,
               7-trasferibilità-dispositivo, 8-adattamento-strutturale,
               9-dispositivo-completo, 10-stress-test-dispositivo}
      (refactor F3 v3.0 — D7)

  Le cartelle non-step ("temi", "webapp-hcaire") NON vengono toccate.

.PARAMETER Root
  Cartella radice "input/produzioni" del progetto Cowork.
  Default: C:\My\projects\claude-cowork\Sviluppo Bambino\input\produzioni

.PARAMETER DryRun
  Mostra cosa verrebbe cancellato (file/dir count per cartella) senza rimuovere nulla.

.PARAMETER Recycle
  Sposta nel Cestino invece di cancellare permanentemente (recuperabile da Esplora risorse).

.EXAMPLE
  .\cleanup-obsolete-pipeline-folders.ps1 -DryRun
  Mostra il preview senza cancellare.

.EXAMPLE
  .\cleanup-obsolete-pipeline-folders.ps1
  Cancella permanentemente le cartelle obsolete.

.EXAMPLE
  .\cleanup-obsolete-pipeline-folders.ps1 -Recycle
  Sposta le cartelle nel Cestino.
#>

[CmdletBinding()]
param(
  [string]$Root = 'C:\My\projects\claude-cowork\Sviluppo Bambino\input\produzioni',
  [switch]$DryRun,
  [switch]$Recycle
)

$ErrorActionPreference = 'Stop'

$obsolete = @(
  'f2-step-1-ricerca-temi',
  'f3-step-1-dispositivo-lettura',
  'f3-step-2-stress-test',
  'f3-step-3-correzione-strutturale',
  "f3-step-4-indistinguibilit$([char]0x00E0)",  # à
  'f3-step-5-audit',
  'f3-step-6-stabilizzazione-proxy',
  "f3-step-7-trasferibilit$([char]0x00E0)-dispositivo",  # à
  'f3-step-8-adattamento-strutturale',
  'f3-step-9-dispositivo-completo',
  'f3-step-10-stress-test-dispositivo'
)

if (-not (Test-Path -LiteralPath $Root)) {
  Write-Error "Root non trovata: $Root"
  exit 1
}

Write-Host "Root: $Root"
Write-Host ("Mode: " + $(if ($DryRun) { 'DRY-RUN (nessuna modifica)' } elseif ($Recycle) { 'RECYCLE (Cestino)' } else { 'DELETE (permanente)' }))
Write-Host ('-' * 70)

if ($Recycle) {
  Add-Type -AssemblyName Microsoft.VisualBasic
}

$total = 0
foreach ($name in $obsolete) {
  $p = Join-Path $Root $name
  if (-not (Test-Path -LiteralPath $p)) {
    "{0,-45}  (non presente)" -f $name
    continue
  }

  $items = Get-ChildItem -LiteralPath $p -Recurse -Force -ErrorAction SilentlyContinue
  $files = ($items | Where-Object { -not $_.PSIsContainer }).Count
  $dirs  = ($items | Where-Object {     $_.PSIsContainer }).Count

  if ($DryRun) {
    "{0,-45}  files: {1,4}   dirs: {2,3}" -f $name, $files, $dirs
  } else {
    try {
      if ($Recycle) {
        [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory(
          $p,
          [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs,
          [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin
        )
        "RECYCLE  {0,-45}  files: {1,4}   dirs: {2,3}" -f $name, $files, $dirs
      } else {
        Remove-Item -LiteralPath $p -Recurse -Force -Confirm:$false
        "DELETE   {0,-45}  files: {1,4}   dirs: {2,3}" -f $name, $files, $dirs
      }
      $total++
    } catch {
      Write-Warning "Errore su $name : $($_.Exception.Message)"
    }
  }
}

Write-Host ('-' * 70)
if ($DryRun) {
  Write-Host "Dry-run completato. Esegui senza -DryRun per applicare." -ForegroundColor Yellow
} else {
  Write-Host "Cartelle rimosse: $total" -ForegroundColor Green
}
