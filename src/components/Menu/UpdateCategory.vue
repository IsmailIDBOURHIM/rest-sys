<template>
  <Navbar />
  <div class="card">
    <div class="card-header">
      <h3 class="card-title font-weight-bold">
        Update Category number
        <span class="badge bg-success">{{ categoryId }}</span>
      </h3>
    </div>
    <form @submit.prevent="updateCategory()">
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
        <div class="d-flex justify-content-around flex-row-reverse">
          <div>
            <button
              type="submit"
              class="btn btn-block btn-primary"
              @click="updateCategory()"
            >
              Update now
            </button>
          </div>
          <router-link
            :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
          >
            <button class="btn btn-block btn-danger">Cancel</button>
          </router-link>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import Navbar from "@/components/Header/Navbar.vue";
import axios from "axios";
import { mapActions, mapMutations, mapState } from "vuex";
import { reactive, computed } from "vue";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import swalAlert from "@/Alert/alert.js";
export default {
  name: "UpdateCategory",
  components: { Navbar },
  mixins: [swalAlert],
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
      userId: "",
      categoryId: this.$route.params.categoryId,
      locationId: this.$route.params.locationId,
      categoryData: [],
      errorMessage: "",
    };
  },
  computed: {
    ...mapState(["listOfCategories"]),
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Login" });
    } else {
      this.userId = JSON.parse(user).id;
      this.fetchDataCategory(this.categoryId);
      this.canUserAccessThisLocation({
        userId: this.userId,
        locationId: this.locationId,
        redirectToPage: "Home",
      });
      this.canUserAccessThisCategory({
        userId: this.userId,
        locationId: this.locationId,
        categoryId: this.categoryId,
        redirectToPage: "Home",
      });
      this.categoriesData(this.userId, this.locationId);
    }
  },
  methods: {
    ...mapMutations(["canUserAccessThisLocation", "canUserAccessThisCategory"]),
    ...mapActions(["redirectTo"]),
    async updateCategory() {
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
            .put(`http://localhost:3000/categories/${this.categoryId}`, {
              name: this.state.name,
              userId: this.userId,
              locationId: parseInt(this.locationId, 10),
            })
            .then(() => {
              this.redirectTo({ val: "ViewCategories" });
              this.showSuccessToaster(
                "Your category has been updated successfully"
              );
            })
            .catch((e) => {
              this.showErrorToaster(e.message);
            });
        }
      }
    },
    async categoriesData(userId, locationId) {
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
    async fetchDataCategory(categoryId) {
      let result = await axios.get(
        `http://localhost:3000/categories?id=${categoryId}`
      );
      if (result.status === 200) {
        this.state.name = result.data[0].name;
        this.categoryData = result.data[0];
      }
    },
    resetMessage() {
      this.errorMessage = "";
    },
  },
};
</script>
<style lang=""></style>
