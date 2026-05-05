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
    <div class="main">
        <div class="card bg-base-200 w-full shadow-sm">
            <div class="card-body h-full flex-row items-center gap-6">
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

        <div class="card bg-base-200 w-full h-full shadow-sm">
            <div class="card-body h-full flex-col gap-10" @click="emit('speak', word)">
                <h2 class="card-title justify-center text-5xl">{{ word }}</h2>
                <h2 class="card-title justify-center text-4xl">
                    {{ showTrans ? translation : '' }}
                </h2>
            </div>
            <div class="card-body">
                <div class="navbar">
                    <div class="navbar-start">
                        <button class="btn btn-error w-40" @click="emit('unknown')">Don't Know</button>
                    </div>
                    <div v-if="!showTrans" class="navbar-center">
                        <button class="btn btn-info w-40" @click="emit('show-translation')">
                            Show Translation
                        </button>
                    </div>
                    <div class="navbar-end">
                        <button class="btn btn-info w-40" @click="emit('next-word')">Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main {
    display: flex;
    flex: 1;
    margin: 50px 100px 80px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}
</style>
