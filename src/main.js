const { app, BrowserWindow, Tray, Menu, ipcMain, nativeImage } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

let mainWindow = null;
let tray = null;

function getWallpapersDir() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'wallpapers')
    : path.join(__dirname, '..', 'wallpapers');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 680,
    minWidth: 760,
    minHeight: 560,
    show: false,
    backgroundColor: '#08090b',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => mainWindow.show());

  // Hide to tray instead of quitting when the window is closed (menu bar app feel)
  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  // Replace build/trayIconTemplate.png with your real logo.
  // On macOS, a "Template" image (black shapes + transparency) auto-adapts to light/dark menu bar.
  const iconPath = path.join(__dirname, '..', 'build', 'trayIconTemplate.png');
  let icon = nativeImage.createFromPath(iconPath);
  if (icon.isEmpty()) {
    icon = nativeImage.createEmpty();
  }
  if (process.platform === 'darwin') {
    icon.setTemplateImage(true);
  }

  tray = new Tray(icon);
  tray.setToolTip('Theme');

  const menu = Menu.buildFromTemplate([
    { label: 'Theme ochish', click: () => { mainWindow.show(); } },
    { type: 'separator' },
    { label: 'Chiqish', click: () => { app.isQuitting = true; app.quit(); } },
  ]);
  tray.setContextMenu(menu);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else mainWindow.show();
  });
});

app.on('window-all-closed', () => {
  // Keep running in the tray/menu bar on macOS; quit on other platforms
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => { app.isQuitting = true; });

/**
 * Set the desktop wallpaper.
 * scope: 'all'  -> every display / every desktop (Spaces on macOS)
 *        'main' -> primary display only (macOS: "desktop 1")
 */
ipcMain.handle('list-wallpapers', async () => {
  const fs = require('fs');
  const dir = getWallpapersDir();
  const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  return files.map(f => ({
    file: f,
    absolutePath: path.join(dir, f),
    fileUrl: 'file://' + path.join(dir, f),
  }));
});

ipcMain.handle('set-wallpaper', async (_event, { imagePath, scope }) => {
  try {
    if (process.platform === 'darwin') {
      await setWallpaperMac(imagePath, scope);
    } else if (process.platform === 'win32') {
      await setWallpaperWindows(imagePath);
    } else {
      const { setWallpaper } = await import('wallpaper');
      await setWallpaper(imagePath);
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

function setWallpaperMac(imagePath, scope) {
  return new Promise((resolve, reject) => {
    const target = scope === 'main' ? 'desktop 1' : 'every desktop';
    const script = `
      tell application "System Events"
        tell ${target}
          set picture to "${imagePath}"
        end tell
      end tell
    `;
    exec(`osascript -e '${script.replace(/'/g, "'\\''")}'`, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function setWallpaperWindows(imagePath) {
  // The `wallpaper` package sets the image for all monitors via the Windows API.
  // Per-monitor wallpapers on Windows need extra native calls and are left as a future enhancement.
  const { setWallpaper } = await import('wallpaper');
  await setWallpaper(imagePath);
}
