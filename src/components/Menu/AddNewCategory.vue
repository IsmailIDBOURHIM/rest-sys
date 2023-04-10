<template>
  <Navbar />
  <div class="d-flex justify-content-between align-items-center">
    <router-link
      :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
    >
      <button type="button" class="btn btn-success">Back To Categories</button>
    </router-link>
    <span class="badge bg-danger">Add Category Page</span>
    <div></div>
  </div>
  <br />
  <h4 class="text-center mb-0">{{ locationName }}</h4>
  <div class="text-center text-muted">{{ locationAddress }}</div>
  <br />
  <div class="card">
    <div class="card-header">
      <h3 class="card-title font-weight-bold">Add New Category</h3>
    </div>
    <form @submit.prevent="addNewCategory()">
      <div class="card-body">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': v$.name.$error || errorMessage !== '' }"
            placeholder="Category Name"
            v-model="state.name"
            @input="resetMessage"
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-utensils"></span>
            </div>
          </div>
          <div class="invalid-feedback" v-if="v$.name.$error">
            {{ v$.name.$errors[0].$message }}
          </div>
          <div class="invalid-feedback" v-if="errorMessage !== ''">
            {{ errorMessage }}
          </div>
        </div>
        <div class="row">
          <div>
            <button type="submit" class="btn btn-primary btn-block">
              Add now
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import Navbar from "@/components/Header/Navbar.vue";
import axios from "axios";
import { mapActions, mapMutations } from "vuex";
import { reactive, computed } from "vue";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import swalAlert from "@/Alert/alert.js";
export default {
  name: "AddNewCategory",
  mixins: [swalAlert],
  components: {
    Navbar,
  },
  setup() {
    const state = reactive({
      name: "",
      categories: [],
    });

    const rules = computed(() => {
      return {
        name: {
          required,
          minLength: minLength(2),
        },
      };
    });
    const v$ = useValidate(rules, state);

    return { state, v$ };
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      userId: "",
      locationName: "",
      locationAddress: "",
      errorMessage: "",
    };
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
      this.listOfCategories(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations(["canUserAccessThisLocation"]),
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
    async addNewCategory() {
      this.v$.$validate();
      let isUnique = this.state.categories.filter((name) => {
        return name.toLocaleLowerCase() == this.state.name.toLocaleLowerCase();
      });
      if (isUnique.length > 0) {
        this.errorMessage = "This name already exists";
      }
      if (!this.v$.$error) {
        if (this.errorMessage === "") {
          await axios
            .post("http://localhost:3000/categories", {
              name: this.state.name,
              userId: this.userId,
              locationId: parseInt(this.locationId, 10),
            })
            .then(() => {
              this.redirectTo({ val: "ViewCategories" });
              this.showSuccessToaster(
                "Your category has been successfully added"
              );
            })
            .catch((e) => {
              this.showErrorToaster(e.message);
            });
        }
      }
    },
    async listOfCategories(userId, locationId) {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${userId}&locationId=${locationId}`
      );
      let names = [];
      if (result.status === 200) {
        if (result.data.length > 0) {
          result.data.forEach((el) => {
            names.push(el.name);
          });
        }
        this.state.categories = names;
      }
    },
    resetMessage() {
      this.errorMessage = "";
    },
  },
};
</script>
<style lang=""></style>
