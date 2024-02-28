<template>
  <div class="flex flex-col items-center pt-8">
    <div class="card w-full max-w-3xl items-center">
      <h1
        v-if="fetchedPosts.length == 0"
        class="text-2xl font-semibold pt-5 items-center pb-5"
      >
        Brak postów do wyświetlenia
      </h1>
      <h1 v-else class="text-2xl font-semibold pt-5 items-center pb-5">
        Wszystkie wpisy z ostatnich 24h
      </h1>
      <ul>
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
    </div>
  </div>
</template>

<script>
import PostComp from "@/components/PostComp.vue";
import { useUserStore } from "@/stores/userStore";
import DataService from "@/services/DataService";

export default {
  name: "AllPosts",
  components: {
    PostComp,
  },
  data() {
    return {
      pageSize: 4,
      page: 1,
      fetchedPosts: [],
      noMorePosts: false,
    };
  },
  setup() {
    const store = useUserStore();
    return { store };
  },
  methods: {
    fetchAllData() {
      DataService.getPosts(this.pageSize, this.page)
        .then((res) => {
          if (res.data.posts.length == 0) {
            this.noMorePosts = true;
          }
          if (this.page == 1) {
            this.getNextPage();
          }
          this.fetchedPosts = this.fetchedPosts.concat(res.data.posts);
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
    getNextPage() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.offsetHeight - 1;

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
        this.fetchAllData();
      },
    },
  },
};
</script>

<style scoped></style>
