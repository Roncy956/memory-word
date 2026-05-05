<script setup>
import { ref, defineEmits } from 'vue'
import mammoth from 'mammoth'
import { useRouter } from 'vue-router'

const router = useRouter()

// 定义向父组件发送的事件
const emit = defineEmits(['get-words', 'error'])

// 保存选中的文件
const selectedFile = ref(null)

// 处理文件选择变更：仅保存文件，不解析
const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
        selectedFile.value = null
        return
    }

    // 仅允许 .docx 文件
    if (
        file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        !file.name.endsWith('.docx')
    ) {
        emit('error', '仅支持上传 .docx 格式的文件！')
        selectedFile.value = null
        return
    }

    selectedFile.value = file
}

// 点击按钮时才解析文件
const parseDocx = async () => {
    const file = selectedFile.value
    if (!file) {
        emit('error', '请先选择一个 .docx 文件！')
        return
    }

    try {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        const rawText = result.value

        const paragraphs = rawText
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                    return line.substring(2, line.length - 2).trim()
                }
                return line
            })

        const words = []
        const trans = []
        for (const line of paragraphs) {
            const hasChinese = /[\u4e00-\u9fff]/.test(line)
            if (hasChinese) {
                trans.push(line)
            } else {
                words.push(line)
            }
        }

        const minLen = Math.min(words.length, trans.length)
        words.length = minLen
        trans.length = minLen

        const jsonData = words.map((word, index) => ({
            id: index + 1,
            word: word,
            trans: trans[index]
        }))

        // emit('docxToJson', jsonData)
        emit('get-words', jsonData)
        // console.log(jsonData)

        // 可选：解析成功后清空文件
        selectedFile.value = null
        document.getElementById('fileInput').value = ''
    } catch (error) {
        emit('error', `文件解析失败：${error.message}`)
        console.error('解析 DOCX 失败:', error)
    }
}

function toMemoryWords() {
    router.push('/memory-word')
}
</script>

<template>
    <div class="hero-content w-full flex-col">
        <!-- 给 input 添加 id 以便手动清空 -->
        <input
            id="fileInput"
            type="file"
            class="file-input"
            accept=".docx"
            @change="handleFileChange"
        />
        <div class="flex flex-row gap-5">
            <button class="btn btn-info mt-4" @click="parseDocx">解析 DOCX</button>
            <button class="btn btn-info mt-4" @click="toMemoryWords">记忆单词</button>
        </div>
    </div>
</template>

<style scoped></style>
