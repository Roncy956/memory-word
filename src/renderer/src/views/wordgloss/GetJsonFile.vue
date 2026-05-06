<script setup>
import { ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedFile = ref(null)
const jsonData = ref(null) // 用于存储解析后的 JSON 对象

const emit = defineEmits(['get-words'])

function handleFileChange(e) {
    const file = e.target.files[0]
    selectedFile.value = file || null
}

async function saveWords() {
    if (!selectedFile.value) {
        alert('请先选择一个 JSON 文件')
        return
    }

    try {
        // 直接使用 Blob.text()（现代浏览器均支持）
        const text = await selectedFile.value.text()
        jsonData.value = JSON.parse(text)
        emit('get-words', jsonData.value)

        const json = {
            name: selectedFile.value.name,
            data: toRaw(jsonData.value)
        }

        await window.saveWords.saveWordJson(json)
    } catch (err) {
        console.error('JSON 解析失败', err)
        alert('文件内容不是有效的 JSON')
    }

    // 保留你原来的清空操作
    selectedFile.value = null
    document.getElementById('fileInput').value = ''
}

function toMemoryWords() {
    // 这里可以访问 jsonData.value 做后续操作
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
            accept=".json"
            @change="handleFileChange"
        />
        <div class="flex flex-row gap-5">
            <button class="btn btn-info mt-4" @click="saveWords">存储单词表</button>
            <button class="btn btn-info mt-4" @click="toMemoryWords">记忆单词</button>
        </div>
    </div>
</template>

<style scoped></style>
