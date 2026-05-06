<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import PracticeCard from './PracticeCard.vue'
import SettlementScreen from './SettlementScreen.vue'

const showTrans = ref(false)
const beginMemory = ref(true)
const openVoice = ref(true)
const isFinished = ref(true)

const word = ref('')
const translation = ref('')
const index = ref(0)
const countUnKnown = ref(0)
const unKnowWords = ref([])

const memoryWords = ref([])
import initWords from '../../json/exp.json'

const props = defineProps({
    initIndex: {
        type: Number,
        required: true
    },
    words: {
        type: Array,
        default: null
    },
    groupSize: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['exit-memory', 'next-group'])

// 更新当前的单词和翻译
function updateWordAndTrans() {
    word.value = memoryWords.value[index.value].word
    translation.value = memoryWords.value[index.value].translation
}

// 返回
function exitMemory() {
    emit('exit-memory')
}

// 控制单词发音
// 播放有道单词发音（替换原生语音）
async function speakWord(value) {
    if (!openVoice.value) return
    if (!value) return

    // 英美发音切换：type=1 英式，type=2 美式
    const voiceType = 2 // 1=英音 2=美音，你可以自由改
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(value)}&type=${voiceType}`

    const audio = new Audio(audioUrl)
    audio.play().catch((err) => {
        console.log('发音播放失败:', err)
    })
}

// 不认识按键
function unKnown() {
    countUnKnown.value = countUnKnown.value + 1
    const data = {
        word: word.value,
        trans: translation.value
    }
    unKnowWords.value.push(data)
    if (showTrans.value === false) {
        showTrans.value = true
        speakWord(word.value)
    } else {
        nextWord()
    }
}

// 显示翻译按键
function showTranslation() {
    showTrans.value = true
}

// 下一个单词按键
function nextWord() {
    if (index.value - props.groupSize + 1 === props.initIndex) {
        isFinished.value = countUnKnown.value === 0
        beginMemory.value = false
        return
    }
    index.value = index.value + 1
    updateWordAndTrans()
    showTrans.value = false
}

// 下一组单词
async function nextGroup() {
    await emit('next-group')
    beginMemory.value = true
    showTrans.value = false
    updateWordAndTrans()
    countUnKnown.value = 0
    unKnowWords.value = []
}

// 重新开始
function restart() {
    index.value = props.initIndex
    beginMemory.value = true
    showTrans.value = false
    updateWordAndTrans()
    countUnKnown.value = 0
    unKnowWords.value = []
}

function setVoice(value) {
    openVoice.value = value
}

function handleGlobalKeydown(event) {
    if (event.key === 'ArrowUp' && beginMemory.value) showTranslation()
    if (event.key === 'ArrowUp' && !beginMemory.value && !isFinished.value) openWordModal()

    if (event.key === 'ArrowRight') {
        if (beginMemory.value) {
            nextWord()
        } else {
            if (isFinished.value) nextGroup()
            else restart()
        }
    }

    if (event.key === 'ArrowLeft') {
        if (beginMemory.value) unKnown()
        else exitMemory()
    }
    if (event.key === 'ArrowDown') speakWord(word.value)
}

onMounted(() => {
    if (props.words.length === 0) {
        memoryWords.value = initWords
    } else {
        memoryWords.value = props.words
    }

    index.value = props.initIndex
    updateWordAndTrans()
    document.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleGlobalKeydown)
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
    }
})

watch(
    () => props.initIndex,
    () => {
        index.value = props.initIndex
    }
)

watch(
    () => word.value,
    () => {
        speakWord(word.value)
    }
)

// 为了解决安全
function openWordModal() {
    const modal = document.getElementById('my_modal_2')
    if (modal) {
        modal.showModal()
    }
}

// watch(
//   () => props.words,
//   () => {
//     memoryWords.value = props.words
//     updateWordAndTrans()
//     speakWord()
//     console.log('===')
//   }
// )
</script>

<template>
    <PracticeCard
        v-if="beginMemory"
        :current-index="index"
        :init-index="props.initIndex"
        :group-size="props.groupSize"
        :word="word"
        :translation="translation"
        :show-trans="showTrans"
        :open-voice="openVoice"
        @exit-memory="exitMemory"
        @unknown="unKnown"
        @show-translation="showTranslation"
        @next-word="nextWord"
        @update:show-voice="setVoice"
        @speak="speakWord"
    />
    <SettlementScreen
        v-else
        :is-finished="isFinished"
        :un-know-words="unKnowWords"
        @exit-memory="exitMemory"
        @next-group="nextGroup"
        @restart="restart"
        @speak-word="speakWord"
    />
</template>

<style scoped></style>
