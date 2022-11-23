import { contextBridge, ipcRenderer } from 'electron';
import { curry } from './lib/fp/util';

contextBridge.exposeInMainWorld('api', {
  cpu: () => ipcRenderer.invoke('cpu'),
  memory: () => ipcRenderer.invoke('memory'),
  userInfo: () => ipcRenderer.invoke('userInfo'),
  disk: () => ipcRenderer.invoke('disk'),
  diskAll: () => ipcRenderer.invoke('diskAll'),
  memoryDetail: () => ipcRenderer.invoke('memoryDetail'),
  processList: () => ipcRenderer.invoke('processList'),
  processKill: pid => ipcRenderer.invoke('processKill', pid),
  getStats: () => ipcRenderer.invoke('stats'),
});

contextBridge.exposeInMainWorld('connect', {
  on: curry((channel, fn) => {
    const subscription = (event, ...args) => fn(...args);

    ipcRenderer.on(channel, subscription);

    return () => ipcRenderer.removeListener(channel, subscription);
  }),
  removeAllListener(channel) {
    ipcRenderer.removeAllListeners(channel);
  },
});
