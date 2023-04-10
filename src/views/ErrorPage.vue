<template lang="">
  <div class="d-flex flex-column align-items-center mt-4">
    <h2>ooops!!!!</h2>
    <img src="../../public/error.jpg" alt="Eroor 404" class="image" /><br />
    <router-link :to="userId ? { name: 'Home' } : { name: 'Login' }">
      <button class="btn btn-primary">Visit Home Page</button>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "ErrorPage",
  data() {
    return {
      userId: null,
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.userId = JSON.parse(user).id;
    }
  },
};
</script>
<style lang="scss" scoped>
.image {
  width: 900px;
  height: 700px;
}
.btn {
  font-size: 18px;
}
</style>
