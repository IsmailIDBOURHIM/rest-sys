<template lang="">
  <div class="login-page bg-light" style="min-height: 398px">
    <div class="login-box">
      <div class="card card-outline card-primary">
        <div class="card-header text-center">
          <a href="" class="h1"><b>Recover</b>Password</a>
        </div>
        <div class="card-body">
          <p class="login-box-msg">
            You are only one step a way from your new password, recover your
            password now.
          </p>
          <form @submit.prevent="recoverPassword">
            <div class="input-group mb-3">
              <input
                v-model="state.password"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': v$.password.$error }"
                placeholder="Password"
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
            <div class="input-group mb-3">
              <input
                v-model="state.passwordConfirmation"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': v$.passwordConfirmation.$error }"
                placeholder="Confirm Password"
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
              <div
                class="invalid-feedback"
                v-if="v$.passwordConfirmation.$error"
              >
                {{ v$.passwordConfirmation.$errors[0].$message }}
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <button type="submit" class="btn btn-primary btn-block">
                  Change password
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
import { required, minLength, maxLength, sameAs } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import axios from "axios";
import swalAlert from "@/Alert/alert.js";

export default {
  name: "RecoverPassword",
  mixins: [swalAlert],
  setup() {
    const state = reactive({
      password: "",
      passwordConfirmation: "",
    });
    const rules = computed(() => {
      return {
        password: {
          required,
          minLength: minLength(6),
          maxlength: maxLength(12),
        },
        passwordConfirmation: {
          sameAsPassword: sameAs(state.password),
        },
      };
    });

    const v$ = useValidate(rules, state);

    return { state, v$ };
  },
  data() {
    return {
      userId: this.$route.params.userId,
      username: "",
      email: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.redirectTo({ val: "Home" });
    } else {
      this.getUserById(this.userId);
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async getUserById(id) {
      await axios
        .get(`http://localhost:3000/users/${id}`)
        .then((user) => {
          this.username = user.data.username;
          this.email = user.data.email;
        })
        .catch((e) => {
          this.showErrorToaster(e.message);
        });
    },
    async recoverPassword() {
      this.v$.$validate();
      if (!this.v$.$error) {
        await axios
          .put(`http://localhost:3000/users/${this.userId}`, {
            email: this.email,
            username: this.username,
            password: this.state.password,
          })
          .then(() => {
            this.$router.push({ name: "Login" });
            this.showSuccessToaster(
              "The password has been successfully updated."
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
