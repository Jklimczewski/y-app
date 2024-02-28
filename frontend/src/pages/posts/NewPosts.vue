<template>
  <div class="flex flex-col items-center pt-10">
    <div class="card w-full max-w-3xl items-center shadow-xl bg-base-200">
      <h1 class="text-2xl font-semibold pt-5 items-center">Utwórz wątek</h1>
      <div class="flex flex-col md:flex-row">
        <form @submit.prevent="onSubmit" class="card-body pt-3">
          <div class="form-control">
            <label for="postContent" class="label">
              <span class="label-text">Treść posta</span>
            </label>
            <textarea
              v-model="postContent"
              class="textarea textarea-bordered textarea-lg w-96"
              placeholder="Wpisz treść"
              id="postContent"
              required
            ></textarea>
            <div class="flex justify-end mt-6">
              <button type="submit" class="btn btn-primary">Dodaj wpis</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="card w-full max-w-3xl items-center pt-10">
      <h1 class="text-2xl font-semibold pb-8 pt-5 underline">Nowe wpisy</h1>
      <div v-for="(post, index) in addedPosts" :key="index">
        <PostComp
          :postId="post._id"
          :content="post.content"
          :authorId="post.author"
          :username="post.username"
          :profilePicture="post.profilePicture"
          :date="post.createdAt"
        />
      </div>
      <ul>
        <li v-for="(post, nindex) in fetchedNewPosts" :key="nindex">
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
        </li>
      </ul>
      <div v-if="noMorePosts" class="pb-5">
        <div
          class="flex flex-row pt-5 text-lg font-semibold text-neutral-content"
        >
          <v-icon name="bi-check-circle" scale="2" />
          <span class="pt-1">Jesteś na bieżąco</span>
        </div>
        <router-link to="/posts/all" class="text-primary font-bold">
          Wyświetl wszystkie wpisy
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import PostComp from "@/components/PostComp.vue";
import { useUserStore } from "@/stores/userStore";
import DataService from "@/services/DataService";

export default {
  name: "NewPosts",
  components: {
    PostComp,
  },
  data() {
    return {
      pageSize: 4,
      page: 1,
      recentlyAdded: 0,
      postContent: "",
      addedPosts: [],
      fetchedNewPosts: [],
      noMorePosts: false,
    };
  },
  setup() {
    const store = useUserStore();
    return { store };
  },
  computed: {
    newPosts() {
      return this.store.getShowNotification;
    },
  },
  methods: {
    onSubmit() {
      DataService.addPost(this.postContent)
        .then((res) => {
          this.addedPosts.unshift(res.data.savedPost);
          this.postContent = "";
        })
        .catch((err) => {
          if (err.response && err.response.status == 401) {
            this.store.deleteUser();
            this.$router.go();
          } else {
            console.log(err);
          }
        });
    },
    fetchUnseenData() {
      DataService.getNewPosts(this.pageSize, this.page, this.recentlyAdded)
        .then((res) => {
          if (
            res.data.posts.length == 0 ||
            res.data.posts.length < this.pageSize
          ) {
            this.removeNextPageOnScroll();
            this.noMorePosts = true;
            DataService.postsRefreshed();
          } else if (this.page == 1) {
            this.nextPageOnScroll();
          }
          this.fetchedNewPosts = this.fetchedNewPosts.concat(res.data.posts);
        })
        .catch((err) => {
          if (err.response && err.response.status == 401) {
            this.store.deleteUser();
            this.$router.go();
          } else {
            console.log(err);
          }
        });
    },
    fetchNewUnseenData() {
      DataService.getNewPosts(1, 1)
        .then((res) => {
          if (this.noMorePosts == true) {
            DataService.postsRefreshed();
          }
          this.fetchedNewPosts = res.data.posts.concat(this.fetchedNewPosts);
        })
        .catch((err) => {
          if (err.response && err.response.status == 401) {
            this.store.deleteUser();
            this.$router.go();
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
    page: {
      immediate: true,
      handler(val) {
        this.fetchUnseenData();
      },
    },
    newPosts(val) {
      if (val == true) {
        this.recentlyAdded += 1;
        setTimeout(() => {
          this.fetchNewUnseenData();
          this.store.changeShowNotification(false);
        }, 2000);
      }
    },
  },
  mounted() {
    this.store.changeShowNotification(false);
  },
  unmounted() {
    this.removeNextPageOnScroll();
  },
};
</script>

<style scoped></style>
