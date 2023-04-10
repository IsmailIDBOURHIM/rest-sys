<template lang="">
  <div v-if="allRestaurants.length > 0">
    <div class="card col-md-12">
      <div class="card-header">
        <div class="d-flex justify-content-between">
          <h2 class="card-title">
            List Of Restaurants
            <span class="badge bg-danger">{{ allRestaurants.length }}</span>
          </h2>
          <button
            class="btn btn-danger"
            @click.prevent="deleteAllLocations(allRestaurants)"
          >
            Delete all restaurants
          </button>
        </div>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead class="table-dark">
            <tr>
              <th style="width: 4%"></th>
              <th>Name</th>
              <th>Phone</th>
              <th>Adress</th>
              <th style="width: 20%">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(restaurant, i) in allRestaurants" :key="restaurant.id">
              <td class="font-weight-bold">{{ i + 1 }}</td>
              <td>{{ restaurant.restaurantName }}</td>
              <td>{{ restaurant.phone }}</td>
              <td>{{ restaurant.address }}</td>
              <td>
                <button
                  class="btn btn-danger mr-2"
                  @click="deleteConfirmation(restaurant.id)"
                >
                  Delete
                </button>
                <router-link
                  :to="{
                    name: 'UpdateLocation',
                    params: { id: restaurant.id },
                  }"
                >
                  <button class="btn btn-success mr-2">Update</button>
                </router-link>
                <router-link
                  :to="{ name: 'Menu', params: { locationId: restaurant.id } }"
                >
                  <button class="btn btn-info">Menu</button>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer clearfix">
        <ul class="pagination pagination-sm m-0 float-right">
          <li class="page-item"><a class="page-link" href="#">«</a></li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item"><a class="page-link" href="#">»</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div v-else class="alert alert-warning" role="alert">
    No Restaurants Added Yet
  </div>
</template>
<script>
import axios from "axios";
import swalAlert from "@/Alert/alert.js";

export default {
  name: "Locations",
  mixins: [swalAlert],
  props: {
    allRestaurants: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Login" });
    }

    this.userId = JSON.parse(user).id;
  },
  data() {
    return {
      userId: "",
    };
  },
  methods: {
    deleteConfirmation(locationId) {
      let message = "Are you sure want to delete this restaurant ?";
      this.showSwalConfirm(
        message,
        () => {
          this.deleteLocation(locationId);
        },
        () => {}
      );
    },
    async deleteLocation(id) {
      await axios
        .delete(`http://localhost:3000/locations/${id}`)
        .then(() => {
          this.$router.push({ name: "Home" });
          this.showSuccessToaster(
            "your restaurant has been successfully deleted"
          );
          this.$emit("delete", { isAll: false });
        })
        .catch((e) => {
          this.showErrorToaster(e.message);
        });
    },
    deleteAllLocations(allRestaurants) {
      let message = "Do you really want to delete all restaurants ?";
      this.showSwalConfirm(
        message,
        () => {
          let haveError = this.deleteLocationById(allRestaurants);
          if (!haveError) {
            this.$router.push({ name: "Home" });
            this.showSuccessToaster("All restaurants have been deleted.");
            this.$emit("delete", { isAll: true });
          } else {
            this.showErrorToaster("Something went wrong");
          }
        },
        () => {}
      );
    },
    deleteLocationById(restaurants) {
      let haveError = false;
      restaurants.forEach(async (restaurant) => {
        let res = await axios.delete(
          `http://localhost:3000/locations/${restaurant.id}`
        );
        if (res.status !== 200) {
          haveError = true;
        }
      });

      return haveError;
    },
  },
};
</script>
<style lang="scss"></style>
