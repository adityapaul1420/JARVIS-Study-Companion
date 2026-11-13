# JARVIS Study Companion

An Electron-based desktop study companion with a companion notch, study HUD, Pomodoro timer, tasks and productivity tracking.

## Windows quick installation

**Requirements:** Windows 10/11, Node.js LTS (includes npm), and an internet connection.

1. Install Node.js LTS from https://nodejs.org/ if it is not already installed.
2. Open Command Prompt (CMD).
3. Paste this command:

```cmd
curl.exe -fL "https://raw.githubusercontent.com/adityapaul1420/JARVIS-Study-Companion/main/install.cmd" -o "%TEMP%\jarvis-install.cmd" && call "%TEMP%\jarvis-install.cmd"
```

The installer downloads the current `main` branch, installs npm dependencies in `%LOCALAPPDATA%\JARVIS-Study-Companion`, and starts JARVIS.

## Launch again

```cmd
cd /d "%LOCALAPPDATA%\JARVIS-Study-Companion"
npm start
```

## Manual developer setup

```cmd
git clone https://github.com/adityapaul1420/JARVIS-Study-Companion.git
cd JARVIS-Study-Companion
npm install
npm start
```

## Releases

Push a tag such as `v1.0.0` to create a GitHub Release containing a source ZIP:

```cmd
git add .
git commit -m "Update JARVIS"
git push origin main
git tag v1.0.0
git push origin v1.0.0
```

## Data and reinstall notes

JARVIS currently stores productivity data in Electron renderer localStorage. Electron keeps this browser-profile data separately from the application source directory, and this installer does not explicitly delete that profile. Nevertheless, back up important data before reinstalling until the reinstall path has been tested on your own Windows machine.

## Security

The CMD bootstrap downloads and executes the installer from this public repository. Users should verify the repository URL before running it. The installer uses the current `main` branch; GitHub Releases are separate, versioned source archives.
