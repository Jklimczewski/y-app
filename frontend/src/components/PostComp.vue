<template>
  <div class="card w-96 bg-base-100 shadow-xl mb-5">
    <div class="card-body">
      <router-link :to="'/card/' + username">
        <div class="flex flex-row">
          <img src="../assets/avatar.jpg" class="w-10 h-10 rounded-full" />
          <h2 class="pl-2 card-title text-sm font-thin">@{{ username }}</h2>
        </div>
      </router-link>
      <p class="break-all pt-2">{{ content }}</p>
    </div>
    <div class="card-actions p-2 justify-between">
      <p class="badge text-sm font-thin">{{ convertedDate }}</p>
      <div>
        <button class="btn btn-sm btn-neutral">Skomentuj</button>
        <button class="btn btn-sm btn-neutral">Zacytuj</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostComp",
  props: {
    content: String,
    date: String,
    username: String,
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
