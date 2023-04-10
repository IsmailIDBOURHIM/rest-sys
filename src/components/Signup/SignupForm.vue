<template>
  <div class="hold-transition login-page bg-light">
    <div class="login-box">
      <div class="card card-outline card-primary">
        <div
          class="alert alert-warning text-center mb-0"
          role="alert"
          v-if="errorMessage !== ''"
        >
          {{ errorMessage }}
        </div>
        <div class="card-header text-center">
          <p href="" class="h1"><b>Sign</b> up</p>
        </div>
        <div class="card-body">
          <p class="login-box-msg">Register a new membership</p>
          <form @submit.prevent="signup">
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.username.$error }"
                placeholder="Username"
                v-model="username"
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-user"></span>
                </div>
              </div>
              <div class="invalid-feedback" v-if="v$.username.$error">
                {{ v$.username.$errors[0].$message }}
              </div>
            </div>
            <div class="input-group mb-3">
              <input
                type="email"
                class="form-control"
                :class="{
                  'is-invalid': v$.email.$error,
                }"
                placeholder="Email"
                v-model="email"
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
                v-model="password"
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
                  Sign up
                </button>
              </div>
            </div>
          </form>
          <br />
          <a class="text-center" @click="redirectTo({ val: 'Login' })">
            I already have a membership
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";

export default {
  name: "SignupForm",
  data() {
    return {
      v$: useValidate(),
      username: "",
      email: "",
      password: "",
      errorMessage: "",
      emailAllUsers: [],
    };
  },
  validations() {
    return {
      username: { required },
      email: { required, email },
      password: { required, minLength: minLength(6), maxLength: maxLength(12) },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.redirectTo({ val: "Home" });
    } else {
      this.getAllEmails();
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async getAllEmails() {
      const res = await axios.get("http://localhost:3000/users");
      if (res.status == 200) {
        res.data.forEach((user) => {
          this.emailAllUsers.push(user.email);
        });
      }
    },
    async signup() {
      this.errorMessage = "";
      this.v$.$validate();
      if (!this.v$.$error) {
        if (!this.emailAllUsers.includes(this.email)) {
          await axios
            .post("http://localhost:3000/users", {
              username: this.username,
              email: this.email,
              password: this.password,
            })
            .then((response) => {
              localStorage.setItem(
                "user-info",
                JSON.stringify({
                  id: response.data.id,
                  username: response.data.username,
                  email: response.data.email,
                })
              );
              this.redirectTo({ val: "Home" });
            })
            .catch((e) => {
              console.log("error", e);
            });
        } else {
          this.errorMessage = "This email already exists, please change it";
        }
      }
    },
  },
};
</script>
