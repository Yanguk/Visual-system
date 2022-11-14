import { ipcMain } from 'electron';
import os from 'os';
import { channelEnum, INTERVAL_TIME } from '../lib/constant';
import { convertKbToGb, curry } from '../lib/fp/util';
import getCPUInstance from './osUtil/getCPUInstance';
import getMemoryInstance from './osUtil/getMemoryInstance';
import getNetworkInfoInstance from './osUtil/getNetworkInfoInstance';
import getHardDiskInfo from './systemUtil/getHardDiskInfo';

const networkInfo = getNetworkInfoInstance();

// toDo: 삭제예정
ipcMain.handle('cpu', () => os.cpus());

// toDo: 삭제예정
ipcMain.handle('memory', () => ({
  free: os.freemem(),
  total: os.totalmem(),
}));

ipcMain.handle('disk', () => getHardDiskInfo());

const userInfoData = {
  name: os.userInfo().username,
  ip: networkInfo.getIp(),
  cpu: os.cpus()[0].model,
  memory: convertKbToGb(os.totalmem() / 1024),
};

ipcMain.handle('userInfo', () => userInfoData);

const init = win => {
  const cpuInfo = getCPUInstance(win);
  cpuInfo.startInterval(INTERVAL_TIME);

  const memoryInfo = getMemoryInstance(win);
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
