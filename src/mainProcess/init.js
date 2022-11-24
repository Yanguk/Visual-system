import { ipcMain } from 'electron';
import os from 'os';

import { channelEnum, INTERVAL_TIME_500, memoryInfoEnum } from '../lib/constant';
import getProcessListInstance, { ProcessInfo } from './systemUtil/getProcessListInstance';
import getMemoryInstance, { MemoryInfo } from './osUtil/getMemoryInstance';
import HardDiskInfo from './systemUtil/getHardDiskInfo';
import getCPUInstance from './osUtil/getCPUInstance';
import getUserInfo from './osUtil/getUserInfo';
import { curry } from '../lib/fp/util';
import _ from '../lib/fp';

const cpuInfo = getCPUInstance();
cpuInfo.startInterval(INTERVAL_TIME_500);

const memoryInfo = getMemoryInstance();
memoryInfo.startInterval(INTERVAL_TIME_500);

const processInfo = getProcessListInstance();
processInfo.startInterval(INTERVAL_TIME_500 * 2 * 3);

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
ipcMain.handle('processList', () => ProcessInfo.getProcessList(100));
ipcMain.handle('stats', () => ({
  cpu: cpuInfo.getPercentageTotalAverage(),
  memory: memoryInfo.getPercentageTotalAverage(),
}));

const init = win => {
  const makeChannel = curry((channel, data) => {
    _.go1(data, dataInfo => win.webContents.send(channel, dataInfo));
  });

  const sendTotalCPUUsage = makeChannel(channelEnum.CPU.USAGE);
  const sendAllCPUUsage = makeChannel(channelEnum.CPU.ALL_USAGE);
  const sendMemoryUsage = makeChannel(channelEnum.MEMORY.USAGE);
  const sendMemoryDetail = makeChannel(channelEnum.MEMORY.DETAIL);
  const sendProcessList = makeChannel(channelEnum.PROCESS.List);

  cpuInfo.on('interval', cpu => sendTotalCPUUsage(cpu.getTotalUsagePercentage()));
  cpuInfo.on('interval', cpu => sendAllCPUUsage(cpu.getAllUsagePercentage()));
  memoryInfo.on('interval', memory => sendMemoryUsage(memory.data[memoryInfoEnum.USED_MEM_PERCENTAGE]));
  memoryInfo.on('interval', memory => sendMemoryDetail(memory.data));
  processInfo.on('interval', process => sendProcessList(process.data));
};

export default init;
