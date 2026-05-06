<script setup>
import { onMounted, ref, watch, toRaw } from 'vue'
import MemoryWord from './MemoryWord.vue'
import ProgressCard from '../../components/ProgressCard.vue'
import GroupSelector from './GroupSelector.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const groupSize = ref(20)

const isMemory = ref(false)
const isShowWords = ref(false)
const index = ref(0)
const groupId = ref(20)
const finishWordCount = ref(12)
const totalWordCount = ref(2000)
const memoryWords = ref([])
const displayedWords = ref([])

const groupAmount = ref(0)

const props = defineProps({
    words: {
        type: Array,
        default: null
    },
    historyGroupId: {
        type: Number,
        required: true
    },
    historyGroupSize: {
        type: Number,
        required: true
    }
})
const emit = defineEmits(['get-words', 'get-group-id', 'get-group-size'])

function optionWords(data) {
    groupId.value = data
    index.value = (data - 1) * groupSize.value
    displayedWords.value = memoryWords.value.slice(index.value, index.value + groupSize.value)
    finishWordCount.value = groupSize.value * (groupId.value - 1)
    saveHistory()
}

function showTotalWords() {
    displayedWords.value = memoryWords.value
    isShowWords.value = true
}

function closeDialog() {
    isShowWords.value = false
    optionWords(groupId.value)
}

function toAddWords() {
    router.push('/glossary')
}

function emitNextGroup() {
    groupId.value = groupId.value + 1
    index.value = (groupId.value - 1) * groupSize.value
    saveHistory()
}

async function saveHistory() {
    const data = {
        groupId: groupId.value,
        groupSize: groupSize.value
    }
    window.saveHistory.saveOptionJson(toRaw(data))
    emit('get-group-id', groupId.value)
    emit('get-group-size', groupSize.value)
}

async function updateVis() {
    memoryWords.value = props.words
    groupAmount.value = Math.ceil(memoryWords.value.length / groupSize.value)
    totalWordCount.value = memoryWords.value.length
}

watch(
    () => props.words,
    () => {
        updateVis()
    }
)

watch(
    () => groupSize.value,
    async () => {
        await updateVis()
        finishWordCount.value = groupSize.value * (groupId.value - 1)
    }
)

onMounted(() => {
    updateVis()
    groupId.value = props.historyGroupId
    groupSize.value = props.historyGroupSize
    optionWords(groupId.value)
})

function openWordModal() {
    isShowWords.value = true
}
</script>

<template>
    <MemoryWord
        v-if="isMemory"
        :init-index="index"
        :words="memoryWords"
        :group-size="groupSize"
        @exit-memory="isMemory = false"
        @next-group="emitNextGroup"
    />
    <div v-else class="hero bg-base-100 h-full w-full">
        <!-- 主容器：垂直弹性布局，占满高度，均匀分配空间 -->
        <div class="hero-content flex-col w-full max-w-6xl mx-auto h-full space-y-8">
            <!-- 1. 进度条（顶部固定区域） -->
            <div class="w-full flex flex-row justify-center items-center">
                <ProgressCard
                    class="w-3/5"
                    :total-count="totalWordCount"
                    :finish-count="finishWordCount"
                />
                <label for="my_modal_7" class="btn btn-neutral w-40" @click="showTotalWords">
                    Display all words
                </label>
            </div>

            <!-- 2. 滑块 + 数值（水平居中，比例分布） -->
            <div class="w-full flex flex-row items-center justify-center gap-5">
                <input
                    v-model.number="groupSize"
                    type="range"
                    min="1"
                    max="50"
                    class="range w-3/5"
                    step="1"
                />
                <div class="badge badge-neutral">{{ groupSize }} word every group</div>
            </div>

            <!-- 3. 主内容区：左右比例 2/3 和 1/3，完美分布 -->
            <div class="px-20 w-full flex flex-row items-stretch gap-5 mt-4 h-1/2">
                <!-- 左侧：Begin 区域 占 3/5 -->
                <div
                    class="flex-1 h-full flex flex-col items-center justify-center text-center space-y-6 bg-base-200 rounded-box p-8 shadow-sm"
                >
                    <h1 class="text-5xl font-bold">Begin</h1>
                    <p class="text-3xl">Start from Group{{ groupId }}</p>

                    <!-- 按钮组 -->
                    <div class="flex flex-wrap gap-4 justify-center mt-4">
                        <label for="my_modal_7" class="btn btn-warning w-40" @click="openWordModal">
                            open modal
                        </label>
                        <button class="btn btn-info w-40" @click="isMemory = true">Begin</button>
                    </div>
                </div>

                <!-- 右侧：分组选择 占 1/3 -->
                <GroupSelector
                    :group-amount="groupAmount"
                    :group-id="groupId"
                    @select-group="optionWords"
                />
            </div>
        </div>
    </div>

    <!--    弹窗-->
    <input id="my_modal_7" type="checkbox" class="modal-toggle" />
    <div class="modal" role="dialog">
        <div v-if="isShowWords" class="modal-box w-[90%] max-w-4xl max-h-[80vh]">
            <ul class="list bg-base-200 rounded-box shadow-md">
                <li
                    v-for="item in displayedWords"
                    :key="item.word"
                    class="list-row grid grid-cols-2"
                >
                    <div class="text-2xl font-bold tabular-nums">{{ item.word }}</div>
                    <!-- 加一个 white-space:pre-wrap 即可 -->
                    <div class="text-2xl tabular-nums whitespace-pre-wrap">
                        {{ item.translation }}
                    </div>
                </li>
            </ul>
        </div>
        <div v-else class="modal-box flex flex-col items-center gap-2">
            <h1>No words</h1>
            <div class="btn w-40" @click="toAddWords">To add words</div>
        </div>

        <label class="modal-backdrop" for="my_modal_7" @click="closeDialog">Close</label>
    </div>
</template>

<style scoped></style>
