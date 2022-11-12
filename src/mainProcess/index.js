import { app, BrowserWindow } from 'electron';
import './os';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 832,
    webPreferences: {
      // eslint-disable-next-line no-undef
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // eslint-disable-next-line no-undef
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
