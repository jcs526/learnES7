import { ref, type Ref } from "vue";
import { defineStore, type StoreDefinition } from "pinia";

interface NumberIndexedObject {
  [index: number]: string | string[]; // 여기서 any 대신 더 구체적인 타입을 사용할 수 있습니다.
}

export const useMainStore: StoreDefinition = defineStore("main", () => {
  const isShake: Ref<boolean> = ref(false);


  const currentChapter: Ref<number> = ref(1);
  const totalChapter: Ref<number> = ref(18);

  const defaultQuery = ref({
    1: { query: { match_all: {} } },
    2: { query: { match: { customer_full_name: "" }, }, _source: ["customer_full_name"] },
    3: { query: { term: { customer_full_name: "" }, }, _source: ["customer_full_name"] },
    4: {
      query: {
        range: {
          taxful_total_price: {

          }
        },
      }, _source: ["taxful_total_price"]
    },
    5: { query: { bool: { must: [{ match: {} }], must_not: [] } }, _source: ["customer_full_name"] },
    6: { query: { bool: { filter: [{ term: {} }] } }, _source: ["email", "taxful_total_price"] },
    7: { query: { bool: { should: [{ term: {} }], minimum_should_match: 1 } }, _source: ["customer_full_name", "day_of_week", "taxful_total_price"] },
    8: { query: { bool: { should: [{ term: {} }] } }, _source: ["customer_full_name", "day_of_week", "taxful_total_price"] },
    9: { query: { bool: { must: [{ terms: {} }] } }, _source: ["manufacturer"] },
    10: { query: { bool: { must: [{ wildcard: {} }] } }, _source: ["user"] },
    11: { query: { exists: { field: "" } }, _source: ["email"] },
    12: {
      query: {
        multi_match: {
          query: "",
          fields: []
        }
      },
      _source: [
        "customer_first_name",
        "customer_last_name",
        "email"
      ]
    }
    ,
    13: { query: { match_all: {} }, from: 0, size: 0 },
    14: { query: { match_all: {} }, _source: { include: [], exclude: [] } },
    15: {
      sort: {
        order_date: ""
      },
      _source: [
        "order_date"
      ]
    },
    16: {
      size: 0,
      _source: false,
      query: {
        range: {
          order_date: {
            gte: "now-30d/d",
            lte: "now/d"
          }
        }
      },
      aggs: {
        "원하는 통계 결과명": {
          min: {
            field: "taxful_total_price"
          }
        },
        최대치: {
          max: {
            field: "taxful_total_price"
          }
        },
        합계: {
          sum: {
            field: "taxful_total_price"
          }
        },
        평균: {
          avg: {
            field: "taxful_total_price"
          }
        },
        통합정보: {
          stats: {
            field: "taxful_total_price"
          }
        },
        필드종류수: {
          cardinality: {
            field: "taxful_total_price"
          }
        },
        퍼센테이지별결과: {
          percentiles: {
            field: "taxful_total_price",
            percents: [
              20,
              60,
              80
            ]
          }
        },
        지정한값의퍼센테이지: {
          percentile_ranks: {
            field: "taxful_total_price",
            values: [30, 50, 200]
          }
        }
      }
    },
    17: {
      size: 0,
      _source: false,
      query: {
        range: {
          order_date: {
            gte: "now-30d/d",
            lte: "now/d"
          }
        }
      },
      aggs: {
        "필드 데이터별 통계(size 없을시 상위 10개만)": {
          terms: {
            field: "day_of_week",
            size: 5
          }
        },
        "지정된 범위별 통계": {
          range: {
            field: "taxful_total_price",
            ranges: [
              {
                to: 30
              },
              {
                from: 30,
                to: 100
              },
              {
                from: 100
              }
            ]
          }
        },
        "지정된 간격크기별 통계": {
          histogram: {
            field: "total_quantity",
            interval: 2
          }
        },
        "지정된 범위별 통계(날짜)": {
          date_range: {
            field: "order_date",
            ranges: [
              {
                to: "2024-03-01"
              },
              {
                from: "2024-03-01",
                to: "2024-03-06"
              },
              {
                from: "2024-03-06"
              }
            ]
          }
        },
        "지정된 간격크기별 통계(날짜)": {
          date_histogram: {
            field: "order_date",
            interval: "3d"
          }
        }
      }
    },
    18: {
      size: 0,
      aggs: {
        "요일당 금액통계": {
          terms: {
            field: "day_of_week"
          },
          aggs: {
            avg_price: {
              avg: {
                field: "taxful_total_price"
              }
            }
          }
        }
      }
    },
    19: { query: { match: { customer_full_name: "" }, }, _source: ["customer_full_name"] },
    20: { query: { match: { customer_full_name: "" }, }, _source: ["customer_full_name"] },
  });

  const explain: Ref<NumberIndexedObject> = ref({
    1: "Elasticsearch7 쿼리 학습에 오신 것을 환영합니다!\n이 사이트는 Elasticsearch7의 쿼리 학습을 돕기 위한 간단한 예제입니다.",
    2: "Match 쿼리",
    3: "Term 쿼리",
    4: "Range 쿼리",
    5: "Boolean 쿼리 - must, must_not",
    6: "Boolean 쿼리 - filter",
    7: "Boolean 쿼리 - should",
    8: "중첩된 Boolean 쿼리",
    9: "Terms 쿼리",
    10: "Wildcard 쿼리",
    11: "Exists 쿼리",
    12: "multi_match",
    13: "from & size",
    14: "_source",
    15: "sort",
    16: "Aggregations - Metrics",
    17: "Aggregations - Bucket",
    18: "sub-aggregations"
  });


  const hints: Ref<NumberIndexedObject> = ref({
    1: [
      "Elasticsearch는 <b>REST API</b>를 통해 접근할 수 있습니다.",
      "Elasticsearch의 모든 쿼리와 결과는 <b>JSON</b> 형태로 이루어져 있습니다.",
      `기본적으로 <b>${JSON.stringify({ query: {} }, null, 4)}</b> 구조를 가지고 있습니다.`,
      "<i>제출을 클릭해보세요.(또는 Ctrl+Enter를 입력하세요.)</i>"
    ],
    2: [
      "Elasticsearch의 텍스트 검색은 크게 <b>유사일치</b>와 <b>완벽일치</b>로 나뉩니다.",
      "match 쿼리는 검색어에 대해 분석과정을 수행해 텍스트를 <b>토큰화</b>한 뒤 검색에 사용합니다.",
      "match 쿼리에서 'Eddie Underwood'와 같은 값은 'Eddie', 'eddie', 'Underwood', 'underwood 4가지 검색어 전부로 검색가능합니다.",
      "<i>match 쿼리로 customer_full_name 필드가 'Bailey'인 문서를 검색하세요. </i>"
    ],
    3: [
      "<b>Term 쿼리는 정확한 값을 필드에서 찾아 문서를 검색</b>합니다.",
      "정확한 단어나 숫자, 날짜 등을 찾고자 할 때 사용되며, 분석 과정을 거치지 않고 필드에 정확히 일치하는 값이 있는 문서를 찾습니다.",
      "<b>(중요)</b> Elasticsearch의 문자열 필드는 keyword와 text 타입으로 나뉩니다. text 타입은 토큰화되어 저장되고, keyword 타입은 그대로 저장됩니다",
      "<b>(중요)</b> 'Eddie Underwood'가 text로 저장될 때는 'Eddie'와 'Underwood'로 나뉘어 저장됩니다.",
      "<b>(중요)</b> Elasticsearch 역색인으로 작동합니다. 'Eddie Underwood'로 검색하였을 경우 text 타입으로 저장되었을 경우 역색인에 'Eddie Underwood'이 없습니다.",
      "<b>(중요)</b> 역색인에 존재하는 데이터는 'Eddie'와 'Underwood'만이 있습니다",
      "<b>(중요)</b> 일반적으로 text 타입으로 지정하는 필드는 keyword라는 하위필드가 존재합니다. <b>.keyword</b>로 접근가능합니다.",
      "<i>customer_full_name.keyword를 이용하여 customer_full_name 필드가 Eddie Underwood인 문서를 검색하세요.</i>"
    ],
    4: [
      "<b>Range 쿼리는 지정된 범위 내의 값들을 가진 문서</b>를 찾는 데 사용됩니다.",
      "예를 들어, 특정 날짜 이후 또는 특정 가격 범위 내의 제품을 찾고 싶을 때 사용할 수 있습니다.",
      "숫자, 날짜, 문자열 등 다양한 타입의 필드에 적용할 수 있습니다.",
      "<b>gte</b> : 이상, <b>lte</b> : 이하",
      "<b>gt</b> : 초과, <b>lt</b> : 미만",
      "<i>taxful_total_price 필드의 값이 100 이상인 문서를 검색하세요.</i>"
    ],
    5: [
      "<b>Boolean 쿼리는 논리 연산자(AND, OR, NOT)를 사용해 여러 검색 조건을 결합</b>합니다.",
      "예를 들어, 'document'를 포함하면서 'email'을 포함하지 않는 문서를 찾고 싶을 때 사용할 수 있습니다.",
      "이 쿼리를 통해 복잡한 검색 조건을 표현할 수 있습니다.",
      "Boolean 쿼리의 하위 필드들은 항상 <b>배열형태의 value</b>만 받습니다.",
      "<b>must</b> 쿼리는 지정된 조건을 만족하는 문서만 검색 결과에 포함됩니다.",
      "<b>must_not</b> 쿼리는 지정된 조건을 만족하지 않는 문서만 검색 결과에 포함됩니다.",
      "<i>customer_full_name 필드에서 'Mary'가 포함되어 있으면서 'Bailey'는 포함되지 않는 문서를 검색하세요.</i>"
    ],
    6: [
      "<b>filter 쿼리는 검색 결과를 필터링하여 특정 기준을 만족하는 문서</b>만을 결과로 반환합니다.",
      "filter 쿼리는 쿼리의 정확도를 높이고 성능을 개선하기 위해 사용됩니다.",
      "결과 값은 must와 같습니다. 대신 filter 쿼리는 score를 계산하지 않습니다.",
      "score 계산에는 키워드의 빈도, 문서의 길이, 쿼리와의 관련성 등 여러 요소를 기반으로 합니다.",
      "<b>(중요)</b> filter 쿼리의 결과는 점수 계산이 생략된 만큼 must 쿼리보다 빠르며 <b>캐싱</b>이 적용됩니다.",
      "<i>email 필드의 값이 정확히 'gwen@butler-family.zzz'이면서 taxful_total_price 필드 값이 100 이상인 문서를 검색하세요.</i>"
    ],
    7: [
      "<b>should 쿼리는 주어진 조건 중 하나 이상을 만족</b>하는 문서를 찾습니다.",
      "should 쿼리는 선택적 조건을 표현할 때 사용됩니다.",
      "must나 must_not 조건과 함께 사용하여 유연한 검색 조건을 구성할 수 있습니다.",
      "<b>minimum_should_match</b> 값을 이용하여 <b>최소 n개 이상의 조건</b>을 만족하는 문서를 검색할 수 있습니다",
      "<b>(중요)</b> minimum_should_match은 should만 있다면 기본값이 1이고 , <b>다른 bool 쿼리가 있다면 기본값이 0입니다(검색결과에 영향x)</b>",
      "<i>1. customer_full_name 필드 값이 Oliver Rios 이거나<br>2. day_of_week 필드값이 'Monday'이거나<br>3. taxful_total_price 필드의 값이 1000 초과<br>위 조건중 2개이상을 만족하는 문서를 검색하세요.</i>"
    ],
    8: [
      "must, must_not, filter, should 쿼리는 Boolean 쿼리를 조건으로 받을 수 있습니다.",
      "중첩된 Boolean 쿼리를 사용하면 여러 Boolean 쿼리를 결합하여 더 복잡한 검색 조건을 만들 수 있습니다.",
      "예를 들어, 특정 단어를 포함하면서 다른 단어는 포함하지 않는 문서를 찾되, 추가 조건으로 특정 범위의 날짜를 가진 문서를 찾는 것과 같은 조건을 정의할 수 있습니다.",
      "<i>&nbsp;</i>"
    ],
    9: [
      "<b>Terms 쿼리는 여러 개의 정확한 값을 동시에 검색</b>할 수 있습니다.",
      "예를 들어, 여러 개의 특정 ID나 키워드를 한 번에 검색하고 싶을 때 유용합니다.",
      "Terms 쿼리는 <b>{[fieldname]:Array[]}</b> 형태의 Object를 받으며, term과 마찬가지로 정확히 일치하는 값을 찾습니다. text 타입을 검색할 때는 <b>.keyword</b>를 붙여줘야 합니다.",
      "<i>manufacturer 필드의 값이 'Elitelligence' 또는 'Pyramidustries'인 문서를 검색하세요</i>"
    ],
    10: [
      "<b>Wildcard 쿼리를 사용하면 패턴 매칭을 통해 검색</b>을 수행할 수 있습니다.",
      "예를 들어, 텍스트의 일부만 알고 있을 때, <b>*</b>나 <b>?</b>와 같은 와일드카드 문자를 사용하여 검색할 수 있습니다.",
      "<i>user 필드의 값이 'r'로 시작하면서 중간에 'bb'가 들어간 문서를 검색하세요</i>"
    ],
    11: [
      "<b>Exists 쿼리는 특정 필드에 값이 존재하는 문서</b>만을 찾을 때 사용합니다.", "이는 필드의 존재 여부만을 판단하여 해당 필드가 있는 문서를 검색 결과로 반환합니다.",
      "<b>exists_not은 없습니다.</b> 필드가 존재하지 않는 경우의 검색을 원할 경우 must_not에 exists를 사용해야합니다.",
      "<i>email 필드가 있는 문서를 검색하세요.</i>"
    ],
    12: [
      "<b>multi_match 쿼리는 여러 필드에서 동시에 검색어에 대해 검색</b>합니다.", "이는 하나의 검색어를 다양한 필드에서 찾고 싶을 때 사용되며, 여러 필드에 걸쳐 있는 정보를 통합적으로 검색할 수 있게 해줍니다.",
      "<i>'customer_first_name', 'customer_last_name', 'email' 필드 중에서 'Eddie' 값을 포함하는 문서를 검색하세요.</i>"
    ],
    13: [
      "<b>'from'과 'size' 파라미터는 검색 결과의 페이징을 처리</b>할 때 사용됩니다.",
      "'from'은 어디서부터 결과를 가져올지, 'size'는 몇 개의 결과를 가져올지를 지정합니다.",
      "<i>6번째 문서부터 30개의 문서를 검색하세요.</i>"
    ],
    14: [
      "<b>_source 필드는 검색 결과로 돌려받을 필드를 지정</b>합니다. 기본적으로 모든 필드가 결과에 포함되지만, _source를 사용하여 필요한 필드만 선택적으로 가져올 수 있습니다.",
      "_source 필드는 false, 문자열 배열과 'include'와 'exclude'로 이루어진 Object로도 설정 가능합니다.",
      "false로 지정할 경우 검색결과에 _source 데이터가 포함되지 않습니다. 배열형태로 전달시 <b>wildcard</b> 형태로 전달가능합니다.",
      "Object 형태로 입력할 경우 <b>include</b> 배열로 받은 필드만이 출력되고, <b>exclude</b> 배열로 받은 필드는 제외됩니다.",
      "<i>customer_으로 시작하는 필드는 포함하지만, _id로 끝나는 필드는 검색결과에 포함되지 않도록 검색하세요</i>"
    ],
    15: [
      "<b>sort 옵션을 사용하면 검색 결과의 정렬 순서를 지정</b>할 수 있습니다.",
      "예를 들어, 날짜나 가격과 같은 필드를 기준으로 오름차순 또는 내림차순으로 정렬할 수 있습니다.",
      "sort에는 <b>script</b>가 사용이 가능합니다.",
      "오름차는 <b>asc</b>, 내림차는 <b>desc</b>로 표현됩니다.",
      "<i>order_date 필드를 기준으로 내림차순으로 정렬해서 검색하세요.</i>"
    ],
    16: [
      "<b>Aggregations 쿼리는 데이터에 대한 통계적 분석을 제공</b>하여, 여러 문서의 데이터를 요약, 그룹화, 혹은 집계하여 보여줍니다.",
      "이를 통해 대량의 데이터에서 유용한 정보를 추출하고, 데이터의 패턴이나 트렌드를 파악할 수 있습니다.",
      "aggs 필드는 query 필드의 조건에 해당하는 문서들에 대한 통계입니다.",
      "Metrics Aggregations에는  <b>min</b>, <b>max</b>, <b>sum</b>, <b>avg</b>등이 있습니다.",
      "<i>챕터 16부터는 문제가 아니라 기능설명입니다!</i>"
    ],
    17: [
      "<b>Bucket Aggregation은 주어진 조건으로 분류된 버킷들을 만들고, 각 버킷에 소속되는 문서들을 모아 그룹으로 구분</b>하는 것입니다",
      "각 버킷 별로 포함되는 도큐먼트의 개수는 doc_count 값에 기본적으로 표시가 되며 각 버킷 안에 metrics aggregation 을 이용해서 다른 계산들도 가능합니다",
      "주로 사용되는 bucket aggregation 들은 <b>Range</b>, <b>Histogram</b>, <b>Terms</b> 등이 있습니다.",
      "<i>&nbsp;</i>"
    ],
    18: ["Bucket Aggregation 으로 만든 버킷들 내부에 다시 <b>\"aggs\" : { }</b> 를 선언해서 또다른 버킷을 만들거나 Metrics Aggregation 을 만들어 사용이 가능합니다.",
      "다음은 terms aggregation을 이용해서 생성한 day_of_week 버킷 별로 avg aggregation을 이용해서 taxful_total_price 필드의 평균값을 계산하는 통계를 생성하는 예제입니다.",
      "<i>&nbsp;</i>"],
  });

  const resultData: Ref<NumberIndexedObject> = ref({});
  const sampleData: Ref<NumberIndexedObject> = ref({
    category: [
      "Men's Clothing"
    ],
    currency: "EUR",
    customer_first_name: "Eddie",
    customer_full_name: "Eddie Underwood",
    customer_gender: "MALE",
    customer_id: 38,
    customer_last_name: "Underwood",
    customer_phone: "",
    day_of_week: "Monday",
    day_of_week_i: 0,
    email: "eddie@underwood-family.zzz",
    manufacturer: [
      "Elitelligence",
      "Oceanavigations"
    ],
    order_date: "2024-03-25T09:28:48+00:00",
    order_id: 584677,
    products: [
      {
        base_price: 11.99,
        discount_percentage: 0,
        quantity: 1,
        manufacturer: "Elitelligence",
        tax_amount: 0,
        product_id: 6283,
        category: "Men's Clothing",
        sku: "ZO0549605496",
        taxless_price: 11.99,
        unit_discount_amount: 0,
        min_price: 6.35,
        _id: "sold_product_584677_6283",
        discount_amount: 0,
        created_on: "2016-12-26T09:28:48+00:00",
        product_name: "Basic T-shirt - dark blue/white",
        price: 11.99,
        taxful_price: 11.99,
        base_unit_price: 11.99
      },
      {
        base_price: 24.99,
        discount_percentage: 0,
        quantity: 1,
        manufacturer: "Oceanavigations",
        tax_amount: 0,
        product_id: 19400,
        category: "Men's Clothing",
        sku: "ZO0299602996",
        taxless_price: 24.99,
        unit_discount_amount: 0,
        min_price: 11.75,
        _id: "sold_product_584677_19400",
        discount_amount: 0,
        created_on: "2016-12-26T09:28:48+00:00",
        product_name: "Sweatshirt - grey multicolor",
        price: 24.99,
        taxful_price: 24.99,
        base_unit_price: 24.99
      }
    ],
    sku: [
      "ZO0549605496",
      "ZO0299602996"
    ],
    taxful_total_price: 36.98,
    taxless_total_price: 36.98,
    total_quantity: 2,
    total_unique_products: 2,
    type: "order",
    user: "eddie",
    geoip: {
      country_iso_code: "EG",
      location: {
        lon: 31.3,
        lat: 30.1
      },
      region_name: "Cairo Governorate",
      continent_name: "Africa",
      city_name: "Cairo"
    },
    event: {
      dataset: "sample_ecommerce"
    }
  });

  const canNext: Ref<Boolean> = ref(false);

  return { isShake, currentChapter, totalChapter, defaultQuery, explain, hints, resultData, sampleData, canNext };
});
