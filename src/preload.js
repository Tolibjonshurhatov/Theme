const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aurora', {
  listWallpapers: () => ipcRenderer.invoke('list-wallpapers'),
  setWallpaper: (imagePath, scope) => ipcRenderer.invoke('set-wallpaper', { imagePath, scope }),
});
