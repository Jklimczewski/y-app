import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      username: useLocalStorage("username", ""),
      userId: useLocalStorage("userId", ""),
      userFollows: useLocalStorage("userFollows", []),
      showNotification: false,
    };
  },
  getters: {
    getUser: (state) => state.username,
    getUserId: (state) => state.userId,
    getFollows: (state) => state.userFollows,
    getShowNotification: (state) => state.showNotification,
  },
  actions: {
    saveUser(userId, username, following) {
      this.username = username;
      this.userId = userId;
      following.forEach((element) => {
        this.userFollows.push(element);
      });
      this.showNotification = false;
    },
    addToFollow(userToFollow) {
      this.userFollows.push(userToFollow);
    },
    deleteToFollow(userToUnfollow) {
      const index = this.userFollows.indexOf(userToUnfollow);
      if (index >= 0) {
        this.userFollows.splice(index, 1);
      }
    },
    deleteUser() {
      this.username = "";
      this.userId = "";
      this.userFollows = [];
      this.showNotification = false;
    },
    changeShowNotification(bool) {
      this.showNotification = bool;
    },
  },
});
