const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('jarvis', {
  toggleProductivity: () => ipcRenderer.invoke('toggle-productivity'),
  openProductivity: () => ipcRenderer.invoke('open-productivity'),
  hideProductivity: () => ipcRenderer.invoke('hide-productivity'),
  setNotchSize: (size) => ipcRenderer.invoke('set-notch-size', size),
  syncState: (state) => ipcRenderer.send('sync-state', state),
  onStateUpdated: (callback) => {
    const subscription = (_event, data) => callback(data);
    ipcRenderer.on('state-updated', subscription);
    return () => ipcRenderer.removeListener('state-updated', subscription);
  }
});
