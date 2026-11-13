const { app, BrowserWindow, ipcMain, Tray, Menu, screen, nativeImage, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let notchWindow = null;
let productivityWindow = null;
let tray = null;

const NOTCH_SIZE = { width: 92, height: 24 };

function getDataFilePath() {
  const userDir = app.getPath('userData');
  if (!fs.existsSync(userDir)) {
    try {
      fs.mkdirSync(userDir, { recursive: true });
    } catch (e) {}
  }
  return path.join(userDir, 'jarvis_focus_data.json');
}

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
    width: 940,
    height: 960,
    minWidth: 680,
    minHeight: 700,
    x: Math.round(workArea.x + (workArea.width - 940) / 2),
    y: Math.max(workArea.y + 24, Math.round(workArea.y + (workArea.height - 960) / 2)),
    title: 'JARVIS — Study Companion & Focus Analytics HUD',
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
    { label: 'Open Study HUD & Analytics', click: () => openProductivity() },
    { label: 'Open Data File Location', click: () => {
      const p = getDataFilePath();
      if (fs.existsSync(p)) shell.showItemInFolder(p);
      else shell.openPath(path.dirname(p));
    }},
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
  tray.setToolTip('JARVIS — Companion Notch & Study HUD');
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

  // File handling path IPC operations
  ipcMain.handle('get-data-file-info', () => {
    const filePath = getDataFilePath();
    const dirPath = path.dirname(filePath);
    const exists = fs.existsSync(filePath);
    let size = 0;
    let mtime = null;
    if (exists) {
      try {
        const stat = fs.statSync(filePath);
        size = stat.size;
        mtime = stat.mtime.toISOString();
      } catch (e) {}
    }
    return { filePath, dirPath, exists, size, mtime };
  });

  ipcMain.handle('open-data-folder', async () => {
    const filePath = getDataFilePath();
    if (fs.existsSync(filePath)) {
      shell.showItemInFolder(filePath);
      return { success: true };
    } else {
      const dirPath = path.dirname(filePath);
      await shell.openPath(dirPath);
      return { success: true };
    }
  });

  ipcMain.handle('open-data-file', async () => {
    const filePath = getDataFilePath();
    if (fs.existsSync(filePath)) {
      await shell.openPath(filePath);
      return { success: true };
    }
    return { success: false, error: 'File does not exist yet' };
  });

  ipcMain.handle('save-data-file', async (_event, data) => {
    try {
      const filePath = getDataFilePath();
      const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, content, 'utf8');
      
      // Also write backup safely
      try {
        const backupPath = path.join(path.dirname(filePath), 'jarvis_focus_data.backup.json');
        fs.writeFileSync(backupPath, content, 'utf8');
      } catch (e) {}

      const stat = fs.statSync(filePath);
      return {
        success: true,
        filePath,
        size: stat.size,
        mtime: stat.mtime.toISOString()
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('load-data-file', async () => {
    try {
      const filePath = getDataFilePath();
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        return { success: true, data: JSON.parse(raw), filePath };
      }
      return { success: false, reason: 'not_found' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('export-data-dialog', async (_event, { defaultName, content, type }) => {
    try {
      const win = productivityWindow || BrowserWindow.getFocusedWindow();
      const filters = type === 'csv'
        ? [{ name: 'CSV Files', extensions: ['csv'] }]
        : [{ name: 'JSON Files', extensions: ['json'] }];
      
      const res = await dialog.showSaveDialog(win, {
        title: 'Export JARVIS Study Data',
        defaultPath: defaultName || (type === 'csv' ? 'jarvis_focus_sessions.csv' : 'jarvis_study_data.json'),
        filters
      });

      if (!res.canceled && res.filePath) {
        fs.writeFileSync(res.filePath, content, 'utf8');
        return { success: true, filePath: res.filePath };
      }
      return { success: false, canceled: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('import-data-dialog', async () => {
    try {
      const win = productivityWindow || BrowserWindow.getFocusedWindow();
      const res = await dialog.showOpenDialog(win, {
        title: 'Import JARVIS Study Data File',
        filters: [{ name: 'JSON Files', extensions: ['json'] }],
        properties: ['openFile']
      });

      if (!res.canceled && res.filePaths && res.filePaths.length > 0) {
        const targetPath = res.filePaths[0];
        const raw = fs.readFileSync(targetPath, 'utf8');
        const parsed = JSON.parse(raw);
        return { success: true, data: parsed, filePath: targetPath };
      }
      return { success: false, canceled: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
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
