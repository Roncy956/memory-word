// parseDocxToJson.js
const fs = require('fs')
const path = require('path')
const mammoth = require('mammoth')

/**
 * 将 .docx 文件解析为 JSON 格式
 * @param {string} docxPath - 输入的 .docx 文件路径
 * @param {string} jsonPath - 输出的 .json 文件路径
 */
async function parseDocxToJson(docxPath, jsonPath) {
    try {
        // 1. 读取并解析 .docx 文件
        const result = await mammoth.extractRawText({ path: docxPath })
        const rawText = result.value

        // 2. 收集所有非空段落文本，并去除首尾空格和星号
        const paragraphs = rawText
            .split('\n') // mammoth 返回的是一个包含所有文本的字符串，段落由换行符分隔
            .map((line) => line.trim()) // 去除每行首尾空格
            .filter((line) => line.length > 0) // 过滤掉空行
            .map((line) => {
                // 去掉两端的 ** 标记
                if (line.startsWith('**') && line.endsWith('**')) {
                    return line.substring(2, line.length - 2).trim()
                }
                return line
            })

        // 3. 区分英文单词和中文释义
        const words = []
        const trans = []

        for (const line of paragraphs) {
            // 使用正则表达式判断是否包含中文字符
            const hasChinese = /[\u4e00-\u9fff]/.test(line)
            if (hasChinese) {
                trans.push(line)
            } else {
                words.push(line)
            }
        }

        // 4. 确保数量一致
        if (words.length !== trans.length) {
            console.warn(
                `警告：英文单词数量 (${words.length}) 与中文释义数量 (${trans.length}) 不匹配！`
            )
            // 取较小值，避免出错
            const minLen = Math.min(words.length, trans.length)
            words.length = minLen // 截断数组
            trans.length = minLen
        }

        // 5. 构建 JSON 数据
        const data = words.map((word, index) => ({
            id: index + 1,
            word: word,
            trans: trans[index]
        }))

        // 6. 写入 JSON 文件
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8')
        console.log(`成功生成 ${jsonPath}，共 ${data.length} 个词条。`)
    } catch (error) {
        console.error('处理文件时出错:', error.message)
    }
}

// 如果直接运行此脚本，则执行以下示例
if (require.main === module) {
    const inputDocx = path.join(__dirname, 'day01.docx')
    const outputJson = path.join(__dirname, 'day01.json')
    parseDocxToJson(inputDocx, outputJson)
}

// 导出函数，以便在其他文件（如 main.js）中使用
module.exports = { parseDocxToJson }
