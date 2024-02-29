import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import NotFound from "../pages/NotFound.vue";
import { useUserStore } from "../stores/userStore";
import DataService from "../services/DataService";

function isAuthenticated(to, from, next) {
  const store = useUserStore();
  if (!store.getEmail) {
    DataService.getData()
      .then((res) => {
        store.saveUser(
          res.data.user._id,
          res.data.user.username,
          res.data.user.follows,
          res.data.user.profilePicture,
          res.data.user.name,
          res.data.user.surname,
          res.data.user.phoneNumber,
          res.data.user.email
        );
        next();
      })
      .catch((err) => {
        if (err.response && err.response.status == 401) {
          next("/login");
        }
      });
  } else {
    next();
  }
}

function isAlreadyLoggedIn(to, from, next) {
  const store = useUserStore();
  if (!store.getEmail) {
    DataService.getData()
      .then((res) => {
        store.saveUser(
          res.data.user._id,
          res.data.user.username,
          res.data.user.follows,
          res.data.user.profilePicture,
          res.data.user.name,
          res.data.user.surname,
          res.data.user.phoneNumber,
          res.data.user.email
        );
        next("/profile");
      })
      .catch((err) => {
        if (err.response && err.response.status == 401) {
          next();
        }
      });
  } else {
    next("/profile");
  }
}

const routes = [
  { path: "/", component: Home },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: [isAlreadyLoggedIn],
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    beforeEnter: [isAlreadyLoggedIn],
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../pages/profile/Profile.vue"),
    beforeEnter: [isAuthenticated],
  },
  {
    path: "/posts",
    name: "NewPosts",
    component: () => import("../pages/posts/NewPosts.vue"),
    beforeEnter: [isAuthenticated],
  },
  {
    path: "/posts/all",
    name: "AllPosts",
    component: () => import("../pages/posts/AllPosts.vue"),
    beforeEnter: [isAuthenticated],
  },
  {
    path: "/posts/:postId",
    name: "Post",
    component: () => import("../pages/posts/Post.vue"),
    props: true,
    beforeEnter: [isAuthenticated],
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
