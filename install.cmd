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

echo Downloading JARVIS...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $zip=$env:TEMP+'\JARVIS-Study-Companion-main.zip'; $stage=$env:TEMP+'\JARVIS-Study-Companion-stage'; $dest=$env:LOCALAPPDATA+'\JARVIS-Study-Companion'; try { if(Test-Path $stage){Remove-Item $stage -Recurse -Force}; Invoke-WebRequest 'https://github.com/adityapaul1420/JARVIS-Study-Companion/archive/refs/heads/main.zip' -OutFile $zip; Expand-Archive $zip -DestinationPath $stage -Force; $src=Join-Path $stage 'JARVIS-Study-Companion-main'; if(!(Test-Path (Join-Path $src 'package.json'))){throw 'package.json not found in downloaded project'}; if(Test-Path $dest){Remove-Item $dest -Recurse -Force}; New-Item -ItemType Directory -Path $dest -Force | Out-Null; Copy-Item (Join-Path $src '*') $dest -Recurse -Force; Write-Host 'Project files installed.' -ForegroundColor Green } catch { Write-Error $_; exit 1 } finally { if(Test-Path $zip){Remove-Item $zip -Force}; if(Test-Path $stage){Remove-Item $stage -Recurse -Force} }"
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
call npm install --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo Dependency installation failed. Check your internet connection
  echo and Node.js/npm installation, then run the command again.
  pause
  exit /b 1
)

echo.
echo Installation complete. Starting JARVIS...
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
