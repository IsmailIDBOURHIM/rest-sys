<template lang="">
  <div class="login-page bg-light" style="min-height: 320px">
    <div class="login-box">
      <div class="card card-outline card-primary">
        <div
          class="alert alert-danger text-center mb-0"
          role="alert"
          v-if="errorMessage !== ''"
        >
          {{ errorMessage }}
        </div>
        <div class="card-header text-center">
          <a href="" class="h1"><b>Forgot</b>Password</a>
        </div>
        <div class="card-body">
          <p class="login-box-msg">
            You forgot your password? Here you can easily retrieve a new
            password.
          </p>
          <form action="" @submit.prevent="checkEmailExist">
            <div class="input-group mb-3">
              <input
                v-model="state.email"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.email.$error }"
                placeholder="Email"
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-envelope"></span>
                </div>
              </div>
              <div class="invalid-feedback" v-if="v$.email.$error">
                {{ v$.email.$errors[0].$message }}
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <button type="submit" class="btn btn-primary btn-block">
                  Request new password
                </button>
              </div>
            </div>
          </form>
          <p class="mt-3 mb-1">
            <a href="" @click="redirectTo({ val: 'Login' })">Login</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import axios from "axios";

export default {
  name: "ForgotPassword",
  setup() {
    const state = reactive({
      email: "",
    });
    const rules = computed(() => {
      return {
        email: { required, email },
      };
    });

    const v$ = useValidate(rules, state);

    return { state, v$ };
  },
  data() {
    return {
      errorMessage: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.redirectTo({ val: "Home" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async checkEmailExist() {
      this.errorMessage = "";
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.state.email}`
        );
        if (result.data.length === 0) {
          this.errorMessage = "this email does not exist";
        } else {
          this.$router.push({
            name: "RecoverPassword",
            params: { userId: result.data[0].id },
          });
        }
      }
    },
  },
};
</script>
