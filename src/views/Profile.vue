<template lang="">
  <Navbar />
  <div class="card">
    <div class="card-header">
      <h1 class="card-title font-weight-bold">Update Your Profile</h1>
    </div>
    <div class="card-body">
      <form @submit.prevent="update()">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text"><i class="fas fa-user"></i></span>
          </div>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': v$.username.$error }"
            placeholder="Username"
            v-model="state.username"
          />
          <div class="invalid-feedback" v-if="v$.username.$error">
            {{ v$.username.$errors[0].$message }}
          </div>
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text"
              ><i class="fas fa-envelope"></i
            ></span>
          </div>
          <input
            type="email"
            class="form-control"
            :class="{ 'is-invalid': v$.email.$error }"
            placeholder="Email"
            v-model="state.email"
          />
          <div class="invalid-feedback" v-if="v$.email.$error">
            {{ v$.email.$errors[0].$message }}
          </div>
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text"><i class="fas fa-lock"></i></span>
          </div>
          <input
            type="password"
            class="form-control"
            :class="{ 'is-invalid': v$.password.$error }"
            placeholder="password"
            v-model="state.password"
          />
          <div class="invalid-feedback" v-if="v$.password.$error">
            {{ v$.password.$errors[0].$message }}
          </div>
        </div>
        <button type="submit" class="btn btn-primary float-end">Update</button>
      </form>
    </div>
  </div>
</template>
<script>
import Navbar from "@/components/Header/Navbar.vue";
import useValidate from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import axios from "axios";
import { reactive, computed } from "vue";
import { mapActions } from "vuex";

export default {
  name: "Profile",
  components: {
    Navbar,
  },
  setup() {
    const state = reactive({
      username: "",
      email: "",
      password: "",
    });
    const rules = computed(() => {
      return {
        username: { required },
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
      userId: null,
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.userId = JSON.parse(user).id;
      this.state.username = JSON.parse(user).username;
      this.state.email = JSON.parse(user).email;
    } else {
      this.redirectTo({ val: "Login" });
    }
  },
  methods: {
    ...mapActions(["redirectTo"]),
    async update() {
      this.v$.$validate();
      if (!this.v$.$error) {
        await axios
          .put(`http://localhost:3000/users/${this.userId}`, {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
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
      }
    },
  },
};
</script>
<style lang=""></style>
