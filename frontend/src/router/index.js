import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import { useUserStore } from "../stores/userStore";

const routes = [
  { path: "/", component: Home },
  {
    path: "/login",
    component: () => import("../pages/Login.vue"),
    beforeEnter: () => {
      const store = useUserStore();
      if (store.getUser != "") return "/profile";
    },
  },
  {
    path: "/register",
    component: () => import("../pages/Register.vue"),
    beforeEnter: () => {
      const store = useUserStore();
      if (store.getUser != "") return "/profile";
    },
  },
  {
    path: "/profile",
    component: () => import("../pages/Profile.vue"),
    beforeEnter: () => {
      const store = useUserStore();
      if (store.getUser == "") return "/login";
    },
  },
  {
    path: "/posts",
    component: () => import("../pages/Posts.vue"),
    beforeEnter: () => {
      const store = useUserStore();
      if (store.getUser == "") return "/login";
    },
  },
  {
    path: "/posts/:postId",
    component: () => import("../pages/Post.vue"),
    props: true,
    beforeEnter: () => {
      const store = useUserStore();
      if (store.getUser == "") return "/login";
    },
  },
  {
    path: "/card/:userId",
    name: "Card",
    component: () => import("../pages/Card.vue"),
    props: true,
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
