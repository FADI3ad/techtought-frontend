import { createRouter, createWebHistory } from "vue-router";
import HomeGuest from "../views/HomeGuest.vue";
import CategoryCourses from "../views/CategoryCourses.vue";
import HomeAuth from "../views/HomeAuth.vue";
import SignUp from "../views/auth/Signup.vue";
import Login from "../views/auth/Login.vue";
import InstructorApplication from "../views/InstructorApplication.vue";
import { useAuthStore } from "../stores/authStore";

const routes = [
  { path: "/", name: "HomeGuest", component: HomeGuest, meta: { guest: true } },
  { path: "/dashboard", name: "HomeAuth", component: HomeAuth, meta: { requiresAuth: true } },
  { path: "/login", name: "login", component: Login, meta: { guest: true } },
  { path: "/signup", name: "signup", component: SignUp, meta: { guest: true } },
  { path: "/instructor-application", name: "instructor-application", component: InstructorApplication, meta: { guest: true }},
  { path: "/category", name: "category", component: CategoryCourses, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) next("/login");
  else if (to.meta.guest && auth.isLoggedIn) next("/dashboard");
  else next();
});

export default router;