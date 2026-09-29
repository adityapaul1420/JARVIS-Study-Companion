const { app, BrowserWindow, ipcMain, Tray, Menu, screen, nativeImage } = require('electron');
const path = require('path');

let notchWindow = null;
let productivityWindow = null;
let tray = null;

const NOTCH_SIZE = { width: 92, height: 24 };

function createNotch() {
  if (notchWindow && !notchWindow.isDestroyed()) {
    notchWindow.show();
    return;
  }

  const display = screen.getPrimaryDisplay();
  const workArea = display.workArea;
  const width = NOTCH_SIZE.width;
  const height = NOTCH_SIZE.height;

  notchWindow = new BrowserWindow({
    width,
    height,
    x: Math.round(workArea.x + (workArea.width - width) / 2),
    y: workArea.y,
    frame: false,
    transparent: true,
    resizable: false,
    movable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });

  notchWindow.setAlwaysOnTop(true, 'screen-saver');
  notchWindow.loadFile(path.join(__dirname, 'companion.html'));

  notchWindow.once('ready-to-show', () => {
    notchWindow.show();
  });

  notchWindow.on('closed', () => {
    notchWindow = null;
  });
}

function createProductivity() {
  if (productivityWindow && !productivityWindow.isDestroyed()) {
    productivityWindow.show();
    productivityWindow.focus();
    return;
  }

  const display = screen.getPrimaryDisplay();
  const workArea = display.workArea;

  productivityWindow = new BrowserWindow({
    width: 840,
    height: 920,
    minWidth: 620,
    minHeight: 700,
    x: Math.round(workArea.x + (workArea.width - 840) / 2),
    y: Math.max(workArea.y + 36, Math.round(workArea.y + (workArea.height - 920) / 2)),
    title: 'JARVIS — Study Companion HUD',
    backgroundColor: '#070c14',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });

  productivityWindow.loadFile(path.join(__dirname, 'productivity.html'));

  productivityWindow.once('ready-to-show', () => {
    productivityWindow.show();
    productivityWindow.focus();
  });

  productivityWindow.on('closed', () => {
    productivityWindow = null;
  });
}

function openProductivity() {
  if (productivityWindow && !productivityWindow.isDestroyed()) {
    productivityWindow.show();
    productivityWindow.focus();
  } else {
    createProductivity();
  }
}

function hideProductivity() {
  if (productivityWindow && !productivityWindow.isDestroyed() && productivityWindow.isVisible()) {
    productivityWindow.hide();
  }
}

function toggleProductivity() {
  if (productivityWindow && !productivityWindow.isDestroyed() && productivityWindow.isVisible()) {
    productivityWindow.hide();
  } else {
    openProductivity();
  }
}

function createTray() {
  tray = new Tray(nativeImage.createEmpty());
  const menu = Menu.buildFromTemplate([
    { label: 'JARVIS Companion Notch', enabled: false },
    { type: 'separator' },
    { label: 'Open Study HUD', click: () => openProductivity() },
    { label: 'Toggle Notch', click: () => {
      if (notchWindow && !notchWindow.isDestroyed()) {
        if (notchWindow.isVisible()) notchWindow.hide();
        else notchWindow.show();
      } else {
        createNotch();
      }
    }},
    { type: 'separator' },
    { label: 'Quit JARVIS', click: () => app.quit() }
  ]);
  tray.setToolTip('JARVIS — Companion Notch');
  tray.setContextMenu(menu);
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.aditya.jarvis.studycompanion');

  createNotch();
  createTray();

  ipcMain.handle('toggle-productivity', () => {
    toggleProductivity();
  });

  ipcMain.handle('open-productivity', () => {
    openProductivity();
  });

  ipcMain.handle('hide-productivity', () => {
    hideProductivity();
  });

  ipcMain.on('sync-state', (event, data) => {
    if (notchWindow && !notchWindow.isDestroyed() && notchWindow.webContents !== event.sender) {
      notchWindow.webContents.send('state-updated', data);
    }
    if (productivityWindow && !productivityWindow.isDestroyed() && productivityWindow.webContents !== event.sender) {
      productivityWindow.webContents.send('state-updated', data);
    }
  });

  app.on('activate', () => {
    createNotch();
  });
});

app.on('window-all-closed', (event) => {
  event.preventDefault();
});

app.on('before-quit', () => {
  if (notchWindow && !notchWindow.isDestroyed()) notchWindow.destroy();
  if (productivityWindow && !productivityWindow.isDestroyed()) productivityWindow.destroy();
});
