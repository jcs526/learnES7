
<template>
  <div class="wrapper">
    <!-- <HelloWorld msg="You did it!" /> -->
    <QuestionComponet></QuestionComponet>
  </div>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import QuestionComponet from "./components/question/QuestionComponet.vue";

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
  padding: 10px 40px 50px 40px;
  background-color: hsla(160, 100%, 37%, 1);
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
</style>
