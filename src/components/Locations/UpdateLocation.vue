<template>
  <Navbar />
  <div class="">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title font-weight-bold">
          Update restaurant number
          <span class="badge bg-success">{{ id }}</span>
        </h3>
      </div>
      <form @submit.prevent="updateLocation()">
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
              type="text"
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
                Update now
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
import swalAlert from "@/Alert/alert.js";
export default {
  name: "UpdateLocation",
  components: { Navbar },
  mixins: [swalAlert],
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
  async mounted() {
    this.id = this.$route.params.id;
    let res = await axios.get(`http://localhost:3000/locations/${this.id}`);
    if (res.status === 200 && res.data) {
      this.location = res.data;
      this.state.restaurantName = res.data.restaurantName;
      this.state.phone = res.data.phone;
      this.state.address = res.data.address;
      this.userId = res.data.userId;
    }
  },
  data() {
    return {
      id: "",
      userId: "",
    };
  },
  methods: {
    async updateLocation() {
      this.v$.$validate();
      if (!this.v$.$error) {
        await axios
          .put(`http://localhost:3000/locations/${this.id}`, {
            restaurantName: this.state.restaurantName,
            phone: this.state.phone,
            address: this.state.address,
            userId: this.userId,
          })
          .then(() => {
            this.$router.push({ name: "Home" });
            this.showSuccessToaster(
              "The restaurant has been successfully updated."
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
