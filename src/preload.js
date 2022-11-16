import { contextBridge, ipcRenderer } from 'electron';
import { curry } from './lib/fp/util';

contextBridge.exposeInMainWorld('api', {
  cpu: () => ipcRenderer.invoke('cpu'),
  memory: () => ipcRenderer.invoke('memory'),
  userInfo: () => ipcRenderer.invoke('userInfo'),
  disk: () => ipcRenderer.invoke('disk'),
  processList: count => ipcRenderer.invoke('processList', count),
  diskAll: () => ipcRenderer.invoke('diskAll'),
  memoryDetail: () => ipcRenderer.invoke('memoryDetail'),
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
