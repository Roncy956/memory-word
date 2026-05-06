// src/main/utils/dataStore.js
import { app, ipcMain } from 'electron'
import { join } from 'path'
import fs from 'fs/promises' // 使用异步 fs

// 获取用户数据目录路径
const getUserDataPath = () => app.getPath('userData')
const WORDS_DATA_PATH = join(getUserDataPath(), 'words')
const HISTORY_DATA_PATH = join(getUserDataPath(), 'history')

export const appStore = () => {
    // 监听来自渲染进程的 'save-paths' 请求
    ipcMain.handle('save-word', async (event, json) => {
        try {
            // 确定写入文件的路径
            const word_json_path = join(WORDS_DATA_PATH, json.name)

            // 确保目录存在
            await fs.mkdir(WORDS_DATA_PATH, { recursive: true })

            // 存储
            await fs.writeFile(word_json_path, JSON.stringify(json.data, null, 2), 'utf-8')

            return { success: true }
        } catch (error) {
            // console.error('保存失败:', error)
            return { success: false, error: error.message }
        }
    })

    // 监听 'load-paths' 请求
    ipcMain.handle('load-word', async (event, filename) => {
        // 确定读取文件的路径
        const word_json_path = join(WORDS_DATA_PATH, filename)

        try {
            if (!fs.access) {
                // 兼容写法检查文件是否存在
                await fs.access(word_json_path)
            } else {
                await fs.access(word_json_path)
            }

            const content = await fs.readFile(word_json_path, 'utf-8')

            return JSON.parse(content)
        } catch (error) {
            return []
        }
    })

    // 监听来自渲染进程的 'save-paths' 请求
    ipcMain.handle('save-option', async (event, data) => {
        try {
            // 确定写入文件的路径
            const history_json_path = join(HISTORY_DATA_PATH, 'history.json')

            // 确保目录存在
            await fs.mkdir(HISTORY_DATA_PATH, { recursive: true })

            // 存储
            await fs.writeFile(history_json_path, JSON.stringify(data, null, 2), 'utf-8')

            return { success: true }
        } catch (error) {
            // console.error('保存失败:', error)
            return { success: false, error: error.message }
        }
    })

    // 监听 'load-paths' 请求
    ipcMain.handle('load-option', async () => {
        // 确定读取文件的路径
        const history_json_path = join(HISTORY_DATA_PATH, 'history.json')

        try {
            if (!fs.access) {
                // 兼容写法检查文件是否存在
                await fs.access(history_json_path)
            } else {
                await fs.access(history_json_path)
            }

            const content = await fs.readFile(history_json_path, 'utf-8')

            return JSON.parse(content)
        } catch (error) {
            return null
        }
    })
}
