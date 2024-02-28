<template>
  <div v-if="errorMessage">
    <h1 class="p-10 self-center text-3xl font-semibold text-center">
      404 - {{ errorMessage }}
    </h1>
  </div>
  <div v-else class="flex flex-col items-center pt-8">
    <div class="rounded-xl shadow-xl bg-base-200">
      <div class="flex flex-col sm:flex-row p-10 items-center">
        <img
          v-if="userData.profilePicture"
          :src="userData.profilePicture"
          class="w-40 h-40 rounded-full"
        />
        <img v-else src="@/assets/avatar.jpg" class="w-40 h-40 rounded-full" />
        <div class="flex flex-col lg:flex-row items-center">
          <span class="p-5 text-3xl font-thin">{{ userData.username }} </span>
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
          {{ showPosts == true ? "Schowaj wpisy" : "Pokaż wpisy" }}
        </button>
        <div v-if="loggedUserId != userId" class="pl-10">
          <button
            v-if="followed == true"
            @click="unfollow"
            class="btn btn-neutral"
          >
            <v-icon name="co-user-unfollow" scale="1.5" />
            Usuń z obserwowanych
          </button>
          <button v-else @click="follow" class="btn btn-neutral">
            <v-icon name="co-user-follow" scale="1.5" />
            Obserwuj
          </button>
        </div>
        <div v-else class="pl-10">
          <button @click="toggleShowFollows" class="btn btn-neutral">
            {{
              showFollows == true
                ? "Schowaj obserwowane osoby"
                : "Obserwowane osoby"
            }}
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="showPosts == true"
      class="card w-full max-w-3xl items-center pt-10"
    >
      <h1 class="text-2xl font-semibold pt-5 items-center pb-5">
        Wpisy użytkownika
      </h1>
      <div v-for="post in fetchedPosts" :key="post._id">
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

    <div
      v-else-if="showFollows == true"
      class="card w-full max-w-3xl items-center pt-10"
    >
      <h1 class="text-2xl font-semibold pt-5 items-center pb-5">Obserwujesz</h1>
      <ul>
        <li v-for="(user, index) in fetchedFollows" :key="index">
          <div
            class="card w-96 mb-3 border border-neutral bg-base-100 text-neutral-content"
          >
            <router-link :to="'/card/' + user._id">
              <div class="flex flex-row justify-center space-x-3 p-3">
                <img
                  v-if="user.profilePicture"
                  :src="user.profilePicture"
                  class="w-10 h-10 rounded-full"
                />
                <img
                  v-else
                  src="@/assets/avatar.jpg"
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
</template>

<script>
import PostComp from "@/components/PostComp.vue";
import DataService from "@/services/DataService";
import { useUserStore } from "@/stores/userStore";

export default {
  name: "Card",
  components: {
    PostComp,
  },
  props: ["userId"],
  data() {
    return {
      userData: {},
      fetchedPosts: null,
      pageSize: 4,
      page: 0,
      noMorePosts: false,
      fetchedFollows: null,
      showPosts: false,
      showFollows: false,
      followed: false,
      errorMessage: "",
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
      this.showFollows = false;
      if (this.showPosts && this.fetchedPosts == null) {
        this.page += 1;
        this.nextPageOnScroll();
      } else if (this.showPosts) {
        this.nextPageOnScroll();
      } else {
        this.removeNextPageOnScroll();
      }
    },
    toggleShowFollows() {
      this.showFollows = !this.showFollows;
      this.showPosts = false;
      this.removeNextPageOnScroll();
      if (this.showFollows && this.fetchedFollows == null) {
        this.fetchFollowsData();
      }
    },

    fetchData(userId) {
      DataService.fetchData(userId)
        .then((res) => {
          this.userData = res.data.user;
          const follows = this.store.getFollows;
          if (follows.includes(userId)) {
            this.followed = true;
          }
        })
        .catch((err) => {
          if (err.response && err.response.status == 404) {
            this.errorMessage = err.response.data.message;
          } else {
            console.log(err);
          }
        });
    },
    fetchUserPosts(userId) {
      DataService.fetchPosts(userId, this.pageSize, this.page)
        .then((res) => {
          if (res.data.userPosts.length == 0) {
            this.noMorePosts = true;
            this.removeNextPageOnScroll();
          }
          if (this.fetchedPosts == null) {
            this.fetchedPosts = [];
          }
          this.fetchedPosts = this.fetchedPosts.concat(res.data.userPosts);
        })
        .catch((err) => {
          if (err.response && err.response.status == 401) {
            this.store.deleteUser();
            this.$router.go();
          } else if (err.response && err.response.status == 404) {
            this.errorMessage = err.response.data.message;
          } else {
            console.log(err);
          }
        });
    },
    fetchFollowsData() {
      DataService.fetchFollowsData()
        .then((res) => {
          this.fetchedFollows = res.data;
        })
        .catch((err) => {
          if (err.response && err.response.status == 401) {
            this.store.deleteUser();
            this.$router.go();
          } else if (err.response && err.response.status == 404) {
            this.errorMessage = err.response.data.message;
          } else {
            console.log(err);
          }
        });
    },

    scrollHandler() {
      let bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight >=
        document.documentElement.offsetHeight - 1;

      if (bottomOfWindow && !this.noMorePosts) {
        this.page += 1;
      }
    },
    nextPageOnScroll() {
      window.addEventListener("scroll", this.scrollHandler);
    },
    removeNextPageOnScroll() {
      window.removeEventListener("scroll", this.scrollHandler);
    },
  },
  watch: {
    "$route.params.userId": function (newUserId) {
      this.removeNextPageOnScroll();
      this.userData = {};
      this.showPosts = false;
      this.showFollows = false;
      this.followed = false;
      this.fetchedPosts = null;
      this.fetchedFollows = null;
      this.fetchData(newUserId);
      this.page = 0;
      this.noMorePosts = false;
    },
    page(val) {
      if (val > 0) {
        this.fetchUserPosts(this.userId);
      }
    },
  },
  created() {
    this.fetchData(this.userId);
  },
  unmounted() {
    this.removeNextPageOnScroll();
  },
};
</script>

<style scoped></style>
