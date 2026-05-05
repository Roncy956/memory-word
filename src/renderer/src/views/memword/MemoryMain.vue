<script setup>
import { onMounted, ref } from 'vue'
import MemoryWord from './MemoryWord.vue'
import ProgressCard from '../../components/ProgressCard.vue'
import GroupSelector from './GroupSelector.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const groupSize = ref(20)

const isMemory = ref(false)
const index = ref(0)
const groupId = ref(1)
const finishWordCount = ref(12)
const totalWordCount = ref(2000)
const memoryWords = ref([])

const props = defineProps({
    words: {
        type: Array,
        default: null
    }
})

function optionWords(data) {
    groupId.value = data
    index.value = (data - 1) * groupSize.value
}

function beginMemory() {
    if (memoryWords.value.length === 0) {
        document.getElementById('my_modal_2').showModal()
        return
    }
    isMemory.value = true
}

function returnMemMain() {
    isMemory.value = false
}

function toAddWords() {
    router.push('/glossary')
}

function emitNextGroup() {
    groupId.value = groupId.value + 1
    index.value = (groupId.value - 1) * groupSize.value
}

onMounted(() => {
    memoryWords.value = props.words
    optionWords(80)
})

// 为了解决安全
function openWordModal() {
    const modal = document.getElementById('my_modal_2')
    if (modal) {
        modal.showModal()
    }
}
</script>

<template>
    <MemoryWord
        v-if="isMemory"
        :init-index="index"
        :words="memoryWords"
        :group-size="groupSize"
        @exit-memory="returnMemMain"
        @next-group="emitNextGroup"
    />
    <div v-else class="hero bg-base-100 h-full w-full">
        <!-- 主容器：垂直弹性布局，占满高度，均匀分配空间 -->
        <div class="hero-content flex-col w-full max-w-6xl mx-auto h-full space-y-8">
            <!-- 1. 进度条（顶部固定区域） -->
            <div class="w-full flex flex-row justify-center">
                <ProgressCard
                    class="w-4/5"
                    :total-count="totalWordCount"
                    :finish-count="finishWordCount"
                />
            </div>

            <!-- 2. 滑块 + 数值（水平居中，比例分布） -->
            <div class="w-full flex flex-row items-center justify-center gap-5">
                <input
                    v-model.number="groupSize"
                    type="range"
                    min="0"
                    max="50"
                    class="range w-3/5"
                    step="1"
                />
                <div class="badge badge-neutral">{{ groupSize }} word every group</div>
            </div>

            <!-- 3. 主内容区：左右比例 2/3 和 1/3，完美分布 -->
            <div class="w-full flex flex-row items-stretch gap-5 mt-4 h-1/2">
                <!-- 左侧：Begin 区域 占 3/5 -->
                <div
                    class="flex-1 h-full flex flex-col items-center justify-center text-center space-y-6 bg-base-200 rounded-box p-8 shadow-sm"
                >
                    <h1 class="text-5xl font-bold">Begin</h1>
                    <p class="text-3xl">Start from Group{{ groupId }}</p>

                    <!-- 按钮组 -->
                    <div class="flex flex-wrap gap-4 justify-center mt-4">
                        <button class="btn btn-warning w-40" @click="openWordModal">
                            Show Words
                        </button>
                        <button class="btn btn-info w-40" @click="beginMemory">Begin</button>
                    </div>
                </div>

                <!-- 右侧：分组选择 占 1/3 -->
                <GroupSelector :group-id="groupId" @select-group="optionWords" />
            </div>
        </div>
    </div>

    <!-- 弹窗：保持不动 -->
    <dialog id="my_modal_2" class="modal">
        <div v-if="words.length !== 0" class="modal-box w-[90%] max-w-4xl max-h-[80vh]">
            <ul class="list bg-base-200 rounded-box shadow-md">
                <li v-for="item in props.words" :key="item.word" class="list-row grid grid-cols-2">
                    <div class="text-2xl font-bold tabular-nums">{{ item.word }}</div>
                    <div class="text-2xl tabular-nums">{{ item.trans }}</div>
                </li>
            </ul>
        </div>
        <div v-else class="modal-box flex flex-col items-center gap-2">
            <h1>No words</h1>
            <div class="btn w-40" @click="toAddWords">To add words</div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<style scoped></style>
