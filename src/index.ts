import path from 'path';
import { app, BrowserWindow, Menu } from 'electron';

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const getIconPath = (): string => {
  const base = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(process.cwd(), 'assets');
  return path.join(base, 'icon.ico');
};

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 900,
    width: 1400,
    autoHideMenuBar: true,
    icon: getIconPath(),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  Menu.setApplicationMenu(null);

  mainWindow.loadURL('https://music.youtube.com');

  mainWindow.webContents.setWindowOpenHandler(() => ({
    action: 'allow',
    overrideBrowserWindowOptions: {
      autoHideMenuBar: true,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    },
  }));

  mainWindow.webContents.on('before-input-event', (event, input) => {
    const key = input.key?.toLowerCase();
    if (input.type === 'keyDown' && key === 'r' && (input.control || input.meta)) {
      event.preventDefault();
      mainWindow.webContents.reload();
    }
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});