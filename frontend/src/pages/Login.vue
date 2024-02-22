<template>
  <div class="flex flex-col items-center pt-20">
    <div class="card w-full max-w-sm shadow-2xl bg-base-200">
      <h1 class="pt-10 self-center text-3xl font-bold text-center">
        Zaloguj się!
      </h1>
      <form @submit.prevent="onSubmit" class="card-body">
        <div class="form-control">
          <label for="email" class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="email"
            class="input input-bordered"
            required
            autocomplete="off"
          />
        </div>
        <div class="form-control">
          <label for="password" class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="password"
            class="input input-bordered"
            required
            autocomplete="off"
          />
        </div>
        <div class="form-control h-3 text-lg">
          <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
        </div>
        <div class="form-control mt-6">
          <button type="submit" class="btn btn-primary">Login</button>
        </div>
      </form>
      <div class="text-md font-thin text-center">
        <router-link to="/register" class="">Nie masz konta ?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "@/services/DataService";
import { useUserStore } from "@/stores/userStore";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  setup() {
    const store = useUserStore();
    return { store };
  },
  methods: {
    onSubmit() {
      DataService.login(this.email, this.password)
        .then((response) => {
          if (response.status == 200) {
            this.store.saveUser(
              response.data.user._id,
              response.data.user.username,
              response.data.user.follows,
              response.data.user.profilePicture,
              response.data.user.name,
              response.data.user.surname,
              response.data.user.phoneNumber,
              response.data.user.email
            );
            this.$router.push("/profile");
          }
        })
        .catch((err) => {
          if (err.response && err.response.status == 401) {
            this.errorMessage = "Incorrect email or password!";
          } else {
            console.log(err);
          }
        });
    },
  },
};
</script>

<style scoped></style>
