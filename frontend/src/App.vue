<template>
  <div>
    <Navbar />
    <Notification />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Notification from "./components/Notification.vue";
</script>

<style scoped></style>
