<template>
  <Navbar />
  <div class="">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title font-weight-bold">Add New Restaurant</h3>
      </div>
      <form @submit.prevent="addNewRestaurant()">
        <div class="card-body">
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': v$.restaurantName.$error }"
              placeholder="Restaurant Name"
              v-model="state.restaurantName"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-utensils"></span>
              </div>
            </div>
            <div class="invalid-feedback" v-if="v$.restaurantName.$error">
              {{ v$.restaurantName.$errors[0].$message }}
            </div>
          </div>
          <div class="input-group mb-3">
            <input
              type="number"
              class="form-control"
              :class="{ 'is-invalid': v$.phone.$error }"
              placeholder="Phone Number"
              v-model="state.phone"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-phone"></span>
              </div>
            </div>
            <div class="invalid-feedback" v-if="v$.phone.$error">
              {{ v$.phone.$errors[0].$message }}
            </div>
          </div>
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': v$.address.$error }"
              placeholder="address"
              v-model="state.address"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-location-arrow"></span>
              </div>
            </div>
            <div class="invalid-feedback" v-if="v$.address.$error">
              {{ v$.address.$errors[0].$message }}
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
  </div>
</template>
<script>
import Navbar from "@/components/Header/Navbar.vue";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import axios from "axios";
import { reactive, computed } from "vue";
import { mapActions } from "vuex";
import swalAlert from "@/Alert/alert.js";
export default {
  name: "AddNewLocation",
  mixins: [swalAlert],
  components: { Navbar },
  setup() {
    const state = reactive({
      restaurantName: "",
      phone: "",
      address: "",
    });
    const rules = computed(() => {
      return {
        restaurantName: { required, minLength: minLength(4) },
        phone: { required, minLength: minLength(10) },
        address: { required },
      };
    });
    const v$ = useValidate(rules, state);

    return { state, v$ };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "login" });
    } else {
      this.userId = JSON.parse(user).id;
    }
  },
  data() {
    return {
      userId: "",
    };
  },
  methods: {
    ...mapActions(["redirectTo"]),
    closeModal() {
      document.getElementById("close").click();
    },
    async addNewRestaurant() {
      this.v$.$validate();
      if (!this.v$.$error) {
        await axios
          .post("http://localhost:3000/locations", {
            restaurantName: this.state.restaurantName,
            phone: this.state.phone,
            address: this.state.address,
            userId: this.userId,
          })
          .then(() => {
            this.redirectTo({ val: "Home" });
            this.showSuccessToaster(
              "your restaurant has been successfully added"
            );
          })
          .catch((e) => {
            this.showErrorToaster(e.message);
          });
      }
    },
  },
};
</script>

<style lang=""></style>
