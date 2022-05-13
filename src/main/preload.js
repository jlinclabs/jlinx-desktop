import { contextBridge, ipcRenderer, IpcRendererEvent, shell } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (...args) => ipcRenderer.invoke(...args),
  },
  shell: {
    openExternal(url){
      return shell.openExternal(url)
    }
  },
})
