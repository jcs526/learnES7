import { ref, type Ref } from "vue";
import { defineStore, type StoreDefinition } from "pinia";

interface NumberIndexedObject {
  [index: number]: string | string[]; // 여기서 any 대신 더 구체적인 타입을 사용할 수 있습니다.
}

export const useMainStore: StoreDefinition = defineStore("main", () => {
  const isShake: Ref<boolean> = ref(false);


  const currentChapter: Ref<number> = ref(1);
  const totalChapter: Ref<number> = ref(20);

  const defaultQuery = ref({
    1: { query: { match_all: {} } },
    2: { query: { match: { customer_full_name: "" }, }, _source: ["customer_full_name"] },
    3: { query: { match: { customer_full_name: "" }, }, _source: ["customer_full_name"] },
    4: { query: { match: { customer_full_name: "" }, }, _source: ["customer_full_name"] },
  });

  const explain: Ref<NumberIndexedObject> = ref({
    1: "Elasticsearch7 쿼리 학습에 오신 것을 환영합니다!\n이 사이트는 Elasticsearch7의 쿼리 학습을 돕기 위한 게임입니다.",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
    10: "",
    11: "",
    12: "",
    13: "",
    14: "",
    15: "",
    16: "",
    17: "",
    18: "",
    19: "",
    20: "",
  });


  const hints: Ref<NumberIndexedObject> = ref({
    1: [
      "Elasticsearch는 REST API를 통해 접근할 수 있습니다.",
      "Elasticsearch의 모든 쿼리와 결과는 JSON 형태로 이루어져 있습니다.",
      `기본적으로 ${JSON.stringify({ query: {} }, null, 4)} 구조를 가지고 있습니다.`,
      "<i>제출을 클릭해보세요.</i>"
    ],
    2: [
      "Elasticsearch의 텍스트 검색은 크게 유사일치와 완벽일치로 나뉩니다.",
      "match 쿼리는 검색어에 대해 분석과정을 수정해 텍스트를 토큰화한 뒤 검색에 사용합니다.",
      "match에서 'Eddie Underwood'와 같은 값은 'Eddie', 'eddie', 'Underwood', 'underwood 4가지 검색어 전부로 검색가능합니다.",
      "<i>match 쿼리로 customer_full_name 필드가 'Bailey'인 문서를 검색하세요. </i>"
    ],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: [],
    17: [],
    18: [],
    19: [],
    20: [],
  });

  const resultData: Ref<NumberIndexedObject> = ref({});

  const canNext: Ref<Boolean> = ref(false);

  return { isShake, currentChapter, totalChapter, defaultQuery, explain, hints, resultData, canNext };
});
