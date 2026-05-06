<script setup>
import Voice from '../../components/Voice.vue'

defineProps({
    currentIndex: {
        type: Number,
        required: true
    },
    initIndex: {
        type: Number,
        required: true
    },
    groupSize: {
        type: Number,
        required: true
    },
    word: {
        type: String,
        default: ''
    },
    translation: {
        type: String,
        default: ''
    },
    showTrans: {
        type: Boolean,
        default: false
    },
    openVoice: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits([
    'exit-memory',
    'unknown',
    'show-translation',
    'next-word',
    'update:showVoice',
    'speak'
])
</script>

<template>
    <div class="flex flex-col justify-center items-center h-full w-full gap-10">
        <div class="card bg-base-200 w-6/8 min-w-200 shadow-sm flex flex-col gap-50">
            <div class="card-body w-full flex-row items-center gap-6">
                <div class="badge badge-neutral">
                    {{ currentIndex + 1 - initIndex }}/{{ groupSize }}
                </div>
                <progress
                    class="progress progress-neutral w-full"
                    :value="currentIndex + 1 - initIndex"
                    :max="groupSize"
                ></progress>
                <button class="btn btn-neutral" @click="emit('exit-memory')">Back</button>

                <Voice :show-voice="openVoice" @set-voice="(v) => emit('update:showVoice', v)" />
            </div>
        </div>

        <div class="card bg-base-200 w-6/8 min-w-200 min-h-100 h-3/5 flex flex-col items-between shadow-sm">
            <div class="card-body flex flex-col justify-between" @click="emit('speak', word)">
                <h2 class="card-title justify-center text-5xl">{{ word }}</h2>
                <h2 class="card-title justify-center text-4xl whitespace-pre-wrap">
                    {{ showTrans ? translation : '' }}
                </h2>
            </div>
            <div class="card-body px-10 pb-10 flex flex-row justify-between items-end">
                <button class="btn btn-error w-40" @click="emit('unknown')">Don't Know</button>

                <button class="btn btn-info w-40" @click="emit('show-translation')">
                    Show Translation
                </button>
                <button class="btn btn-info w-40" @click="emit('next-word')">Next</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
