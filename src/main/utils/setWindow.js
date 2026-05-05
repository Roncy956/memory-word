import { ipcMain } from 'electron'

export function WindowControl(win) {
    // 窗口控制
    ipcMain.on('window-minimize', () => {
        win.minimize()
    })

    ipcMain.on('window-maximize', () => {
        win.maximize()
    })

    ipcMain.on('window-unmaximize', () => {
        win.unmaximize()
    })

    ipcMain.on('window-close', () => {
        win.destroy()
    })

    ipcMain.handle('window-is-maximized', () => {
        return win.isMaximized()
    })
}
