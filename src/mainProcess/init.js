import { ipcMain } from 'electron';
import os from 'os';
import { channelEnum, INTERVAL_TIME, memoryInfoEnum } from '../lib/constant';
import { curry } from '../lib/fp/util';
import getCPUInstance from './osUtil/getCPUInstance';
import getMemoryInstance, { MemoryInfo } from './osUtil/getMemoryInstance';
import getUserInfo from './osUtil/getUserInfo';
import HardDiskInfo from './systemUtil/getHardDiskInfo';
import { ProcessInfo } from './systemUtil/getProcessListInstance';

ipcMain.handle('cpu', () => os.cpus());

ipcMain.handle('memory', () => ({
  free: os.freemem(),
  total: os.totalmem(),
}));

ipcMain.handle('disk', () => HardDiskInfo.getHardDiskInfo());
ipcMain.handle('diskAll', () => HardDiskInfo.getHardDiskInfoAllGB());
ipcMain.handle('processKill', (e, pid) => ProcessInfo.killProcess(pid));
ipcMain.handle('memoryDetail', () => MemoryInfo.getMemoryDetail());
ipcMain.handle('userInfo', () => getUserInfo());
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
  const sendMemoryDetail = makeChannel(channelEnum.MEMORY.DETAIL);

  cpuInfo.on('interval', cpu => sendTotalCPUUsage(cpu.getTotalUsagePercentage()));
  cpuInfo.on('interval', cpu => sendAllCPUUsage(cpu.getAllUsagePercentage()));
  memoryInfo.on('interval', memory => sendMemoryUsage(memory.lastData[memoryInfoEnum.USED_MEM_PERCENTAGE]));
  memoryInfo.on('interval', memory => sendMemoryDetail(memory.lastData));
};

export default init;
