<script setup>
import GetJsonFile from './GetJsonFile.vue'

const emit = defineEmits(['get-words'])

function emitGetWords(data) {
    emit('get-words', data)
}
</script>

<template>
    <div class="hero bg-base-200 flex-1">
        <div class="hero-content flex-row">
            <div class="hero-content w-full flex-col">
                <a class="btn btn-neutral text-xl shadow-sm">Memory Words</a>
                <ul class="list bg-base-100 rounded-box shadow-md">
                    <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Word Gloss</li>
                    <li class="list-row w-max">
                        <div class="text-4xl font-thin opacity-30 tabular-nums">01</div>
                        <div class="list-col-grow">
                            <div>Day01</div>
                            <div class="text-xs uppercase font-semibold opacity-60">
                                ======day01======
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="hero-content w-full flex-col">
                <GetJsonFile @get-words="emitGetWords" />
            </div>

            <!--            解析docx文件-->
            <!--            <div class="hero-content w-full flex-col">-->
            <!--                <GetDocxFile @get-words="emitGetWords" />-->
            <!--            </div>-->
        </div>
    </div>
</template>

<style scoped></style>
