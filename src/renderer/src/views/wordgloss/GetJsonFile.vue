<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectedFile = ref(null)

function handleFileChange(e){
    const file = e.target.files[0]
    if (!file) {
        selectedFile.value = null
        return
    }
    selectedFile.value = file
}

function saveWords() {



    // 清空文件
    selectedFile.value = null
    document.getElementById('fileInput').value = ''
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
