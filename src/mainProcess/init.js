import { ipcMain } from 'electron';
import os from 'os';
import { channelEnum, INTERVAL_TIME } from '../lib/constant';
import { convertKbToGb, curry } from '../lib/fp/util';
import getCPUInstance from './osUtil/getCPUInstance';
import getMemoryInstance, { MemoryInfo } from './osUtil/getMemoryInstance';
import getNetworkInfoInstance from './osUtil/getNetworkInfoInstance';
import HardDiskInfo from './systemUtil/getHardDiskInfo';
import { ProcessInfo } from './systemUtil/getProcessListInstance';

const networkInfo = getNetworkInfoInstance();

ipcMain.handle('cpu', () => os.cpus());

ipcMain.handle('memory', () => ({
  free: os.freemem(),
  total: os.totalmem(),
}));

ipcMain.handle('disk', () => HardDiskInfo.getHardDiskInfo());

ipcMain.handle('diskAll', () => HardDiskInfo.getHardDiskInfoAll());

ipcMain.handle('memoryDetail', () => MemoryInfo.getMemoryDetail());

const userInfoData = {
  name: os.hostname(),
  ip: networkInfo.getIp(),
  cpu: os.cpus()[0].model,
  memory: convertKbToGb(os.totalmem() / 1024),
};

ipcMain.handle('userInfo', () => userInfoData);
ipcMain.handle('processList', (e, count) => ProcessInfo.getProcessList(count));

const init = win => {
  const cpuInfo = getCPUInstance(win);
  cpuInfo.startInterval(INTERVAL_TIME);

  const memoryInfo = getMemoryInstance(win);
  memoryInfo.startInterval(INTERVAL_TIME);

  const makeChannel = curry((channel, data) => win.webContents.send(channel, data));

  const sendTotalCPUUsage = makeChannel(channelEnum.CPU.USAGE);
  const sendAllCPUUsage = makeChannel(channelEnum.CPU.ALL_USAGE);
  const sendMemoryUsage = makeChannel(channelEnum.MEMORY.USAGE);

  cpuInfo.on('interval', cpu => sendTotalCPUUsage(cpu.getTotalUsagePercentage()));
  cpuInfo.on('interval', cpu => sendAllCPUUsage(cpu.getAllUsagePercentage()));
  memoryInfo.on('interval', memory => sendMemoryUsage(memory.getFreePercentage()));
};

export default init;
