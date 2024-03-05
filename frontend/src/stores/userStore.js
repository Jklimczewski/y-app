import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      username: "",
      userId: "",
      userFollows: [],
      showNotification: false,
      profilePicture: "",
      name: "",
      surname: "",
      phoneNumber: "",
      email: "",
    };
  },
  getters: {
    getUser: (state) => state.username,
    getUserId: (state) => state.userId,
    getFollows: (state) => state.userFollows,
    getShowNotification: (state) => state.showNotification,
    getProfilePicture: (state) => state.profilePicture,
    getName: (state) => state.name,
    getSurname: (state) => state.surname,
    getPhoneNumber: (state) => state.phoneNumber,
    getEmail: (state) => state.email,
  },
  actions: {
    saveUser(
      userId,
      username,
      following,
      profilePicture,
      name,
      surname,
      phoneNumber,
      email
    ) {
      this.username = username;
      this.userId = userId;
      this.profilePicture = profilePicture;
      this.name = name;
      this.surname = surname;
      this.phoneNumber = phoneNumber;
      this.email = email;
      following.forEach((element) => {
        this.userFollows.push(element);
      });
      this.showNotification = false;
    },
    addToFollow(userToFollow) {
      const index = this.userFollows.indexOf(userToFollow);
      if (index < 0) {
        this.userFollows.push(userToFollow);
      }
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
      this.profilePicture = "";
      this.name = "";
      this.surname = "";
      this.phoneNumber = "";
      this.email = "";
      this.userFollows = [];
      this.showNotification = false;
    },
    changeShowNotification(bool) {
      this.showNotification = bool;
    },
  },
});
