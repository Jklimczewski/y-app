<template>
  <div class="flex flex-col items-center pt-8">
    <div class="rounded-xl shadow-xl bg-base-100">
      <div class="flex flex-col sm:flex-row p-10 items-center">
        <img
          v-if="userData.profilePicture"
          :src="userData.profilePicture"
          class="w-40 h-40 rounded-full"
        />
        <img v-else src="../assets/avatar.jpg" class="w-40 h-40 rounded-full" />
        <div class="flex flex-col lg:flex-row items-center">
          <span class="p-5 text-4xl font-thin">@{{ userData.username }} </span>
          <span v-if="userData.name" class="p-2 text-3xl font-small">
            {{ userData.name }}
          </span>
          <span v-if="userData.surname" class="p-2 text-3xl font-small">
            {{ userData.surname }}
          </span>
          <span v-if="userData.phoneNumber" class="p-5 text-3xl font-small">
            +48 {{ userData.phoneNumber }}
          </span>
        </div>
      </div>
      <div
        v-if="loggedUserId && loggedUserId != userId"
        class="flex flex-col items-center"
      >
        <button v-if="followed == true" @click="unfollow" class="btn">
          <v-icon name="co-user-unfollow" scale="1.5" />
          Unfollow
        </button>
        <button v-else @click="follow" class="btn">
          <v-icon name="co-user-follow" scale="1.5" />
          Follow
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../services/DataService";
import { useUserStore } from "../stores/userStore";

export default {
  name: "Card",
  props: ["userId"],
  data() {
    return {
      userData: {},
      followed: false,
    };
  },
  setup() {
    const store = useUserStore();
    return { store };
  },
  computed: {
    loggedUserId() {
      return this.store.getUserId;
    },
  },
  created() {
    DataService.fetchData(this.userId).then((res) => {
      this.userData = res.data.user;
    });
    const follows = this.store.getFollows;
    if (follows.includes(this.userId)) {
      this.followed = true;
    }
  },
  methods: {
    follow() {
      DataService.addFollow(this.userId).then((res) => {
        this.store.addToFollow(this.userId);
        this.followed = true;
      });
    },
    unfollow() {
      DataService.deleteFollow(this.userId).then((res) => {
        this.store.deleteToFollow(this.userId);
        this.followed = false;
      });
    },
  },
};
</script>

<style scoped></style>
