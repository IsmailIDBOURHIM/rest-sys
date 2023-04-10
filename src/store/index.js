import { createStore } from "vuex";
import router from "@/router/index";
import axios from "axios";

const state = {
  app: {
    name: "Vue AdminLTE",
  },
  isUserLoggedIn: "",
  loggedInUserId: "",
  numberOfCategories: "",
  listOfCategories: [],
  listOfLocations: [],
  listOfItems: [],
};

const getters = {};

const mutations = {
  redirectTo(state, payload) {
    router.push({ name: payload });
  },
  isLoggedInUser(state) {
    let user = localStorage.getItem("user-info");
    if (user) {
      state.isUserLoggedIn = true;
      state.loggedInUserId = JSON.parse(user).id;
    } else {
      state.isUserLoggedIn = false;
    }
  },
  async displayAllCategories(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/categories?userId=${payload.userId}&locationId=${payload.locationId}`
    );

    if (result.status === 200) {
      state.listOfCategories = result.data;
      state.numberOfCategories = result.data.length;
    }
  },

  async canUserAccessThisLocation(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${payload.userId}&id=${payload.locationId}`
    );
    if (result.status === 200) {
      state.listOfLocationts = result.data;
      if (state.listOfLocationts.length !== 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    }
  },
  async canUserAccessThisCategory(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/categories?userId=${payload.userId}&locationId=${payload.locationId}&id=${payload.categoryId}`
    );
    if (result.status === 200) {
      state.listOfCategories = result.data;
      if (result.data.length !== 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    }
  },
  async canUserAccessThisItem(state, payload) {
    let result = await axios.get(
      `http://localhost:3000/items?userId=${payload.userId}&locationId=${payload.locationId}&id=${payload.itemId}`
    );
    state.listOfItems = result.data[0];
    if (result.status === 200) {
      if (result.data.length !== 1) {
        this.commit("redirectTo", payload.redirectToPage);
      }
    }
  },
};

const actions = {
  redirectTo({ commit }, payload) {
    commit("redirectTo", payload.val);
  },
};
const modules = {};

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules,
});
