<template>
  <div class="flex flex-col items-center pt-8">
    <div class="rounded-xl shadow-xl bg-base-100">
      <div class="flex flex-col sm:flex-row p-10 items-center">
        <img
          src="https://www.picturethisai.com/wiki-image/1080/201221807685107712.jpeg"
          class="w-40 h-40 rounded-full"
        />
        <div class="flex flex-col lg:flex-row items-center">
          <span class="p-5 text-4xl font-thin">@{{ userData.username }} </span>
          <span v-if="userData.name" class="p-2 text-3xl font-small">
            {{ userData.name }}
          </span>
          <span v-if="userData.surname" class="p-2 text-3xl font-small">
            {{ userData.surname }}
          </span>
          <span v-if="userData.phoneNumber" class="p-5 text-3xl font-small">
            +48 {{ userData.phoneNumber }}
          </span>
        </div>
      </div>
      <div class="flex flex-col items-center">FOLLOW</div>
    </div>
  </div>
</template>

<script>
import DataService from "../services/DataService";

export default {
  name: "Card",
  props: ["userId"],
  data() {
    return {
      userData: {},
    };
  },
  beforeMount() {
    DataService.fetchData(this.userId).then((res) => {
      this.userData = res.data.user;
    });
  },
  methods: {},
};
</script>

<style scoped></style>
