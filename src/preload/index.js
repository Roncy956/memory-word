const { contextBridge, ipcRenderer } = require('electron')

// 窗口的控制
contextBridge.exposeInMainWorld('setWindow', {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    unmaximize: () => ipcRenderer.send('window-unmaximize'),
    close: () => ipcRenderer.send('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized')
})
