@echo off
setlocal EnableExtensions
title JARVIS Study Companion Installer

echo.
echo ==========================================
echo       JARVIS STUDY COMPANION
echo ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is required.
  echo Download the Windows LTS installer from https://nodejs.org/
  echo Install it, close CMD, then run this installer again.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo npm was not found. Reinstall Node.js LTS with npm enabled.
  pause
  exit /b 1
)

set "INSTALL_DIR=%LOCALAPPDATA%\JARVIS-Study-Companion"
set "ZIP=%TEMP%\JARVIS-Study-Companion-main.zip"
set "STAGE=%TEMP%\JARVIS-Study-Companion-stage"

set "PS_EXE=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
if not exist "%PS_EXE%" (
  echo ERROR: Windows PowerShell was not found at its standard location.
  echo Check Windows installation or ask your administrator to enable Windows PowerShell.
  pause
  exit /b 1
)

echo Downloading JARVIS...
"%PS_EXE%" -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $zip=$env:TEMP+'\JARVIS-Study-Companion-main.zip'; $stage=$env:TEMP+'\JARVIS-Study-Companion-stage'; $dest=$env:LOCALAPPDATA+'\JARVIS-Study-Companion'; try { if(Test-Path $stage){Remove-Item $stage -Recurse -Force}; Invoke-WebRequest 'https://github.com/adityapaul1420/JARVIS-Study-Companion/archive/refs/heads/main.zip' -OutFile $zip; Expand-Archive $zip -DestinationPath $stage -Force; $src=Join-Path $stage 'JARVIS-Study-Companion-main'; if(!(Test-Path (Join-Path $src 'package.json'))){throw 'package.json not found in downloaded project'}; if(Test-Path $dest){Remove-Item $dest -Recurse -Force}; New-Item -ItemType Directory -Path $dest -Force | Out-Null; Copy-Item (Join-Path $src '*') $dest -Recurse -Force; Write-Host 'Project files installed.' -ForegroundColor Green } catch { Write-Error $_; exit 1 } finally { if(Test-Path $zip){Remove-Item $zip -Force}; if(Test-Path $stage){Remove-Item $stage -Recurse -Force} }"
if errorlevel 1 (
  echo Download or extraction failed.
  pause
  exit /b 1
)

cd /d "%INSTALL_DIR%"
if errorlevel 1 (
  echo Could not enter installation directory.
  pause
  exit /b 1
)

echo.
echo Installing dependencies. This may take several minutes...
set "ATTEMPT=1"

:INSTALL_RETRY
echo.
echo Dependency installation attempt %ATTEMPT% of 3...
call npm install --no-audit --no-fund --foreground-scripts
if errorlevel 1 goto INSTALL_FAILED

echo Checking that the Electron application binary was downloaded...
call node -e "const fs=require('fs');const p=require('electron');if(typeof p!=='string'||!fs.existsSync(p)){console.error('Electron executable is missing:',p);process.exit(1)}"
if not errorlevel 1 goto INSTALL_OK

:INSTALL_FAILED
if %ATTEMPT% GEQ 3 goto INSTALL_GIVEUP

echo.
echo Electron is incomplete. Cleaning its package and npm cache before retrying...
if exist "node_modules\electron" rmdir /s /q "node_modules\electron"
call npm cache clean --force
set /a ATTEMPT+=1
goto INSTALL_RETRY

:INSTALL_GIVEUP
echo.
echo ERROR: Electron could not be installed after 3 attempts.
echo This often happens when a firewall, antivirus, proxy, or network
echo blocks Electron's download from GitHub.
echo.
echo Check your internet connection and allow GitHub downloads, then
echo run this installer again. If it still fails, send the full error
echo shown above to the JARVIS developer.
pause
exit /b 1

:INSTALL_OK
echo.
echo Dependencies and Electron installed successfully.
echo Starting JARVIS...
echo You can launch it again later with:
echo cd /d "%INSTALL_DIR%" ^&^& npm start
echo.
call npm start
if errorlevel 1 (
  echo.
  echo JARVIS closed with an error. Run "npm start" from:
  echo %INSTALL_DIR%
  pause
)
endlocal
