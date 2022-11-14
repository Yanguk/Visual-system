import { ipcMain } from 'electron';
import os from 'os';
import { channelEnum, INTERVAL_TIME } from '../lib/constant';
import { curry } from '../lib/fp/util';
import getCPUInfo from './osUtil/getCPUInfo';
import getMemoryInfo from './osUtil/getMemoryInfo';

ipcMain.handle('cpu', () => os.cpus());

ipcMain.handle('memory', () => ({
  free: os.freemem(),
  total: os.totalmem(),
}));

const init = win => {
  const cpuInfo = getCPUInfo(win);
  cpuInfo.startInterval(INTERVAL_TIME);

  const memoryInfo = getMemoryInfo(win);
  memoryInfo.startInterval(INTERVAL_TIME);

  const makeChannel = curry((channel, data) => {
    win.webContents.send(channel, data);
  });

  const sendCPUUsage = makeChannel(channelEnum.CPU.USAGE);
  const sendMemoryUsage = makeChannel(channelEnum.MEMORY.USAGE);

  cpuInfo.on('interval', cpu => sendCPUUsage(cpu.getUsagePercentage()));
  memoryInfo.on('interval', memory => sendMemoryUsage(memory.getUsagePercentage()));
};

export default init;
