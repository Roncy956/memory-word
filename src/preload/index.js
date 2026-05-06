const { contextBridge, ipcRenderer } = require('electron')

// 窗口的控制
contextBridge.exposeInMainWorld('setWindow', {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    unmaximize: () => ipcRenderer.send('window-unmaximize'),
    close: () => ipcRenderer.send('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized')
})

// 储存功能
contextBridge.exposeInMainWorld('saveWords', {
    // 暴露保存方法
    saveWordJson: (data) => ipcRenderer.invoke('save-word', data),
    // 暴露读取方法
    loadWordJson: (name) => ipcRenderer.invoke('load-word', name)
})

contextBridge.exposeInMainWorld('saveHistory', {
    saveOptionJson: (data) => ipcRenderer.invoke('save-option', data),

    loadOptionJson: () => ipcRenderer.invoke('load-option')
})
