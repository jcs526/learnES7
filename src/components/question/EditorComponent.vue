<template>
    <div class="editor-wrapper">
        <div ref="editorRef" class="editor" :class="{ 'editor-shake-container': isShake }"></div>
        <button class="submit" :class="{ pulse_animation: !canNext }" @click="handleSubmit">제출</button>
        <button class="formatting" @click="handleFormatting">format</button>
        <button class="formatting" @click="handleReset">초기화</button>
        <button class="next animation" v-if="canNext" @click="handleNext">다음</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
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

const { isShake, currentChapter, totalChapter, resultData, canNext, defaultQuery } = storeToRefs(mainStore);

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
                url: `${apiUrl}/learn-es7/answer/${currentChapter.value}`,
                data: parseQuery
            };

            const res = await axios(option);

            console.log(res.data);

            resultData.value = res.data;

            const isCanNext = gradingResult(currentChapter.value, res.data, parseQuery);
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

interface ESdata {
    "category"?: string[]
    "currency"?: string,
    "customer_first_name"?: string,
    "customer_full_name"?: string,
    "customer_gender"?: string,
    "customer_id"?: number,
    "customer_last_name"?: string,
    "customer_phone"?: string,
    "day_of_week"?: string,
    "day_of_week_i"?: number,
    "email"?: string,
    "manufacturer"?: string[],
    "order_date"?: string,
    "order_id"?: number,
    "products"?: product[],
    "sku"?: string[],
    "taxful_total_price": number,
    "taxless_total_price"?: number,
    "total_quantity"?: number,
    "total_unique_products"?: number,
    "type"?: string,
    "user"?: string,
    "geoip"?: {
        "country_iso_code"?: string,
        "location"?: {
            "lon"?: number,
            "lat"?: number
        },
        "region_name"?: string,
        "continent_name"?: string,
        "city_name"?: string
    },
    "event"?: {
        "dataset"?: string
    }
}

interface product {
    "base_price"?: number,
    "discount_percentage"?: number,
    "quantity"?: number,
    "manufacturer"?: string,
    "tax_amount"?: number,
    "product_id"?: number,
    "category"?: string
    "sku"?: string,
    "taxless_price"?: number,
    "unit_discount_amount"?: number,
    "min_price"?: number,
    "_id"?: string,
    "discount_amount"?: number,
    "created_on"?: string,
    "product_name"?: string,
    "price"?: number,
    "taxful_price"?: number,
    "base_unit_price"?: number
}

interface EsRes {
    hits: {
        hits: { _source: ESdata }[]
    }
}
const gradingResult = (chapter: number, data: EsRes, parseQuery: any): boolean => {
    if (data?.hits?.hits?.length === 0 && chapter < 16) {
        return false;
    }
    const dataList = data?.hits?.hits.map((v: { _source: ESdata }) => v._source);
    // 각 챕터에 맞는 데이터를 가져왔는지 확인후 채점
    if (chapter === 1) {
        return true;
    } else if (chapter === 2) {
        // match 쿼리로 customer_full_name 필드가 'Bailey'인 문서를 검색하세요.
        return dataList.every((data: ESdata): boolean => !!data?.customer_full_name?.includes("Bailey"));
    } else if (chapter === 3) {
        //customer_full_name.keyword를 이용하여 customer_full_name 필드가 Eddie Underwood인 문서를 검색하세요.
        return !!dataList.find((data: ESdata): boolean => data.customer_full_name === "Eddie Underwood");
    } else if (chapter === 4) {
        //taxful_total_price 필드의 값이 1000 이상인 문서를 검색하세요.
        return dataList.every((data: ESdata): boolean => data.taxful_total_price > 1000);
    } else if (chapter === 5) {
        //customer_full_name 필드에서 'Mary'가 포함되어 있으면서 'Bailey'는 포함되지 않는 문서를 검색하세요.
        return dataList.every((data: ESdata): boolean => !!(data?.customer_full_name?.includes("Mary") && !data.customer_full_name.includes("Bailey")));
    } else if (chapter === 6) {
        //email 필드의 값이 정확히 'gwen@butler-family.zzz'이면서 taxful_total_price 필드 값이 100 이상인 문서를 검색하세요.
        return dataList.every((data: ESdata): boolean => data.taxful_total_price > 100 && data.email === "gwen@butler-family.zzz");
    } else if (chapter === 7) {
        //1. customer_full_name 필드 값이 Oliver Rios 이거나
        //2. day_of_week 필드값이 'Monday'이거나
        //3. taxful_total_price 필드의 값이 1000 초과
        //위 조건중 2개이상을 만족하는 문서를 검색하세요.
        return dataList.every((data: ESdata): boolean => {
            let conut = 0;

            if (data.customer_full_name === "Oliver Rios") {
                conut += 1;
            }
            if (data.day_of_week === "Monday") {
                conut += 1;
            }
            if (data.taxful_total_price > 1000) {
                conut += 1;
            }
            console.log(conut);


            if (conut >= 2) {
                return true;
            } else {
                return false;
            }
        });
    } else if (chapter === 9) {
        return dataList.every((data: ESdata): boolean => !!(data?.manufacturer?.includes("Elitelligence") || data?.manufacturer?.includes("Pyramidustries")));
    } else if (chapter === 10) {
        return dataList.every((data: ESdata): boolean => /^r.*bb.*$/.test(data.user || "rbb"));
    } else if (chapter === 11) {
        return dataList.every((data: ESdata): boolean => Object.hasOwnProperty.call(data, "email"));
    } else if (chapter === 12) {
        return dataList.every((data: ESdata): boolean => !!(data.customer_first_name?.includes("Eddie") || data.customer_last_name?.includes("Eddie") || data.email?.includes("Eddie")));
    } else if (chapter === 13) {
        return parseQuery.from === 5 && parseQuery.size === 30;
    } else if (chapter === 14) {
        return dataList.every((data: ESdata): boolean => {
            const fields = Object.keys(data);
            if (fields.length === 0) {
                return false;
            }
            if (fields.every(field => /^customer_/.test(field) && !/_id$/.test(field))) {
                return true;
            } else {
                return false;
            }
        });
    } else if (chapter === 15) {
        for (let i = 0; i < dataList.length - 1; i++) {
            const currentDate = dataList[i].order_date ?? "";
            const nextDate = dataList[i + 1].order_date ?? "";

            if (currentDate < nextDate) {
                return false;  // 내림차순이 아니면 false 반환
            }
        }
        return true;
    } else if (chapter === 16 || chapter === 17 || chapter === 18) {
        return true;
    }
    return false;
};

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
</style>
