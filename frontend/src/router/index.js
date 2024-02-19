import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import NotFound from "../pages/NotFound.vue";
import { useUserStore } from "../stores/userStore";

const routes = [
  { path: "/", component: Home },
  {
    path: "/login",
    component: Login,
    beforeEnter: () => {
      const store = useUserStore();
      if (store.getUser != "") return "/profile";
    },
  },
  {
    path: "/register",
    component: Register,
    beforeEnter: () => {
      const store = useUserStore();
      if (store.getUser != "") return "/profile";
    },
  },
  {
    path: "/profile",
    component: () => import("../pages/profile/Profile.vue"),
    beforeEnter: () => {
      const store = useUserStore();
      if (store.getUser == "") return "/login";
    },
  },
  {
    path: "/posts",
    component: () => import("../pages/posts/NewPosts.vue"),
    beforeEnter: () => {
      const store = useUserStore();
      if (store.getUser == "") return "/login";
    },
  },
  {
    path: "/posts/all",
    component: () => import("../pages/posts/AllPosts.vue"),
    beforeEnter: () => {
      const store = useUserStore();
      if (store.getUser == "") return "/login";
    },
  },
  {
    path: "/posts/:postId",
    component: () => import("../pages/posts/Post.vue"),
    props: true,
    beforeEnter: () => {
      const store = useUserStore();
      if (store.getUser == "") return "/login";
    },
  },
  {
    path: "/card/:userId",
    name: "Card",
    component: () => import("../pages/profile/Card.vue"),
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
