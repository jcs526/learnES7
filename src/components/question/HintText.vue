<!-- eslint-disable max-len -->
<template>
    <div class="content-wrapper">
        <div class="hint-wrapper">
            <div class="hint-header">
                <div class="title"> {{ title }}</div>
                <div class="chapter">
                    <span @click="handleLeftArrow">&lt;=</span> {{ currentChapter }} / {{ totalChapter }} <span
                        @click="handleRightArrow">=&gt;</span>
                </div>
            </div>
            <div class="explain">{{ explain[currentChapter] }}</div>
            <div class="hint">
                <li v-for="(hint, index) in hints[currentChapter]" :class="{ 'no-marker': hint.startsWith('<i') }"
                    :key="index" v-html="hint"></li>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
// 헤더 관련 로직
const title: Ref<string> = ref("Elasticsearch7 쿼리 학습");
// 챕터 관련 로직



// 텍스트 관련 로직
const mainStore = useMainStore();
const { hints, explain, currentChapter, totalChapter, canNext, transitionKey } = storeToRefs(mainStore);

const handleLeftArrow = (): void => {
    if (currentChapter.value > 1) {
        currentChapter.value -= 1;
        canNext.value = false;
        transitionKey.value++;
    }
};
const handleRightArrow = (): void => {
    if (currentChapter.value < totalChapter.value) {
        currentChapter.value += 1;
        canNext.value = false;
        transitionKey.value++;
    }
};

</script>

<style scoped>
.hint-wrapper {
    color: white;
    font-family: 'Do Hyeon', sans-serif;
    font-weight: 6.0;
    flex-grow: 1;
}

.content-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.hint-header {
    display: flex;
    justify-content: space-between;
    margin-right: 30px;
    user-select: none;
}

.title {
    margin: 0;
    font-size: 50px;
}

.chapter {
    font-size: 40px;
}

.explain {
    font-size: 25px;
    white-space: pre-wrap;

}

.hint {
    margin: 15px 0;
    font-size: 20px;
}

.hint :deep(b) {
    color: hsl(48, 100%, 50%);
    font-family: 'Do Hyeon', sans-serif;
    /* color: rgb(0, 0, 255); */
}

.no-marker {
    width: calc(100% - 225px)
}
</style>