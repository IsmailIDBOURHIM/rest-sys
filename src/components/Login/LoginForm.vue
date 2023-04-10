<template lang="">
  <div class="hold-transition login-page bg-light">
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
          <p href="" class="h1"><b>Login</b></p>
        </div>
        <div class="card-body">
          <p class="login-box-msg">Sign in to start your session</p>
          <form @submit.prevent="login">
            <div class="input-group mb-3">
              <input
                type="email"
                class="form-control"
                :class="{ 'is-invalid': v$.email.$error }"
                placeholder="Email"
                v-model="state.email"
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
            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                :class="{ 'is-invalid': v$.password.$error }"
                placeholder="Password"
                v-model="state.password"
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
              <div class="invalid-feedback" v-if="v$.password.$error">
                {{ v$.password.$errors[0].$message }}
              </div>
            </div>
            <div class="row">
              <div>
                <button type="submit" class="btn btn-primary btn-block">
                  Sign In
                </button>
              </div>
            </div>
          </form>
          <br />
          <p class="mb-1">
            <a
              class="text-center"
              @click="redirectTo({ val: 'ForgotPassword' })"
            >
              I forgot my password
            </a>
          </p>
          <p class="mb-0">
            <a class="text-center" @click="redirectTo({ val: 'Signup' })">
              Register a new membership
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import axios from "axios";

export default {
  name: "LoginForm",
  setup() {
    const state = reactive({
      email: "",
      password: "",
    });
    const rules = computed(() => {
      return {
        email: { required, email },
        password: {
          required,
          minLength: minLength(6),
          maxlength: maxLength(12),
        },
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
    async login() {
      this.errorMessage = "";
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.get(
          `http://localhost:3000/users?email=${this.state.email}&password=${this.state.password}`
        );
        if (result.data.length > 0) {
          localStorage.setItem(
            "user-info",
            JSON.stringify({
              id: result.data[0].id,
              email: result.data[0].email,
              username: result.data[0].username,
            })
          );
          this.redirectTo({ val: "Home" });
        } else {
          this.errorMessage = "Incorrect email or password";
        }
      }
    },
  },
};
</script>
<style lang=""></style>
