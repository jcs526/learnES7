<template>
    <div class="answer-container">
        <transition name="fade-slide-up" mode="out-in">
            <div v-if="resultData.hits" :key="transitionKey">
                <json-viewer :value="resultData" :expand-depth=10 copyable />
            </div>
            <div v-else :key="`default-${transitionKey}`">
                <div class="document-sample">문서 샘플</div>
                <json-viewer :value="resultData" :expand-depth=10 copyable />
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import JsonViewer from "vue-json-viewer";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { onMounted, watchEffect } from "vue";

const mainStore = useMainStore();
const { resultData, sampleData, transitionKey } = storeToRefs(mainStore);

onMounted(() => {
    resultData.value = sampleData.value;
});


watchEffect(() => {
    if (resultData.value) {
        transitionKey.value++; // resultData가 변경될 때마다 키 값을 증가
    }
});
</script>

<style scoped>
.answer-container {
    /* height: 100vh;
    overflow: auto; */
}

.document-sample {
    margin-left: 25px;
    margin-top: 25px;
}

/* 트랜지션 스타일 */
.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-slide-up-enter,
.fade-slide-up-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
