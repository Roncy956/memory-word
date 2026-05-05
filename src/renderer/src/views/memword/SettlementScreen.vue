<script setup>
defineProps({
    isFinished: {
        type: Boolean,
        required: true
    },
    unKnowWords: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['exit-memory', 'next-group', 'restart', 'speak-word'])

function openWordModal() {
    const modal = document.getElementById('my_modal_2')
    if (modal) {
        modal.showModal()
    }
}
</script>

<template>
    <div class="settlement">
        <div class="card bg-base-200 w-full h-full shadow-sm">
            <div class="card-body h-full flex-col">
                <div class="card-body h-full flex-col gap-20">
                    <h2 class="card-title justify-center text-5xl">
                        {{ isFinished ? '本组单词已完成' : '本组单词未完成' }}
                    </h2>
                    <h2 class="card-title justify-center text-4xl">
                        {{ isFinished ? '继续下组单词或退出' : '请重新开始' }}
                    </h2>
                </div>
                <div class="card-body">
                    <div class="navbar">
                        <div class="navbar-start">
                            <button class="btn btn-error w-40" @click="emit('exit-memory')">Exit</button>
                        </div>

                        <div v-if="!isFinished" class="navbar-center">
                            <button class="btn btn-info w-40" @click="openWordModal">Show</button>
                            <dialog id="my_modal_2" class="modal">
                                <div
                                    class="modal-box"
                                    style="max-height: 80vh; width: 800px; max-width: none"
                                >
                                    <ul class="list bg-base-200 rounded-box shadow-md">
                                        <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
                                            Click to listen to the pronunciation
                                        </li>
                                        <li
                                            v-for="item in unKnowWords"
                                            :key="item.word"
                                            class="list-row grid grid-cols-2"
                                            @click="emit('speak-word', item.word)"
                                        >
                                            <div class="text-2xl font-bold tabular-nums">
                                                {{ item.word }}
                                            </div>
                                            <div class="text-2xl tabular-nums">
                                                {{ item.trans }}
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <form method="dialog" class="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>
                        </div>

                        <div class="navbar-end">
                            <button v-if="isFinished" class="btn btn-info w-40" @click="emit('next-group')">
                                Next
                            </button>
                            <button v-else class="btn btn-info w-40" @click="emit('restart')">
                                Restart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.settlement {
    display: flex;
    flex: 1;
    margin: 50px 100px 80px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}
</style>
