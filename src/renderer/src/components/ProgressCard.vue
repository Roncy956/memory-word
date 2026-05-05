<script setup>
const props = defineProps({
    finishCount: {
        type: Number,
        required: true
    },
    totalCount: {
        type: Number,
        required: true
    }
})
</script>

<template>
    <a href="#" class="hover-3d cursor-pointer justify-center">
        <div
            class="card w-96 bg-olive-600 text-white bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)] bg-size-[4.95em_4.95em]"
        >
            <div class="card-body">
                <div class="flex item-between">
                    <div class="font-bold">
                        已完成 {{ props.finishCount }} 单词，共 {{ props.totalCount }}单词
                    </div>
                </div>
            </div>
        </div>

        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </a>
</template>

<style scoped></style>
