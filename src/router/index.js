import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Signup from "../views/Signup";
import Login from "../views/Login";
import ForgotPassword from "../components/forgotPassword/ForgotPassword.vue";
import RecoverPassword from "../components/recoverPassword/RecoverPassword.vue";
import Profile from "../views/Profile";
import AddNewLocation from "../components/Locations/AddNewLocation.vue";
import UpdateLocation from "../components/Locations/UpdateLocation.vue";
import Menu from "../components/Menu/Menu.vue";
import ViewCategories from "../components/Menu/ViewCategories.vue";
import AddNewCategory from "../components/Menu/AddNewCategory.vue";
import UpdateCategory from "../components/Menu/UpdateCategory.vue";
import AddNewItem from "../components/Menu/AddNewItem.vue";
import UpdateItem from "../components/Menu/UpdateItem.vue";
import ErrorPage from "../views/ErrorPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  // {
  //   path: "/about",
  //   name: "About",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
  {
    path: "/sign-up",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/recover-password/:userId",
    name: "RecoverPassword",
    component: RecoverPassword,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/add-new-location",
    name: "AddNewLocation",
    component: AddNewLocation,
  },
  {
    path: "/update-location/:id",
    name: "UpdateLocation",
    component: UpdateLocation,
  },
  {
    path: "/menu/location/:locationId",
    name: "Menu",
    component: Menu,
  },
  {
    path: "/menu/categories/view/:locationId",
    name: "ViewCategories",
    component: ViewCategories,
  },
  {
    path: "/menu/categories/add/:locationId",
    name: "AddNewCategory",
    component: AddNewCategory,
  },
  {
    path: "/menu/categories/update/:locationId/:categoryId",
    name: "UpdateCategory",
    component: UpdateCategory,
  },
  {
    path: "/menu/items/add/:locationId",
    name: "AddNewItem",
    component: AddNewItem,
  },
  {
    path: "/menu/item/update/:itemId/location/:locationId",
    name: "UpdateItem",
    component: UpdateItem,
  },
  //stays last
  {
    path: "/:catchAll(.*)",
    name: "ErrorPage",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.params.pageTitle !== undefined) {
    document.title = `${to.name} | ${to.params.pageTitle} | ${process.env.VUE_APP_TITLE}`;
  } else {
    if (to.name === null) {
      document.title = `Unknown Page | ${process.env.VUE_APP_TITLE}`;
    } else {
      document.title = `${to.name} | ${process.env.VUE_APP_TITLE}`;
    }
  }
  next();
});

export default router;
