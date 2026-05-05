<script setup>
import { onMounted, ref } from 'vue'
import ThemeSelect from '../components/ThemeSelect.vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isMaximized = ref(false)

const words = ref([])

const tabs = [
    { name: '主页', path: '/homepage' },
    { name: '背单词', path: '/memory-word' },
    { name: '词库', path: '/glossary' }
]

function setActiveTab(path) {
    router.push(path)
}

// 判断某个 tab 是否应该高亮
function isTabActive(tab) {
    // 对于“数据分析”tab，匹配自身及其所有子路由
    if (tab.path === '/memory-word') {
        return route.path === '/memory-word' || route.path.startsWith('/memory-word')
    } else if (tab.path === '/glossary') {
        return route.path === '/glossary' || route.path.startsWith('/glossary')
    }
    // 其他 tab 保持精确匹配
    return route.path === tab.path
}

// ===========================窗口控制按钮===========================
function minimize() {
    window.setWindow.minimize()
}

function maximize() {
    if (isMaximized.value) {
        isMaximized.value = false
        window.setWindow.unmaximize()
    } else {
        isMaximized.value = true
        window.setWindow.maximize()
    }
}

function close() {
    window.setWindow.close()
}

async function handleResize() {
    isMaximized.value = await window.setWindow.isMaximized()
}

function emitGetWords(data) {
    words.value = data
}

onMounted(async () => {
    isMaximized.value = await window.setWindow.isMaximized()
    window.addEventListener('resize', handleResize)
    await router.push('/homepage')
})
</script>

<template>
    <div class="navbar shadow-sm" style="app-region: drag; overflow-y: hidden">
        <div class="navbar-start flex-row gap-2">
            <a class="btn btn-ghost text-xl shadow-sm">Memory Word</a>
            <ThemeSelect style="app-region: no-drag" />
        </div>

        <div class="navbar-center">
            <div role="tablist" class="tabs tabs-box" style="app-region: no-drag">
                <a
                    v-for="tab in tabs"
                    :key="tab.path"
                    role="tab"
                    class="tab"
                    :class="{ 'tab-active': isTabActive(tab) }"
                    @click="setActiveTab(tab.path)"
                >
                    {{ tab.name }}
                </a>
            </div>
        </div>

        <div class="navbar-end flex-row gap-2">
            <button class="btn btn-soft btn-success" style="app-region: no-drag" @click="minimize">
                一
            </button>
            <button class="btn btn-soft btn-warning" style="app-region: no-drag" @click="maximize">
                {{ isMaximized ? '❐' : '☐' }}
            </button>
            <button class="btn btn-soft btn-error" style="app-region: no-drag" @click="close">
                ✕
            </button>
        </div>
    </div>

    <RouterView :words="words" @get-words="emitGetWords" />
</template>

<style scoped></style>
