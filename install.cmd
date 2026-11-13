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

where curl.exe >nul 2>&1
if errorlevel 1 (
  echo ERROR: curl.exe was not found. Use an updated Windows 10 or Windows 11 PC.
  pause
  exit /b 1
)

where tar.exe >nul 2>&1
if errorlevel 1 (
  echo ERROR: tar.exe was not found. Use an updated Windows 10 or Windows 11 PC.
  pause
  exit /b 1
)

set "INSTALL_DIR=%LOCALAPPDATA%\JARVIS-Study-Companion"
set "ZIP=%TEMP%\JARVIS-Study-Companion-main.zip"
set "STAGE=%TEMP%\JARVIS-Study-Companion-stage"
set "SOURCE_URL=https://github.com/adityapaul1420/JARVIS-Study-Companion/archive/refs/heads/main.zip"

echo Downloading JARVIS from GitHub...
if exist "%STAGE%" rmdir /s /q "%STAGE%"
mkdir "%STAGE%"
if errorlevel 1 (
  echo Could not create temporary download folder.
  pause
  exit /b 1
)

curl.exe -fL --retry 3 --retry-delay 2 "%SOURCE_URL%" -o "%ZIP%"
if errorlevel 1 (
  echo Download failed. Check your internet connection and try again.
  if exist "%ZIP%" del /q "%ZIP%"
  if exist "%STAGE%" rmdir /s /q "%STAGE%"
  pause
  exit /b 1
)

tar.exe -xf "%ZIP%" -C "%STAGE%"
if errorlevel 1 (
  echo Could not extract the downloaded project archive.
  del /q "%ZIP%"
  rmdir /s /q "%STAGE%"
  pause
  exit /b 1
)

set "SOURCE_DIR=%STAGE%\JARVIS-Study-Companion-main"
if not exist "%SOURCE_DIR%\package.json" (
  echo ERROR: package.json was not found in the downloaded project.
  del /q "%ZIP%"
  rmdir /s /q "%STAGE%"
  pause
  exit /b 1
)

if exist "%INSTALL_DIR%" rmdir /s /q "%INSTALL_DIR%"
mkdir "%INSTALL_DIR%"
if errorlevel 1 (
  echo Could not create the JARVIS installation folder.
  del /q "%ZIP%"
  rmdir /s /q "%STAGE%"
  pause
  exit /b 1
)

xcopy "%SOURCE_DIR%\*" "%INSTALL_DIR%\" /E /I /H /Y >nul
if errorlevel 1 (
  echo Could not copy the JARVIS project files.
  del /q "%ZIP%"
  rmdir /s /q "%STAGE%"
  pause
  exit /b 1
)

del /q "%ZIP%"
rmdir /s /q "%STAGE%"
echo Project files downloaded and extracted successfully.

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
echo This may happen if a firewall, antivirus, proxy, or network
echo blocks Electron's download from GitHub.
echo Check your internet connection and allow GitHub downloads, then
echo run this installer again. If it still fails, send the full error.
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
