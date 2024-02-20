<template>
  <div class="card w-96 bg-base-100 shadow-xl mb-5">
    <div class="card-body">
      <div v-if="parentId" class="flex flex-row justify-start items-center">
        <span>Komentarz do:</span>
        <router-link :to="'/posts/' + parentId">
          <span class="pl-2 text-sm font-thin text-primary">
            {{ parentId }}
          </span>
        </router-link>
      </div>
      <div v-if="quoteId" class="flex flex-row justify-start items-center">
        <span>Zawiera cytat:</span>
        <router-link :to="'/posts/' + quoteId">
          <span class="pl-2 text-sm font-thin text-primary">
            {{ quoteId }}
          </span>
        </router-link>
      </div>
      <router-link :to="'/card/' + authorId">
        <div class="flex flex-row">
          <img
            v-if="profilePicture"
            :src="profilePicture"
            class="w-10 h-10 rounded-full"
          />
          <img
            v-else
            src="@/assets/avatar.jpg"
            class="w-10 h-10 rounded-full"
          />
          <h2 class="pl-2 card-title text-base font-light">
            {{ username }}
          </h2>
        </div>
      </router-link>

      <div
        v-if="quoteId"
        class="card w-80 bg-base-200 shadow-xl items-center p-2"
      >
        <router-link :to="'/card/' + fetchedQuotedPost.author">
          <div class="flex flex-row">
            <img
              v-if="fetchedQuotedPost.profilePicture"
              :src="fetchedQuotedPost.profilePicture"
              class="w-10 h-10 rounded-full"
            />
            <img
              v-else
              src="@/assets/avatar.jpg"
              class="w-10 h-10 rounded-full"
            />
            <h2 class="pl-2 card-title text-base font-light">
              {{ fetchedQuotedPost.username }}
            </h2>
          </div>
        </router-link>
        <p class="break-all pt-2">{{ fetchedQuotedPost.content }}</p>
      </div>

      <p class="break-all pt-2">{{ content }}</p>
    </div>
    <div class="card-actions p-2 justify-between">
      <p class="badge text-sm font-thin">{{ convertedDate }}</p>
      <div>
        <router-link :to="'/posts/' + postId">
          <button class="btn btn-sm btn-neutral">Skomentuj</button>
        </router-link>
        <button class="btn btn-sm btn-neutral" @click="$refs.modal.showModal()">
          Zacytuj
        </button>
        <dialog id="my_modal_2" ref="modal" class="modal">
          <div class="modal-box">
            <div class="card items-center">
              <h1 class="text-2xl font-semibold p-5 items-center">
                Wpis z cytatem
              </h1>
              <div class="card w-96 bg-base-200 shadow-xl items-center p-2">
                <router-link :to="'/card/' + authorId">
                  <div class="flex flex-row">
                    <img
                      v-if="profilePicture"
                      :src="profilePicture"
                      class="w-10 h-10 rounded-full"
                    />
                    <img
                      v-else
                      src="@/assets/avatar.jpg"
                      class="w-10 h-10 rounded-full"
                    />
                    <h2 class="pl-2 card-title text-base font-light">
                      {{ username }}
                    </h2>
                  </div>
                </router-link>
                <p class="break-all pt-2">{{ content }}</p>
              </div>
              <div class="flex flex-col md:flex-row">
                <form @submit.prevent="onSubmit" class="card-body pt-3">
                  <div class="form-control">
                    <label for="quoteContent" class="label">
                      <span class="label-text">Dodaj treść do cytatu</span>
                    </label>
                    <textarea
                      v-model="quoteContent"
                      class="textarea textarea-bordered textarea-lg w-96"
                      placeholder="Wpisz treść"
                      id="quoteContent"
                      required
                    ></textarea>
                    <div class="flex justify-end mt-6">
                      <button type="submit" class="btn btn-primary">
                        Dodaj wpis
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "@/services/DataService";

export default {
  name: "PostComp",
  props: {
    postId: String,
    content: String,
    date: String,
    authorId: String,
    username: String,
    profilePicture: String,
    parentId: String,
    quoteId: String,
  },
  data() {
    return {
      quoteContent: "",
      fetchedQuotedPost: {},
    };
  },
  computed: {
    convertedDate() {
      const resultDate =
        new Date(this.date).toLocaleDateString() +
        " " +
        new Date(this.date).toLocaleTimeString();
      return resultDate;
    },
  },
  watch: {
    quoteId: {
      immediate: true,
      handler(val) {
        if (val) {
          DataService.fetchPostData(val).then((res) => {
            this.fetchedQuotedPost = res.data.post;
          });
        }
      },
    },
  },
  methods: {
    onSubmit() {
      DataService.addQuote(this.postId, this.quoteContent).then((res) => {
        this.quoteContent = "";
        this.$router.push("/posts/" + res.data.savedQuote._id);
        this.$refs.modal.close();
      });
    },
  },
};
</script>

<style scoped></style>
