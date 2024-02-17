<template>
  <div class="flex flex-col items-center pt-8">
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
      <h1 class="text-2xl font-semibold pb-5 pt-5 underline">Nowe wpisy</h1>
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
      <ul id="infinite-scroll">
        <li v-for="(post, index) in fetchedPosts" :key="index">
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
import PostComp from "../components/PostComp.vue";
import { useUserStore } from "../stores/userStore";
import DataService from "../services/DataService";

export default {
  name: "Posts",
  components: {
    PostComp,
  },
  data() {
    return {
      pageSize: 4,
      page: 1,
      postContent: "",
      addedPosts: [],
      fetchedPosts: [],
      noMorePosts: false,
    };
  },
  setup() {
    const store = useUserStore();
    return { store };
  },
  methods: {
    onSubmit() {
      DataService.addPost(this.postContent)
        .then((res) => {
          this.addedPosts.push(res.data.savedPost);
          this.postContent = "";
        })
        .catch((err) => {
          if (err.response && err.response.status == 401) {
            this.store.deleteUser();
            location.reload();
          }
        });
    },
    fetchUnseenData() {
      DataService.getNewPosts(this.pageSize, this.page)
        .then((res) => {
          if (res.data.posts.length == 0) {
            this.noMorePosts = true;
          }
          this.fetchedPosts = this.fetchedPosts.concat(res.data.posts);
          DataService.postsRefreshed();
        })
        .catch((err) => {
          if (err.response && err.response.status == 401) {
            this.store.deleteUser();
            location.reload();
          }
        });
    },
    getNextPage() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.offsetHeight;

        if (bottomOfWindow && !this.noMorePosts) {
          this.page += 1;
        }
      };
    },
  },
  watch: {
    page: {
      immediate: true,
      handler(val) {
        this.fetchUnseenData();
      },
    },
  },
  mounted() {
    this.store.changeShowNotification(false);
    this.getNextPage();
  },
};
</script>

<style scoped></style>
