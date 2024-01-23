<template>
  <div class="flex flex-col items-center pt-8">
    <div class="card w-full max-w-4xl items-center shadow-xl bg-base-100">
      <h1 class="text-5xl font-semibold pt-5 items-center">
        Witaj, {{ store.getUser }} !
      </h1>
      <div class="flex flex-col md:flex-row">
        <img
          src="https://www.picturethisai.com/wiki-image/1080/201221807685107712.jpeg"
          class="card-body w-60 h-60 mt-5 md:mt-20 md:mr-10 rounded-full"
        />
        <form @submit.prevent="onSubmit" class="card-body pt-0 md:pt-10">
          <div class="form-control">
            <label for="name" class="label">
              <span class="label-text">Imię</span>
            </label>
            <input
              v-model="name"
              type="text"
              id="name"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control">
            <label for="surname" class="label">
              <span class="label-text">Nazwisko</span>
            </label>
            <input
              v-model="surname"
              type="text"
              id="surname"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control">
            <label for="phoneNumber" class="label">
              <span class="label-text">Numer telefonu</span>
            </label>
            <input
              v-model="phoneNumber"
              type="tel"
              pattern="[0-9]{9}"
              id="phoneNumber"
              class="input input-bordered"
              required
            />
          </div>
          <div class="form-control">
            <label for="profilePicture" class="label">
              <span class="label-text">Zmień zdjęcie</span>
            </label>
            <input
              v-on:change="test"
              className="file-input file-input-bordered w-full"
              aria-describedby="user_avatar_help"
              id="profilePicture"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
            />
          </div>
          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary">Zapisz</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../services/DataService";
import { useUserStore } from "../stores/userStore";

export default {
  name: "Profile",
  data() {
    return {
      name: "",
      surname: "",
      phoneNumber: "",
    };
  },
  setup() {
    const store = useUserStore();
    return { store };
  },
  methods: {
    onSubmit() {
      DataService.changeData(this.name, this.surname, this.phoneNumber);
    },
  },
  beforeMount() {
    DataService.getData().then((res) => {
      this.name = res.data.user.name;
      this.surname = res.data.user.surname;
      this.phoneNumber = res.data.user.phoneNumber;
    });
  },
};
</script>

<style lang="scss" scoped></style>
