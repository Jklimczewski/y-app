<template>
  <div class="card w-96 bg-base-100 shadow-xl mb-5">
    <div class="card-body">
      <router-link :to="'/card/' + username">
        <div class="flex flex-row">
          <img src="../assets/avatar.jpg" class="w-10 h-10 rounded-full" />
          <h2 class="pl-2 card-title text-sm font-thin">@{{ username }}</h2>
        </div>
      </router-link>
      <p class="pt-2">{{ content }}</p>
      <div class="card-actions justify-end">
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
    username: String,
  },
};
</script>

<style scoped></style>
