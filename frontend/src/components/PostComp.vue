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
      <router-link :to="'/card/' + authorId">
        <div class="flex flex-row">
          <img
            v-if="profilePicture"
            :src="profilePicture"
            class="w-10 h-10 rounded-full"
          />
          <img
            v-else
            src="../assets/avatar.jpg"
            class="w-10 h-10 rounded-full"
          />
          <h2 class="pl-2 card-title text-sm font-light">@{{ username }}</h2>
        </div>
      </router-link>
      <p class="break-all pt-2">{{ content }}</p>
    </div>
    <div class="card-actions p-2 justify-between">
      <p class="badge text-sm font-thin">{{ convertedDate }}</p>
      <div>
        <router-link :to="'/posts/' + postId">
          <button class="btn btn-sm btn-neutral">Skomentuj</button>
        </router-link>
        <button class="btn btn-sm btn-neutral">Zacytuj</button>
      </div>
    </div>
  </div>
</template>

<script>
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
};
</script>

<style scoped></style>
