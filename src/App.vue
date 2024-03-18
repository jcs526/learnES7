<template>
  <div class="wrapper">
    <QuestionComponet></QuestionComponet>
    <footer class="footer">
      <p>이 예제의 전체 소스 코드는 GitHub에서 확인할 수 있습니다: <a
          @click="handleWindowOpen('https://github.com/jcs526/learnES7')">Vue.js</a>,<a
          @click="handleWindowOpen('https://github.com/jcs526/learnES7_node')">Express.js</a></p>
      <p>참조 사이트 :<a class="green" @click="handleWindowOpen('https://flexboxfroggy.com/#ko')">Flexbox Froggy</a>,<a
          @click="handleWindowOpen('https://esbook.kimjmin.net/')">Elastic 가이드 북</a>
      </p>
      <p>&copy; 2024 정찬솔. 개인 프로젝트로 제작된 이 사이트는 Elasticsearch 학습을 돕기 위해 만들어졌습니다.</p>
    </footer>
  </div>

  <RouterView />
  <!-- <AnswerView></AnswerView> -->
</template>

<script setup lang="ts">
// import { RouterView } from "vue-router";
import QuestionComponet from "./components/question/QuestionComponet.vue";
import AnswerView from "@/views/AnswerView.vue";

const handleWindowOpen = (link: string) => {
  window.open(link);
};

</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

.wrapper {
  min-height: 100vh;
  margin: 0;
  padding: 10px 40px 100px 40px;
  background-color: hsla(160, 100%, 37%, 1);
  position: relative;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

.footer {
  width: 100%;
  /* position: absolute; */
  bottom: 5px;
  left: 50%;
  /* transform: translateX(-50%); */
  color: white;
  /* 흰색 텍스트 */
  padding: 20px 0;
  /* 상하 패딩 */
  text-align: center;
  /* 가운데 정렬 */
  font-family: Arial, sans-serif;
  /* 폰트 스타일 */
}

.footer>p {
  font-size: 0.8rem;
}

footer a,
footer a:visited,
footer a:hover,
footer a:active {
  color: hsla(210, 100%, 50%, 1);
  /* 연두색 링크 */
  text-decoration: none;
  /* 밑줄 없음 */
  padding: 0 10px;
  /* 좌우 패딩 */
}
</style>
