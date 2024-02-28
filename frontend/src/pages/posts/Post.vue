<template>
  <div v-if="errorMessage">
    <h1 class="p-10 self-center text-3xl font-semibold text-center">
      404 - {{ errorMessage }}
    </h1>
  </div>
  <div v-else class="flex flex-col items-center pt-8">
    <div class="card w-full max-w-3xl items-center shadow-xl bg-base-200">
      <PostComp
        class="self-start"
        :postId="postData._id"
        :content="postData.content"
        :authorId="postData.author"
        :username="postData.username"
        :profilePicture="postData.profilePicture"
        :date="postData.createdAt"
        :parentId="postData.parentPost"
        :quoteId="postData.quotedPost"
      />
      <h1 class="text-2xl font-semibold items-center">Skomentuj wpis</h1>
      <div class="flex flex-col md:flex-row">
        <form @submit.prevent="onSubmit" class="card-body p-0">
          <div class="form-control">
            <label for="commentContent" class="label">
              <span class="label-text">Treść komentarza</span>
            </label>
            <textarea
              v-model="commentContent"
              class="textarea textarea-bordered textarea-lg w-96"
              placeholder="Wpisz treść"
              id="commentContent"
              required
            ></textarea>
            <div class="flex justify-end mt-6">
              <button type="submit" class="btn btn-primary">
                Dodaj komentarz
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="card w-full max-w-3xl items-center pt-10">
      <h1 class="text-2xl font-semibold items-center pb-5">Komentarze</h1>
      <div v-for="(post, index) in addedComments" :key="index">
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
      <div v-for="(post, index) in fetchedComments" :key="index">
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
import PostComp from "@/components/PostComp.vue";
import DataService from "@/services/DataService";
import { useUserStore } from "@/stores/userStore";

export default {
  name: "Post",
  components: {
    PostComp,
  },
  data() {
    return {
      postData: {},
      commentContent: "",
      addedComments: [],
      fetchedComments: [],
      pageSize: 2,
      page: 1,
      noMorePosts: false,
      errorMessage: "",
    };
  },
  props: ["postId"],
  setup() {
    const store = useUserStore();
    return { store };
  },
  watch: {
    "$route.params.postId": function (newPostId) {
      this.removeNextPageOnScroll();
      this.addedComments = [];
      this.fetchedComments = [];
      this.page = 1;
      this.noMorePosts = false;
      this.fetchData(newPostId);
    },
    page(val) {
      if (val > 1) {
        this.fetchComments(this.postId);
      }
    },
  },
  methods: {
    onSubmit() {
      DataService.addComment(this.postId, this.commentContent)
        .then((res) => {
          this.addedComments.push(res.data.savedComment);
          this.commentContent = "";
        })
        .catch((err) => {
          if (err.response && err.response.status == 401) {
            this.store.deleteUser();
            this.$router.go();
          }
        });
    },
    fetchData(postId) {
      DataService.fetchPostData(postId)
        .then((res) => {
          this.postData = res.data.post;
          this.fetchComments(postId);
          this.nextPageOnScroll();
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
    fetchComments(postId) {
      DataService.fetchComments(postId, this.pageSize, this.page)
        .then((res) => {
          if (res.data.comments.length == 0) {
            this.removeNextPageOnScroll();
            this.noMorePosts = true;
          }
          this.fetchedComments = this.fetchedComments.concat(res.data.comments);
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
        document.documentElement.offsetHeight;

      if (bottomOfWindow && !this.noMorePosts) {
        this.page += 1;
      }
    },
    nextPageOnScroll() {
      setTimeout(() => {
        window.addEventListener("scroll", this.scrollHandler);
      }, 500);
    },
    removeNextPageOnScroll() {
      window.removeEventListener("scroll", this.scrollHandler);
    },
  },
  created() {
    this.fetchData(this.postId);
  },
  unmounted() {
    this.removeNextPageOnScroll();
  },
};
</script>

<style scoped></style>
