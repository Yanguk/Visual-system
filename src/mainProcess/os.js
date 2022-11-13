import { ipcMain } from 'electron';
import os from 'os';

ipcMain.handle('cpu', () => os.cpus());

ipcMain.handle('memory', () => ({
  free: os.freemem(),
  total: os.totalmem(),
}));
