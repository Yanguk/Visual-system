import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  cpu: () => ipcRenderer.invoke('cpu'),
  memory: () => ipcRenderer.invoke('memory'),
});
