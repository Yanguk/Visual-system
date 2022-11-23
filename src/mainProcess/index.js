/* eslint-disable no-undef */
import { app, BrowserWindow, screen } from 'electron';
import init from './init';
import menuInit from './menu';

const createWindow = (width, height) => {
  menuInit();

  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    icon: './src/images/icon.png',
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  init(mainWindow);
};

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  createWindow(Math.floor(width * 0.9), Math.floor(height * 0.9));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('quit', () => {
  app.quit();
});
