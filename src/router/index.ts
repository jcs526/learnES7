import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/learnes7",
    },
    {
      path: "/learnes7",
      name: "learnes7",
      component: () => import("@/views/AnswerView.vue")
    },
  ]
});

export default router;
