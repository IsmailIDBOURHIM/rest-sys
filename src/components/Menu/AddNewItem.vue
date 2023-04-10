<template>
  <Navbar />
  <div class="d-flex flex-column align-items-center">
    <span class="badge bg-danger mb-2">Add new items</span>
    <h4 class="mb-0">{{ locationName }}</h4>
    <div class="text-muted">{{ locationAddress }}</div>
  </div>
  <div class="mt-4">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title font-weight-bold">Add New Item</h3>
      </div>
      <form @submit.prevent="addNewItem()">
        <div class="card-body">
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': v$.name.$error }"
              placeholder="Enter item name"
              v-model="state.name"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-hamburger"></span>
              </div>
            </div>
            <div class="invalid-feedback" v-if="v$.name.$error">
              {{ v$.name.$errors[0].$message }}
            </div>
          </div>
          <div class="input-group mb-3">
            <input
              type="number"
              class="form-control"
              :class="{ 'is-invalid': v$.qty.$error }"
              placeholder="Enter item quantities"
              v-model="state.qty"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <i class="fas fa-plus"></i>
              </div>
            </div>
            <div class="invalid-feedback" v-if="v$.qty.$error">
              {{ v$.qty.$errors[0].$message }}
            </div>
          </div>
          <div class="input-group mb-3">
            <input
              type="number"
              step="any"
              class="form-control"
              :class="{ 'is-invalid': v$.price.$error }"
              placeholder="Enter item price"
              v-model="state.price"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="mr-1 fas fa-euro-sign"></span>
              </div>
            </div>
            <div class="invalid-feedback" v-if="v$.price.$error">
              {{ v$.price.$errors[0].$message }}
            </div>
          </div>
          <div class="input-group mb-3">
            <select
              class="custom-select"
              :class="{ 'is-invalid': errorMessage !== '' }"
              v-model="categoryId"
              @change="resetMessage()"
            >
              <option class="text-muted" value="0">Select category name</option>
              <option
                v-for="(category, i) in listOfCategories"
                :key="i"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <div class="invalid-feedback" v-if="errorMessage !== ''">
              {{ errorMessage }}
            </div>
          </div>
          <div class="input-group mb-3">
            <textarea
              class="form-control"
              :class="{ 'is-invalid': v$.description.$error }"
              rows="4"
              placeholder="Enter item description"
              v-model="state.description"
            ></textarea>
            <div class="invalid-feedback" v-if="v$.description.$error">
              {{ v$.description.$errors[0].$message }}
            </div>
          </div>
          <div class="d-flex flex-row-reverse justify-content-around">
            <button type="submit" class="btn btn-primary">Add now</button>
            <router-link
              :to="{ name: 'Menu', params: { locationId: locationId } }"
            >
              <button type="button" class="btn btn-secondary">
                Back to items
              </button>
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Navbar from "@/components/Header/Navbar.vue";
import axios from "axios";
import { mapActions, mapState, mapMutations } from "vuex";
import useValidate from "@vuelidate/core";
import { reactive, computed } from "vue";
import { required, minLength, between } from "@vuelidate/validators";
import swalAlert from "@/Alert/alert.js";
export default {
  name: "AddNewItem",
  mixins: [swalAlert],
  components: { Navbar },
  setup() {
    const state = reactive({
      name: "",
      qty: "",
      price: "",
      description: "",
    });
    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(4) },
        qty: { required, between: between(1, 1000000) },
        price: { required },
        description: { required, minLength: minLength(4) },
      };
    });
    const v$ = useValidate(rules, state);

    return { state, v$ };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Login" });
    } else {
      this.userId = JSON.parse(user).id;
      this.userName = JSON.parse(user).username;
      this.isLoggedInUser();
      this.displayAllCategories({
        userId: this.userId,
        locationId: this.locationId,
      });
      this.canUserAccessThisLocation({
        userId: this.userId,
        locationId: this.locationId,
        redirectToPage: "Home",
      });
      this.getLocationData();
    }
  },
  data() {
    return {
      userId: "",
      userName: "",
      locationId: this.$route.params.locationId,
      locationName: "",
      locationAddress: "",
      categoryId: 0,
      errorMessage: "",
    };
  },
  computed: {
    ...mapState([
      "isUserLoggedIn",
      "loggedInUserId",
      "numberOfCategories",
      "listOfCategories",
    ]),
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations([
      "isLoggedInUser",
      "displayAllCategories",
      "canUserAccessThisLocation",
    ]),
    async getLocationData() {
      let res = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
      );
      if (res.status === 200) {
        this.locationName = res.data[0].restaurantName;
        this.locationAddress = res.data[0].address;
      }
    },
    async addNewItem() {
      this.v$.$validate();
      if (!this.v$.$error) {
        if (this.categoryId != 0) {
          await axios
            .post("http://localhost:3000/items", {
              name: this.state.name,
              qty: parseInt(this.state.qty, 10),
              price: +parseFloat(this.state.price).toFixed(2),
              description: this.state.description,
              userId: this.userId,
              locationId: parseInt(this.locationId, 10),
              categoryId: this.categoryId,
            })
            .then(() => {
              this.redirectTo({ val: "Menu" });
              this.showSuccessToaster("Your item has been successfully added");
            })
            .catch((e) => {
              this.showErrorToaster(e.message);
            });
        } else {
          this.errorMessage = "Please select a category";
        }
      }
    },
    resetMessage() {
      if (this.categoryId != 0) {
        this.errorMessage = "";
      }
    },
  },
};
</script>
<style lang=""></style>
