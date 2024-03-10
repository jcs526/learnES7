import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "answer",
      component: () => import("../views/AnswerView.vue")
    },
  ]
});

export default router;
