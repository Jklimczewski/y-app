<template>
  <div class="flex flex-col items-center pt-8">
    <div class="card w-full max-w-4xl items-center shadow-xl bg-base-100">
      <h1 class="text-5xl font-semibold pt-5 items-center">
        Witaj, {{ store.getUser }} !
      </h1>
      <div class="flex flex-col md:flex-row">
        <div>
          <img
            v-if="savedPicture"
            :src="savedPicture"
            class="card-body w-60 h-60 mt-5 ml-14 md:ml-10 md:mt-20 md:mr-10 rounded-full"
          />
          <img
            v-else
            src="../assets/avatar.jpg"
            class="card-body w-60 h-60 mt-5 ml-14 md:ml-10 md:mt-20 md:mr-10 rounded-full"
          />
          <button
            class="btn w-80 mr-6 md:mr-0 ml-6 md:ml-0 md:mt-10 text-primary"
            @click="showCard"
          >
            Podgląd wizytówki
          </button>
        </div>
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
            />
          </div>
          <div class="form-control">
            <label for="profilePicture" class="label">
              <span class="label-text">Zmień zdjęcie</span>
            </label>
            <input
              v-on:change="changeFile"
              className="file-input file-input-bordered w-full"
              aria-describedby="user_avatar_help"
              id="profilePicture"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
            />
          </div>
          <div class="form-control h-3 text-lg">
            <div v-if="successMessage" class="text-green-500">
              {{ successMessage }}
            </div>
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
      successMessage: "",
      userId: "",
      name: "",
      surname: "",
      phoneNumber: "",
      profilePicture: null,
      savedPicture: "",
    };
  },
  setup() {
    const store = useUserStore();
    return { store };
  },
  methods: {
    onSubmit() {
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("surname", this.surname);
      formData.append("phoneNumber", this.phoneNumber);
      formData.append("avatar", this.profilePicture);
      DataService.changeData(formData).then((res) => {
        this.successMessage = res.data;
        setTimeout(() => {
          location.reload();
        }, 2000);
      });
    },
    showCard() {
      this.$router.push({ name: "Card", params: { userId: this.userId } });
    },
    changeFile(event) {
      if (event.currentTarget.files) {
        this.profilePicture = event.target.files[0];
      }
    },
  },
  beforeMount() {
    DataService.getData().then((res) => {
      this.userId = res.data.user._id;
      this.name = res.data.user.name;
      this.surname = res.data.user.surname;
      this.phoneNumber = res.data.user.phoneNumber;
      this.savedPicture = res.data.user.profilePicture;
    });
  },
};
</script>

<style lang="scss" scoped></style>
