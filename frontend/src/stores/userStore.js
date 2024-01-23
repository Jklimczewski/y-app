import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      username: useLocalStorage("username", ""),
    };
  },
  getters: {
    getUser: (state) => state.username,
  },
  actions: {
    saveUser(username) {
      this.username = username;
    },
    deleteUser() {
      this.username = "";
    },
  },
});
