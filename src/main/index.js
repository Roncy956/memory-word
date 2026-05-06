import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { WindowControl } from './utils/setWindow.js'
// import { getVideoList } from './utils/getVideoList'
import { appStore } from './utils/dataStore'
// import { setupVideoProtocol } from './utils/readVideo'

const createWindow = () => {
    const win = new BrowserWindow({
        frame: false,
        minWidth: 1100, // 最小宽度 600px
        minHeight: 680, // 最小高度 400px
        width: 1100,
        height: 680,
        webPreferences: {
            nodeIntegration: false, // 禁用 Node.js 集成，提高安全性
            contextIsolation: true, // 启用上下文隔离，必须配合 preload 使用
            preload: join(__dirname, '../preload/index.js'),
            webSecurity: true
        }
    })

    // 调用 IPC 处理函数，传入窗口实例
    WindowControl(win)
    // getVideoList(win)

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        win.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        win.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

app.whenReady().then(() => {
    // 初始化数据存储
    appStore()
    //
    // setupVideoProtocol() // 注册自定义协议

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
