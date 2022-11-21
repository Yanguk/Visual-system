import { contextBridge, ipcRenderer } from 'electron';
import { curry } from './lib/fp/util';

contextBridge.exposeInMainWorld('api', {
  cpu: () => ipcRenderer.invoke('cpu'),
  memory: () => ipcRenderer.invoke('memory'),
  userInfo: () => ipcRenderer.invoke('userInfo'),
  disk: () => ipcRenderer.invoke('disk'),
  diskAll: () => ipcRenderer.invoke('diskAll'),
  memoryDetail: () => ipcRenderer.invoke('memoryDetail'),
  processList: count => ipcRenderer.invoke('processList', count),
  processKill: pid => ipcRenderer.invoke('processKill', pid),
  getStats: time => ipcRenderer.invoke('stats', time),
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
