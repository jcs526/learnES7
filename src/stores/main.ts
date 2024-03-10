import { ref, type Ref } from "vue";
import { defineStore, type StoreDefinition } from "pinia";

interface NumberIndexedObject {
  [index: number]: string | string[]; // 여기서 any 대신 더 구체적인 타입을 사용할 수 있습니다.
}

export const useMainStore: StoreDefinition = defineStore("main", () => {
  const isShake: Ref<boolean> = ref(false);


  const currentChapter: Ref<number> = ref(1);
  const totalChapter: Ref<number> = ref(20);


  const explain: Ref<NumberIndexedObject> = ref({
    1: "Elasticsearch7 쿼리 학습에 오신 것을 환영합니다!\n이것은 Elasticsearch7의 쿼리 학습을 돕기 위한 게임입니다.",
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
    1: ["힌트<br/>&nbsp;&nbsp;&nbsp;<b>123</b>", "힌트2", "힌트3"],
    2: [],
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

  return { isShake, currentChapter, totalChapter, explain, hints };
});
