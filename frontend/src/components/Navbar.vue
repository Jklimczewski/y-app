<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <router-link to="/posts" class="flex flex-row">
        <div class="btn btn-ghost text-xl">
          <v-icon name="co-home" scale="1.5" />
          <span class="hidden sm:block">Serwis Y</span>
        </div>
      </router-link>
    </div>

    <div v-if="username != ''" class="navbar-center">
      <button
        class="input input-bordered flex items-center gap-2"
        @click="$refs.modal.showModal()"
      >
        <v-icon name="bi-search" scale="1.5" />
        <span class="font-thin text-neutral-content">Wyszukaj użytkownika</span>
      </button>
      <dialog id="my_modal_2" ref="modal" class="modal">
        <div class="modal-box">
          <v-icon name="bi-search" scale="1.2" />
          <input
            v-model="usersInput"
            type="text"
            class="w-11/12 input bg-base-100 text-neutral-content text-xl"
            placeholder="Kogo chcesz znaleźć ?"
          />
          <div class="card pt-3">
            <span class="text-md text-neutral-content pb-2">
              Pasujący użytkownicy:
            </span>
            <ul>
              <li v-for="(user, index) in fetchedUsers" :key="index">
                <div
                  class="card w-full mb-5 bg-base-200 text-neutral-content user-item"
                >
                  <router-link :to="'/card/' + user._id" @click="navigateUser">
                    <div class="flex flex-row p-3">
                      <img
                        v-if="user.profilePicture"
                        :src="user.profilePicture"
                        class="w-10 h-10 rounded-full"
                      />
                      <img
                        v-else
                        src="../assets/avatar.jpg"
                        class="w-10 h-10 rounded-full"
                      />
                      <span class="pl-2 card-title text-2xl font-normal">
                        {{ user.username }}
                      </span>
                      <span class="pl-5 card-title text-2xl font-light">
                        {{ user.email }}
                      </span>
                    </div>
                  </router-link>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
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
          <li>
            <router-link to="/profile" class="justify-between">
              Profil
            </router-link>
            <button type="button" @click="logout">Wyloguj się</button>
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
      fetchedUsers: [],
      usersInput: "",
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
    usersInput(val) {
      this.fetchedUsers = [];
      if (val.length >= 3) {
        DataService.getUsers(val)
          .then((res) => {
            this.fetchedUsers = res.data;
          })
          .catch((err) => {
            if (err.response && err.response.status == 401) {
              this.store.deleteUser();
              location.reload();
            }
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
    navigateUser() {
      this.$refs.modal.close();
      this.usersInput = "";
    },
  },
  created() {
    this.store.changeShowNotification(false);
    this.socket = io(`https://${window.location.hostname}:3000`, {
      secure: true,
    });

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

<style scoped>
.input:focus {
  outline: none;
}

.user-item:hover {
  background-color: oklch(var(--b3));
}
</style>
