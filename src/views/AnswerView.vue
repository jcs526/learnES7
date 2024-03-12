<template>
    <div style="height: 100vh; overflow: auto;">
        <json-viewer v-if="resultData.hits" :value="resultData" :expand-depth=10 copyable>
        </json-viewer>
        <div v-else>
            <div style="margin-left:25px; margin-top: 25px;">문서 샘플</div>
            <json-viewer :value="resultData" :expand-depth=10 copyable>
            </json-viewer>
        </div>
    </div>
</template>
<script setup lang="ts">
import JsonViewer from "vue-json-viewer";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";

const mainStore = useMainStore();
const { resultData } = storeToRefs(mainStore);
</script>
<style scoped></style>