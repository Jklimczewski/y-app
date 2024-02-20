<template>
  <div v-if="showNotification" class="toast toast-start">
    <router-link to="/posts">
      <div class="flex flex-col alert alert-info">
        <span>Nowy wpis obserwowanej osoby!</span>
      </div>
    </router-link>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/userStore";

export default {
  name: "Notification",
  setup() {
    const store = useUserStore();
    return { store };
  },
  computed: {
    showNotification() {
      return this.store.getShowNotification;
    },
  },
};
</script>

<style scoped></style>
