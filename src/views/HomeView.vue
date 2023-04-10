<template>
  <Navbar />
  <router-link :to="{ name: 'AddNewLocation' }">
    <button type="button" class="btn btn-dark mb-2">Add New Restaurant</button>
  </router-link>
  <Locations :allRestaurants="listOfRestaurants" @delete="updateData" />
</template>

<script>
import { mapActions } from "vuex";
import Navbar from "@/components/Header/Navbar.vue";
import Locations from "@/components/Locations/Locations.vue";
import axios from "axios";
export default {
  name: "HomeView",
  components: { Navbar, Locations },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Login" });
    }

    this.userId = JSON.parse(user).id;

    let result = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}`
    );

    if (result.data.length > 0) {
      this.listOfRestaurants = result.data;
    }
  },
  data() {
    return {
      listOfRestaurants: [],
      userId: "",
    };
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async updateData({ isAll }) {
      if (isAll) {
        this.listOfRestaurants = [];
      } else {
        let result = await axios.get(
          `http://localhost:3000/locations?userId=${this.userId}`
        );
        if (result.data.length > 0) {
          this.listOfRestaurants = result.data;
        } else {
          this.listOfRestaurants = [];
        }
      }
    },
  },
};
</script>
