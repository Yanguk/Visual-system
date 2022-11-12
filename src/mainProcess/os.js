import { ipcMain } from 'electron';
import os from 'os';

ipcMain.handle('cpu', () => os.cpus());
