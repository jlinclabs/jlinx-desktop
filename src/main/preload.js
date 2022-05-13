import { contextBridge, ipcRenderer, IpcRendererEvent, shell } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (...args) =>
      ipcRenderer.invoke(...args),

    execQuery: (queryName, options) =>
      ipcRenderer.invoke('execQuery', queryName, options),
    execCommand: (commandName, options) =>
      ipcRenderer.invoke('execCommand', commandName, options),
  },
  shell: {
    openExternal(url){
      return shell.openExternal(url)
    }
  },
})
