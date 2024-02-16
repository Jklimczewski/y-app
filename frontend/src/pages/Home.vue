<template>
  <div class="hero">
    <div class="flex items-center p-20 text-center">
      <div class="max-w-lg">
        <h1 class="text-5xl font-bold">Witamy w serwisie Y</h1>
        <p class="py-6">
          Po zalogowaniu się będziesz mógł dodawać wpisy, obserwować innych
          użytkowników oraz oczywiście wchodzić z nimi w interakcję !
        </p>
        <button @click="letsStart" class="btn btn-primary">Zaczynamy</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    letsStart() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped></style>
