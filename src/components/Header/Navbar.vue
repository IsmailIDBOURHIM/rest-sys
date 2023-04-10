<template lang="">
  <nav class="navbar navbar-expand navbar-muted navbar-dark">
    <ul class="navbar-nav">
      <li class="nav-item d-none d-sm-inline-block">
        <a href="#" class="nav-link">
          <span class="font-weight-bold text-white">Restauration</span>
        </a>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <router-link :to="{ name: 'Home' }">
          <a href="#" class="nav-link">Home</a>
        </router-link>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <router-link :to="{ name: 'Signup' }">
          <a href="#" class="nav-link">Signup</a>
        </router-link>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a
          class="nav-link"
          data-widget="navbar-search"
          data-target="#navbar-search3"
          href="#"
          role="button"
        >
          <i class="fas fa-search"></i>
        </a>
        <div
          class="navbar-search-block"
          id="navbar-search3"
          style="display: none"
        >
          <form class="form-inline">
            <div class="input-group input-group-sm">
              <input
                class="form-control form-control-navbar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div class="input-group-append">
                <button class="btn btn-navbar" type="submit">
                  <i class="fas fa-search"></i>
                </button>
                <button
                  class="btn btn-navbar"
                  type="button"
                  data-widget="navbar-search"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </li>

      <li class="nav-item">
        <a class="nav-link" data-widget="fullscreen" href="#" role="button">
          <i class="fas fa-expand-arrows-alt"></i>
        </a>
      </li>
      <li class="nav-item mr-2">
        <router-link :to="{ name: 'Profile' }">
          <a href="#" class="nav-link btn btn-outline-info">{{ username }}</a>
        </router-link>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link btn btn-outline-info" @click="logout()">
          Logout
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      username: "",
    };
  },
  created() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.username = JSON.parse(user).username;
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  padding-right: 10px;
  padding-left: 10px;
  margin-bottom: 20px;
}
</style>
