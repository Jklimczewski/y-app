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
              <button type="submit" class="btn btn-primary">Dodaj post</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="card w-full max-w-3xl items-center pt-10">
      <h1 class="text-2xl font-semibold pt-5 items-center pb-5">Nowe posty</h1>
      <div v-for="(post, index) in addedPosts" :key="index">
        <PostComp
          :postId="post._id"
          :content="post.content"
          :authorId="post.authorId"
          :username="post.username"
          :profilePicture="post.profilePicture"
          :date="post.createdAt"
        />
      </div>
      <div v-for="(post, index) in fetchedPosts" :key="index">
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
import { useUserStore } from "../stores/userStore";
import DataService from "../services/DataService";

export default {
  name: "Posts",
  components: {
    PostComp,
  },
  data() {
    return {
      postContent: "",
      addedPosts: [],
      fetchedPosts: [],
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
          if (err.response.status && err.response.status == 401) {
            this.store.deleteUser();
            location.reload();
          }
        });
    },
  },
  mounted() {
    DataService.getPosts()
      .then((res) => {
        this.fetchedPosts = res.data.posts;
        DataService.postsRefreshed();
      })
      .catch((err) => {
        if (err.response.status && err.response.status == 401) {
          this.store.deleteUser();
          location.reload();
        }
      });
  },
};
</script>

<style scoped></style>
