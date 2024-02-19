<template>
  <div class="flex flex-col items-center pt-10">
    <div class="card w-full max-w-sm shadow-2xl bg-base-200">
      <h1 class="pt-10 self-center text-3xl font-bold text-center">
        Zarejerstruj się!
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
          />
        </div>
        <div class="form-control">
          <label for="username" class="label">
            <span class="label-text">Username</span>
          </label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="username"
            class="input input-bordered"
            required
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
          />
        </div>
        <div class="form-control h-3 text-lg">
          <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
          <div v-if="successMessage" class="text-green-500">
            {{ successMessage }}
          </div>
        </div>
        <div class="form-control mt-6">
          <button type="submit" class="btn btn-primary">Register</button>
        </div>
      </form>
      <div class="text-md font-thin text-center">
        <router-link to="/login" class="">Masz już konto ?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "@/services/DataService";

export default {
  name: "Register",
  data() {
    return {
      email: "",
      username: "",
      password: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    onSubmit() {
      this.errorMessage = "";
      DataService.register(this.email, this.username, this.password)
        .then((response) => {
          if (response.status == 200) {
            this.errorMessage = response.data;
          } else if (response.status == 201) {
            this.successMessage = response.data;
            setTimeout(() => {
              this.$router.push("/login");
            }, 1000);
          }
        })
        .catch((err) => {
          if (err.response) {
            this.errorMessage = "An error occurred while submitting the form";
          } else {
            console.log(err);
          }
        });
    },
  },
};
</script>

<style scoped></style>
