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
  {
    path: "/dashboard",
    name: "HomeAuth",
    component: HomeAuth,
    meta: { requiresAuth: true },
  },
  { path: "/login", name: "login", component: Login, meta: { guest: true } },
  { path: "/signup", name: "signup", component: SignUp, meta: { guest: true } },
  {
    path: "/instructor-application",
    name: "instructor-application",
    component: InstructorApplication,
    meta: { guest: true },
  },
  {
    path: "/category/:slug",
    name: "category",
    component: CategoryCourses,
    meta: { requiresAuth: true },
  },
  {
    path: "/category/:slug/:subSlug",
    name: "subcategory",
    component: CategoryCourses,
    meta: { requiresAuth: true },
  },

  {
    path: "/instructor/create-course",
    name: "create-course",
    component: () => import("../views/InstructorCreateCourse.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/course/:slug",
    name: "course-details",
    component: () => import("../views/CourseDetails.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/course/:slug/learn",
    name: "course-lesson",
    component: () => import("../views/CourseLessons.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/admin/dashboard",
    name: "admin-dashboard",
    component: () => import("../views/AdminDashboard.vue"),
    meta: { requiresAuth: false, requiresAdmin: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const role = auth.user?.role;
  const isAdmin = role === "admin" || role === "super_admin";

  if (to.meta.requiresAuth && !auth.isLoggedIn) next("/login");
  else if (to.meta.requiresAdmin && !isAdmin) next("/dashboard");
  else if (to.meta.guest && auth.isLoggedIn) next("/dashboard");
  else next();
});

export default router;
