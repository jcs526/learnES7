<template>
    <div ref="editorRef" class="editor" :class="{ 'editor-shake-container': isShake }"></div>
    <button class="submit" @click="handleSubmit">제출</button>
    <button class="formatting" @click="handleFormatting">format</button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import axios from "axios";

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

const defaultQuery = ref({ query: { match_all: true } });

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
            value: JSON.stringify(defaultQuery.value, null, 4),
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
    }
});

const { isShake, currentChapter } = storeToRefs(mainStore);
// 정답 제출
const handleSubmit = async (): Promise<void> => {
    if (editor && !isShake.value) {
        const userQuery = editor.getValue(); // 에디터에서 텍스트 추출

        try {
            const parseQuery: object = JSON.parse(userQuery);

            const apiUrl: string = import.meta.env.VITE_API_URL;
            console.log(apiUrl);


            const option = {
                method: "POST",
                url: `${apiUrl}/answer/${currentChapter.value}`,
                data: parseQuery
            };

            const res = await axios(option);

            console.log(res.data);


        } catch (error) {
            console.log(error);

            isShake.value = true;
            setTimeout(() => {
                isShake.value = false;
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



</script>

<style>
.editor {
    width: 100vh;
    height: 50%;
}

.margin-view-overlays {
    background-color: #eee;
}

.submit {
    width: 50px;
    height: 30px;
    font-family: 'Do Hyeon', sans-serif;
    margin-top: 15px;
    font-size: 16px;
}

.formatting {
    width: 70px;
    height: 30px;
    font-family: 'Do Hyeon', sans-serif;
    margin-top: 15px;
    font-size: 16px;
    margin: 0 10px;
}
</style>
