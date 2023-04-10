<template>
  <Navbar />
  <section class="header">
    <div class="d-flex justify-content-between align-items-center">
      <router-link
        :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
      >
        <button type="button" class="btn btn-success">
          View/Add Categories
        </button>
      </router-link>
      <span class="badge bg-danger">Menu Page</span>
      <router-link
        :to="{ name: 'AddNewItem', params: { locationId: locationId } }"
      >
        <button
          type="button"
          class="btn btn-success"
          :disabled="numberOfCategories == 0"
        >
          Add New Items
        </button>
      </router-link>
    </div>
    <br />
    <h4 class="text-center mb-0">{{ locationName }}</h4>
    <div class="text-center text-muted">{{ locationAddress }}</div>
  </section>
  <section class="filters my-4">
    <div class="d-flex justify-content-between">
      <div class="filter-icone" @click="show">
        <i class="fas fa-filter"></i>
      </div>
      <button class="btn btn-sm bg-danger" @click="deleteAllItems">
        Delete all
      </button>
    </div>
    <form class="mt-3" action="">
      <Transition>
        <div v-if="isShow">
          <div class="d-flex gap-3">
            <select class="custom-select" v-model="filters.categoryId">
              <option class="text-muted" value="0" :disabled="true">
                Select category name
              </option>
              <option
                v-for="(category, i) in listOfCategories"
                :key="i"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <input
              type="text"
              class="form-control"
              placeholder="Name"
              v-model="filters.name"
            />
            <input
              type="text"
              class="form-control"
              placeholder="Description"
              v-model="filters.description"
            />
            <select class="custom-select" v-model="filters.priceRange">
              <option class="text-muted" value="0" :disabled="true">
                Range price
              </option>
              <option
                v-for="(priceRange, i) in priceRanges"
                :key="i"
                :value="priceRange.id"
              >
                {{ priceRange.name }}
              </option>
            </select>
          </div>
          <div class="buttons mt-4 d-flex gap-2 justify-content-end">
            <button
              type="submit"
              class="btn btn-primary"
              @click.prevent="resetFilter"
            >
              Reset
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              @click.prevent="filterItems"
            >
              Filter
            </button>
          </div>
        </div>
      </Transition>
    </form>
  </section>
  <section class="content">
    <div class="card card-solid">
      <div class="card-body pb-0">
        <div class="row">
          <div v-if="filtredItems.length === 0">
            <div class="alert alert-warning" role="alert">
              No Items Added Yet
            </div>
          </div>
          <div
            class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column"
            v-for="item in filtredItems"
            :key="item.id"
          >
            <div class="card bg-light d-flex flex-fill">
              <div class="card-header text-muted font-weight-bold">
                <strong>Category : </strong>
                <span class="text-dark s-18">
                  {{ item.categoryName }}
                </span>
              </div>
              <div class="card-body pt-0">
                <div class="row">
                  <h2 class="lead mt-2">
                    <b>{{ item.name }}</b>
                  </h2>
                  <div class="d-flex justify-content-between">
                    <p class="text-muted text-sm">
                      <b>price: </b> {{ item.price }}
                    </p>
                    <p class="text-muted text-sm">
                      <b>quantity: </b> {{ item.qty }}
                    </p>
                  </div>
                  <div class="text-muted text-description">
                    {{ item.description }}
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <div class="text-right">
                  <button
                    class="btn btn-sm bg-danger mr-2"
                    @click="deleteConfirmation(item.id)"
                  >
                    <i class="fas fa-trash"></i> Delete
                  </button>
                  <router-link
                    class="btn btn-sm btn-primary"
                    :to="{
                      name: 'UpdateItem',
                      params: { itemId: item.id, locationId: locationId },
                    }"
                  >
                    <i class="fas fa-pen"></i> Update
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import Navbar from "@/components/Header/Navbar.vue";
import axios from "axios";
import { mapActions, mapState, mapMutations } from "vuex";
import swalAlert from "@/Alert/alert.js";

export default {
  name: "Menu",
  components: {
    Navbar,
  },
  mixins: [swalAlert],
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.redirectTo({ val: "Login" });
    } else {
      this.userId = JSON.parse(user).id;
      this.userName = JSON.parse(user).username;
      this.isLoggedInUser();
      this.displayAllCategories();
      this.canUserAccessThisLocation({
        userId: this.userId,
        locationId: this.locationId,
        redirectToPage: "Home",
      });
      this.getLocationData();
      this.getAllItems();
    }
  },
  data() {
    return {
      userId: "",
      userName: "",
      locationId: this.$route.params.locationId,
      locationName: "",
      locationAddress: "",
      filtredItems: [],
      allItems: [],
      listOfCategories: [],
      isShow: false,
      filters: {
        categoryId: 0,
        name: "",
        description: "",
        priceRange: 0,
      },
      priceRanges: [
        {
          id: 1,
          min: 0,
          max: 20,
          name: "less than 20",
        },
        {
          id: 2,
          min: 20,
          max: 40,
          name: "20-40",
        },
        {
          id: 3,
          min: 40,
          max: 60,
          name: "40-60",
        },
        {
          id: 4,
          min: 60,
          max: 10000000,
          name: "greater than 60",
        },
      ],
    };
  },
  computed: {
    ...mapState(["isUserLoggedIn", "loggedInUserId"]),
  },
  methods: {
    ...mapActions(["redirectTo"]),
    ...mapMutations(["isLoggedInUser", "canUserAccessThisLocation"]),
    async getLocationData() {
      let res = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
      );
      if (res.status === 200) {
        this.locationName = res.data[0].restaurantName;
        this.locationAddress = res.data[0].address;
      }
    },
    async displayAllCategories() {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${this.userId}&locationId=${this.locationId}`
      );

      if (result.status === 200) {
        this.listOfCategories = result.data;
      }
    },
    async getAllItems() {
      let res = await axios.get(
        `http://localhost:3000/items?userId=${this.userId}&locationId=${this.locationId}`
      );
      if (res.data) {
        this.allItems = res.data.map((item) => {
          const categoryName = this.getCategoryNameById(item.categoryId);
          return {
            ...item,
            categoryName: categoryName,
          };
        });
        this.filtredItems = this.allItems;
      }
    },
    getCategoryNameById(categoryId) {
      const category = this.listOfCategories.filter(
        (cat) => cat.id === categoryId
      );
      return category[0].name;
    },
    show() {
      this.isShow = !this.isShow;
    },
    filterItems() {
      this.filtredItems = this.allItems;
      if (this.filtredItems.length === 0) {
        return this.filtredItems;
      }

      if (this.filters.name !== "") {
        this.filtredItems = this.filtredItems.filter((item) => {
          return item?.name
            ?.toLowerCase()
            .includes(this.filters.name.toLowerCase());
        });
      }

      if (this.filters.description !== "") {
        this.filtredItems = this.filtredItems.filter((item) => {
          return item?.description
            ?.toLowerCase()
            .includes(this.filters.description.toLowerCase());
        });
      }

      if (this.filters.categoryId !== 0) {
        this.filtredItems = this.filtredItems.filter((item) => {
          return item.categoryId === this.filters.categoryId;
        });
      }

      if (this.filters.priceRange !== 0) {
        const rangeObject = this.priceRanges.filter((range) => {
          return range.id === this.filters.priceRange;
        });
        this.filtredItems = this.filtredItems.filter((item) => {
          return (
            item.price <= rangeObject[0].max && item.price > rangeObject[0].min
          );
        });
      }
    },
    resetFilter() {
      this.filters = {
        categoryId: 0,
        name: "",
        description: "",
        priceRange: 0,
      };
      this.filtredItems = this.allItems;
    },
    deleteConfirmation(itemId) {
      let message = "Are you sure want to delete this item ?";
      this.showSwalConfirm(
        message,
        () => {
          this.deleteItem(itemId);
        },
        () => {}
      );
    },
    async deleteItem(itemId) {
      await axios
        .delete(`http://localhost:3000/items/${itemId}`)
        .then(() => {
          this.getAllItems();
          this.showSuccessToaster(
            "your restaurant has been successfully deleted"
          );
        })
        .catch((e) => {
          this.showErrorToaster(e.message);
        });
    },
    async deleteAllItems() {
      let message = "Do you really want to delete all items ?";
      this.showSwalConfirm(
        message,
        async () => {
          // let haveError = this.deleteAll();
          let haveError = false;
          for (let i = 0; i < this.allItems.length; i++) {
            let result = await axios.delete(
              `http://localhost:3000/items/${this.allItems[i].id}`
            );

            if (result.status !== 200) {
              haveError = true;
            }
          }
          if (haveError === false) {
            this.resetFilter();
            this.showSuccessToaster("All items have been deleted.");
            this.allItems = [];
            this.filtredItems = [];
          } else {
            this.showErrorToaster("Something went wrong");
          }
        },
        () => {}
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.content .text-description {
  height: 72px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-align: justify;
}
.s-18 {
  font-size: 18px;
}
.filter-icone {
  padding: 8px;
  border-radius: 5px;
  width: fit-content;
  background: #343a40;
  i {
    margin: 0 !important;
    font-size: 30px;
    margin-bottom: 15px;
    color: white;
  }
}
.v-enter-active,
.v-leave-active {
  transition: 0.3s;
}

.v-enter-from,
.v-leave-to {
  transition: 0.3s;
}
</style>
