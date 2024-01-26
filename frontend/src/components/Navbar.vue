<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <router-link to="/">
        <img
          class="w-20 h-15"
          alt="Tailwind CSS Navbar component"
          src="https://as2.ftcdn.net/v2/jpg/03/03/63/79/1000_F_303637956_NiN7cI2MJCu591X1ovNsPizgF64Vggpt.jpg"
        />
      </router-link>
    </div>
    <div class="navbar-center">
      <router-link to="/posts" class="btn btn-ghost text-xl">
        Serwis Y
      </router-link>
    </div>
    <div class="navbar-end">
      <div v-if="username != ''" class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img v-if="profilePicture" :src="profilePicture" />
            <img v-else src="../assets/avatar.jpg" />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li v-if="username == ''">
            <router-link href="/login" class="justify-between">
              Login
            </router-link>
          </li>
          <li v-else>
            <router-link to="/profile" class="justify-between">
              Profile
            </router-link>
            <button type="button" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "../stores/userStore";
import DataService from "../services/DataService";
import io from "socket.io-client";

export default {
  name: "Navbar",
  data() {
    return {
      profilePicture: "",
      socket: null,
    };
  },
  setup() {
    const store = useUserStore();
    return { store };
  },
  computed: {
    username() {
      return this.store.getUser;
    },
  },
  watch: {
    username(val) {
      if (val != "") {
        DataService.getData().then((res) => {
          this.profilePicture = res.data.user.profilePicture;
        });
      }
    },
  },
  methods: {
    logout() {
      DataService.logout().then((response) => {
        if (response.status == 200) {
          this.store.deleteUser();
          location.reload();
        }
      });
    },
  },
  created() {
    this.store.changeShowNotification(false);
    this.socket = io("https://localhost:3000", { secure: true });

    this.socket.on("postAdded", (data) => {
      const follows = this.store.getFollows;
      if (follows.includes(data.message)) {
        this.store.changeShowNotification(true);
      }
    });

    if (this.store.getUser) {
      DataService.getData()
        .then((res) => {
          this.profilePicture = res.data.user.profilePicture;
        })
        .catch((err) => {
          if (err.response.status && err.response.status == 401) {
            this.store.deleteUser();
            location.reload();
          }
        });
    }
  },
};
</script>

<style scoped></style>
