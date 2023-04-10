<template>
  <Navbar />
  <div class="d-flex justify-content-between align-items-center">
    <router-link
      :to="{ name: 'AddNewCategory', params: { locationId: locationId } }"
    >
      <button type="button" class="btn btn-success">Add Category</button>
    </router-link>
    <span class="badge bg-danger">View Categories Page</span>
    <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
      <button type="button" class="btn btn-success">Back To Menu</button>
    </router-link>
  </div>
  <br />
  <h4 class="text-center mb-0">{{ locationName }}</h4>
  <div class="text-center text-muted">{{ locationAddress }}</div>
  <br />
  <div v-if="numberOfCategories > 0">
    <div class="card col-md-12">
      <div class="card-header">
        <div class="d-flex justify-content-between">
          <h2 class="card-title">
            List Of Categories
            <span class="badge bg-danger">{{ numberOfCategories }}</span>
          </h2>
          <button class="btn btn-danger" @click="deleteAllCategories()">
            Delete all categories
          </button>
        </div>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead class="table-dark">
            <tr>
              <th style="width: 4%"></th>
              <th>Name</th>
              <th style="width: 20%">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, i) in listOfCategories" :key="category.id">
              <td class="font-weight-bold">{{ i + 1 }}</td>
              <td>{{ category.name }}</td>
              <td>
                <button
                  class="btn btn-danger mr-2"
                  @click="deleteConfirmation(category.id)"
                >
                  Delete
                </button>
                <router-link
                  :to="{
                    name: 'UpdateCategory',
                    params: {
                      categoryId: category.id,
                      locationId: category.locationId,
                    },
                  }"
                >
                  <button class="btn btn-success mr-2">Update</button>
                </router-link>
                <!-- <router-link
                  :to="{ name: 'Menu', params: { locationId: restaurant.id } }"
                >
                  <button class="btn btn-info">Menu</button>
                </router-link> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-else class="alert alert-warning" role="alert">
    No Categories Added Yet
  </div>
</template>
<script>
import Navbar from "@/components/Header/Navbar.vue";
import axios from "axios";
import { mapActions, mapMutations, mapState } from "vuex";
import swalAlert from "@/Alert/alert.js";
export default {
  name: "ViewCategories",
  mixins: [swalAlert],
  components: {
    Navbar,
  },
  data() {
    return {
      locationId: parseInt(this.$route.params.locationId, 10),
      userId: "",
      locationName: "",
      locationAddress: "",
      itemsIds: [],
      categoriesIds: [],
    };
  },
  computed: {
    ...mapState(["listOfCategories", "numberOfCategories"]),
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Login" });
    } else {
      this.userId = JSON.parse(user).id;
      this.canUserAccessThisLocation({
        userId: this.userId,
        locationId: this.locationId,
        redirectToPage: "Home",
      });
      this.getLocationData();
      this.displayAllCategories({
        userId: this.userId,
        locationId: this.locationId,
      });
    }
  },
  methods: {
    ...mapMutations(["canUserAccessThisLocation", "displayAllCategories"]),
    ...mapActions(["redirectTo"]),
    async getLocationData() {
      let res = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
      );
      if (res.status === 200) {
        this.locationName = res.data[0].restaurantName;
        this.locationAddress = res.data[0].address;
      }
    },
    deleteConfirmation(categoryId) {
      this.getItemsIds(categoryId);
      let message = "Are you sure want to delete this category ?";
      this.showSwalConfirm(
        message,
        () => {
          if (this.itemsIds.length > 0) {
            this.deleteItems();
          }
          this.deleteCategory(categoryId);
          location.reload();
        },
        () => {
          this.itemsIds = [];
        }
      );
    },
    async deleteCategory(categoryId) {
      await axios
        .delete(`http://localhost:3000/categories/${categoryId}`)
        .catch((e) => {
          this.showErrorToaster(e.message);
        });
    },
    async deleteItems() {
      for (let i = 0; i < this.itemsIds.length; i++) {
        await axios
          .delete(`http://localhost:3000/items/${this.itemsIds[i]}`)
          .catch((e) => {
            this.showErrorToaster(e);
          });
      }
    },
    async getItemsIds(categoryId) {
      let res = await axios.get(
        `http://localhost:3000/items?userId=${this.userId}&categoryId=${categoryId}`
      );
      if (res.status === 200 && res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          this.itemsIds.push(res.data[i].id);
        }
      }
    },

    deleteAllCategories() {
      this.getCategoriesIds();
      this.categoriesIds.forEach((catId) => {
        this.getItemsIds(catId);
      });
      let message = "Are you sure want to delete all categories ?";
      this.showSwalConfirm(
        message,
        () => {
          if (this.itemsIds.length > 0) {
            this.deleteItems();
          }
          this.deleteCategories();
          location.reload();
        },
        () => {
          this.itemsIds = [];
          this.categoriesIds = [];
        }
      );
    },
    getCategoriesIds() {
      this.listOfCategories.forEach((cat) => {
        this.categoriesIds.push(cat.id);
      });
    },
    deleteCategories() {
      for (let i = 0; i < this.categoriesIds.length; i++) {
        this.deleteCategory(this.categoriesIds[i]);
      }
    },
  },
};
</script>
<style lang=""></style>
