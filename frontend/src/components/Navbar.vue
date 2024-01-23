<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="">
        <img
          class="w-20 h-15"
          alt="Tailwind CSS Navbar component"
          src="https://as2.ftcdn.net/v2/jpg/03/03/63/79/1000_F_303637956_NiN7cI2MJCu591X1ovNsPizgF64Vggpt.jpg"
        />
      </div>
    </div>
    <div class="navbar-center">
      <a href="/" class="btn btn-ghost text-xl">Serwis Y</a>
    </div>
    <div class="navbar-end">
      <div v-if="username != ''" class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li v-if="username == ''">
            <a href="/login" class="justify-between">Login</a>
          </li>
          <li v-else>
            <a href="/profile" class="justify-between">Profile</a>
            <button type="button" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "../stores/userStore";
import DataService from "../services/DataService";

export default {
  name: "Navbar",
  setup() {
    const store = useUserStore();
    return { store };
  },
  computed: {
    username() {
      return this.store.getUser;
    },
  },
  methods: {
    logout() {
      DataService.logout().then((response) => {
        if (response.status == 200) {
          this.store.deleteUser();
          this.$router.push("/login");
        }
      });
    },
  },
};
</script>

<style scoped></style>
