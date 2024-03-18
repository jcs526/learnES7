<template>
    <div class="editor-wrapper">
        <div class="button-wrapper">
            <button class="submit" :class="{ pulse_animation: !canNext }" v-if="!canNext" @click="handleSubmit">제출</button>
            <button class="next animation" style="display: inline-block;" v-else-if="canNext"
                @click="handleNext">다음</button>
            <button class="formatting" @click="handleFormatting">format</button>
            <button class="formatting" @click="handleReset">초기화</button>
        </div>
        <div ref="editorRef" class="editor" :class="{ 'editor-shake-container': isShake }" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import axios from "axios";
const apiUrl: string = import.meta.env.VITE_API_URL;
const apiInstance = axios.create({
    baseURL: apiUrl,
});

import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
import "monaco-editor/esm/vs/basic-languages/xml/xml.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";


import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";

const mainStore = useMainStore();

const editorRef = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor;

const { isShake, currentChapter, totalChapter, resultData, sampleData, canNext, defaultQuery } = storeToRefs(mainStore);

onMounted((): void => {
    if (editorRef.value) {
        // 참조 레퍼런스 : https://github.com/microsoft/monaco-editor/issues/2122
        window.MonacoEnvironment = {
            getWorker(_: string, label: string) {
                if (label === "typescript" || label === "javascript") return new TsWorker();
                if (label === "json") return new JsonWorker();
                if (label === "css") return new CssWorker();
                if (label === "html") return new HtmlWorker();
                return new EditorWorker();
            }
        };
        monaco.editor.defineTheme("myTheme", {
            base: "vs",
            inherit: true,
            rules: [],
            colors: {
                "editor.foreground": "#000000",
                "editor.background": "#EDF9FA",
                "editorCursor.foreground": "#8B0000",
                "editor.lineHighlightBackground": "#0000FF20",
                "editorLineNumber.foreground": "#008800",
                "editor.selectionBackground": "#88000030",
                "editor.inactiveSelectionBackground": "#88000015",
            },
        });
        monaco.editor.setTheme("myTheme");
        editor = monaco.editor.create(editorRef.value, {
            value: JSON.stringify(defaultQuery.value[currentChapter.value], null, 4),
            language: "json",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            showFoldingControls: "always",
            quickSuggestions: false
        });
        // 컨트롤+스페이스에 대한 액션 비활성화
        editor.addAction({
            id: "disable-ctrl-space",
            label: "Disable Ctrl+Space",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space],
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.5,
            run: function () {
            }
        });
        editor.addAction({
            id: "submit-action",
            label: "Submit Query",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            run: handleSubmit
        });

    }
});

const isWait = ref(false);
// 정답 제출
const handleSubmit = async (): Promise<void> => {
    if (editor && !isShake.value && !isWait.value) {
        isWait.value = true;
        const userQuery = editor.getValue(); // 에디터에서 텍스트 추출

        try {
            const parseQuery: object = JSON.parse(userQuery);



            const url: string = `/learn-es7/answer/${currentChapter.value}`;
            console.log(url);

            const option = {
                method: "POST",
                url,
                data: parseQuery
            };

            const res = await apiInstance(option);

            console.log(res.data);

            const isCanNext = res.data.isCorrect;

            resultData.value = res.data.elasticRes;

            console.log("isCanNext", isCanNext);

            if (isCanNext) {
                canNext.value = true;
            } else {
                canNext.value = false;
                isShake.value = true;
                setTimeout(() => {
                    isShake.value = false;
                }, 1000);
            }

        } catch (error) {
            console.log(error);
            resultData.value = { message: "invalid query" };
            isShake.value = true;
            setTimeout(() => {
                isShake.value = false;
            }, 1000);
        } finally {
            setTimeout(() => {
                isWait.value = false;
            }, 1000);
        }
    }
};

const handleFormatting = (): void => {
    if (editor && !isShake.value) {
        const userQuery = editor.getValue(); // 에디터에서 텍스트 추출
        try {
            // JSON 키에 쌍따옴표 추가
            const addedQuotesJSON = addQuotesToJsonKeys(userQuery);
            // JSON 파싱 및 정렬
            const parseQuery = JSON.parse(addedQuotesJSON);
            // JSON을 문자열로 변환하면서 불필요한 여백의 쉼표를 제거
            editor.setValue(JSON.stringify(parseQuery, null, 4));
        } catch (error) {
            isShake.value = true;
            setTimeout(() => {
                isShake.value = false;
            }, 1000);
        }
    }
};

const addQuotesToJsonKeys = (str: string): string => {
    // 키에 쌍따옴표를 추가합니다.
    let formattedStr = str.replace(/([{\s,])(\w+)(?=:)/g, "$1\"$2\"");

    // 배열이나 객체의 마지막 요소 뒤의 불필요한 쉼표를 제거합니다.
    formattedStr = formattedStr.replace(/,(\s*[}\]])/g, "$1");

    return formattedStr;
};

const handleReset = (): void => {
    editor.setValue(JSON.stringify(defaultQuery.value[currentChapter.value], null, 4));
};

const handleNext = (): void => {
    if (currentChapter.value < totalChapter.value) {
        currentChapter.value += 1;
    }
    canNext.value = false;
};

watch(canNext, newValue => {
    if (newValue === false) {
        resultData.value = sampleData.value;
    }
});

watch(currentChapter, () => {
    editor.setValue(JSON.stringify(defaultQuery.value[currentChapter.value], null, 4));
});

</script>

<style scoped>
.editor {
    width: 100vh;
    min-height: 500px;
}

.margin-view-overlays {
    background-color: #eee;
}

button {
    border: none;
    border-radius: 4px;
    height: 30px;
    font-size: 16px;
    font-family: 'Do Hyeon', sans-serif;
    margin-top: 15px;
}

.submit {
    width: 50px;
}

.formatting {
    width: 70px;
    margin-left: 10px;
}

.next {
    float: right;
    width: 50px;
    margin-left: 10px;
    background-color: #F12D22;
    color: white;
}

@keyframes tada {
    from {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1)
    }

    10%,
    20% {
        -webkit-transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg);
        transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)
    }

    30%,
    50%,
    70%,
    90% {
        -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)
    }

    40%,
    60%,
    80% {
        -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)
    }

    100% {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1)
    }
}

@keyframes pulse {
    from {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1)
    }

    50% {
        -webkit-transform: scale3d(1.1, 1.1, 1.1);
        transform: scale3d(1.1, 1.1, 1.1)
    }

    100% {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1)
    }
}

.pulse {
    -webkit-animation-name: pulse;
    animation-name: pulse
}

.pulse_animation {
    animation: pulse 2s infinite 2s;
}

.animation {
    animation: tada 1s, pulse 2s infinite 2s;
}

.button-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
}

.editor-wrapper {
    flex-basis: 240px;
    margin-top: -65px;
    /* Adjust based on actual button width */
}
</style>
