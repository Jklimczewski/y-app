<template>
  <div class="flex flex-col items-center pt-8">
    <div class="card w-full max-w-3xl items-center shadow-xl bg-base-100">
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
            ></textarea>
          </div>
        </form>
      </div>
    </div>
    <div class="card w-full max-w-3xl items-center pt-10">
      <h1 class="text-2xl font-semibold pt-5 items-center pb-5">Nowe posty</h1>
      <PostComp />
      <PostComp />
    </div>
  </div>
</template>

<script>
import PostComp from "../components/PostComp.vue";
import { useUserStore } from "../stores/userStore";

export default {
  name: "Posts",
  components: {
    PostComp,
  },
  data() {
    return {
      postContent: "",
    };
  },
  setup() {
    const store = useUserStore();
    return { store };
  },
  // beforeMount() {
  //   DataService.getData().then((res) => {
  //     this.userId = res.data.user._id;
  //     this.savedPicture = res.data.user.profilePicture;
  //   });
  // },
};
</script>

<style scoped></style>
