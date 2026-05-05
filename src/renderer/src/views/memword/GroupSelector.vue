<script setup>
import { nextTick } from 'vue'

const props = defineProps({
    groupId: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['select-group'])

function optionWords(data) {
    emit('select-group', data)
}

function locationGroup() {
    nextTick(() => {
        const targetElement = document.getElementById(`group-${props.groupId}`)
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }
    })
}
</script>

<template>
    <div
        class="w-85 h-full bg-base-200 rounded-box p-5 shadow-sm flex flex-col items-center"
        style="position: relative; height: 100%; overflow: hidden"
    >
        <button class="btn btn-primary w-40" @click="locationGroup">Location</button>

        <ul class="list w-full flex flex-col absolute top-20 bottom-5 overflow-y-auto">
            <li
                v-for="i in 100"
                :id="`group-${i}`"
                :key="i"
                class="list-row w-full block"
            >
                <div class="flex w-full !justify-between items-center">
                    <div class="text-3xl tabular-nums">Group{{ i }}</div>
                    <div
                        class="btn w-32 text-xl btn-outline"
                        :class="i === groupId ? 'btn-active' : 'btn-outline'"
                        @click="optionWords(i)"
                    >
                        选择
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
