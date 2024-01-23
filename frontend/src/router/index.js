import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import { useUserStore } from "../stores/userStore";

const routes = [
  { path: "/", component: Home },
  {
    path: "/card/:userId",
    name: "Card",
    component: () => import("../pages/Card.vue"),
    props: true,
  },
  {
    path: "/login",
    component: () => import("../pages/Login.vue"),
    beforeEnter: () => {
      const store = useUserStore();
      if (store.username != "") return "/profile";
    },
  },
  {
    path: "/register",
    component: () => import("../pages/Register.vue"),
    beforeEnter: () => {
      const store = useUserStore();
      if (store.username != "") return "/profile";
    },
  },
  {
    path: "/profile",
    component: () => import("../pages/Profile.vue"),
    beforeEnter: () => {
      const store = useUserStore();
      if (store.username == "") return "/login";
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to) => {
//   const store = useUserStore();

//   if (to.meta.requiresAuth && store.username == "") return "/login";
// });

export default router;
