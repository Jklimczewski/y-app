<template>
  <div class="flex flex-col items-center pt-8">
    <div class="rounded-xl shadow-xl bg-base-200">
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
      <div v-if="loggedUserId" class="flex flex-row justify-center pb-5">
        <button @click="toggleShowPosts" class="btn btn-neutral">
          {{ showPosts ? "Schowaj posty" : "Pokaż posty" }}
        </button>
        <div v-if="loggedUserId != userId" class="pl-10">
          <button
            v-if="followed == true"
            @click="unfollow"
            class="btn btn-neutral"
          >
            <v-icon name="co-user-unfollow" scale="1.5" />
            Unfollow
          </button>
          <button v-else @click="follow" class="btn btn-neutral">
            <v-icon name="co-user-follow" scale="1.5" />
            Follow
          </button>
        </div>
      </div>
    </div>
    <div v-if="showPosts" class="card w-full max-w-3xl items-center pt-10">
      <h1 class="text-2xl font-semibold pt-5 items-center pb-5">
        Posty użytkownika
      </h1>
      <div v-for="post in userPosts" :key="post._id">
        <PostComp
          :postId="post._id"
          :content="post.content"
          :authorId="post.author"
          :username="post.username"
          :profilePicture="post.profilePicture"
          :date="post.createdAt"
          :parentId="post.parentPost"
          :quoteId="post.quotedPost"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PostComp from "../components/PostComp.vue";
import DataService from "../services/DataService";
import { useUserStore } from "../stores/userStore";

export default {
  name: "Card",
  components: {
    PostComp,
  },
  props: ["userId"],
  data() {
    return {
      userData: {},
      userPosts: [],
      showPosts: false,
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
  watch: {
    "$route.params.userId": function (newUserId) {
      this.userData = {};
      this.followed = false;
      this.userPosts = [];
      this.fetchData(newUserId);
      this.fetchUserPosts(newUserId);
    },
  },
  created() {
    this.fetchData(this.userId);
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
    toggleShowPosts() {
      this.showPosts = !this.showPosts;
      if (this.showPosts) {
        this.fetchUserPosts(this.userId);
      }
    },
    fetchData(userId) {
      DataService.fetchData(userId).then((res) => {
        this.userData = res.data.user;
      });
      const follows = this.store.getFollows;
      if (follows.includes(userId)) {
        this.followed = true;
      }
    },
    fetchUserPosts(userId) {
      DataService.fetchPosts(userId)
        .then((res) => {
          this.userPosts = res.data.userPosts;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped></style>
