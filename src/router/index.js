import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";

// 1. Guest Views
import HomeGuest from "../views/Home/HomeGuest.vue";
import Login from "../views/Auth/Login.vue";
import SignUp from "../views/Auth/Signup.vue";
import InstructorApplication from "../views/Instructor/InstructorApplication.vue";

// 2. Auth/Student Views
import HomeAuth from "../views/Home/HomeAuth.vue";
import CategoryCourses from "../views/Course/CategoryCourses.vue";

const routes = [
  // =========================================================================
  // GUEST ROUTES (Public access only, redirected if logged in)
  // =========================================================================
  {
    path: "/",
    name: "HomeGuest",
    component: HomeGuest,
    meta: { guest: false },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { guest: true },
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
    meta: { guest: true },
  },
  {
    path: "/instructor-application",
    name: "instructor-application",
    component: InstructorApplication,
    meta: { guest: true },
  },

  // =========================================================================
  // STUDENT / SHARED AUTH ROUTES
  // =========================================================================
  {
    path: "/dashboard",
    name: "HomeAuth",
    component: HomeAuth,
    meta: { requiresAuth: true },
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
    path: "/course/:slug",
    name: "course-details",
    component: () => import("../views/Course/CourseDetails.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/my-learning",
    name: "my-learning",
    component: () => import("../views/Course/MyCourses.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/course/:slug/learn",
    name: "course-lesson",
    component: () => import("../views/Course/CourseLessons.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("../views/Cart/Cart.vue"),
    meta: { requiresAuth: true },
  },

  // =========================================================================
  // INSTRUCTOR ROUTES
  // =========================================================================
  {
    path: "/instructor/dashboard",
    name: "instructor-dashboard",
    component: () => import("../views/Instructor/InstructorDashboard.vue"),
    meta: { requiresAuth: true, role: "instructor" },
  },
  {
    path: "/instructor/my-courses",
    name: "instructor-courses",
    component: () => import("../views/Instructor/InstructorCourseList.vue"),
    meta: { requiresAuth: true, role: "instructor" },
  },
  {
    path: "/instructor/my-courses/:slug/content",
    name: "instructor-course-content",
    component: () => import("../views/Instructor/InstructorCourseContent.vue"),
    meta: { requiresAuth: true, role: "instructor" },
  },
  {
    path: "/instructor/create-course",
    name: "create-course",
    component: () => import("../views/Instructor/InstructorCreateCourse.vue"),
    meta: { requiresAuth: true, role: "instructor" },
  },

  // =========================================================================
  // ADMIN ROUTES
  // =========================================================================
  {
    path: "/admin/dashboard",
    name: "admin-dashboard",
    component: () => import("../views/Admin/AdminDashboard.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/admin/instructor-requests/:slug",
    name: "instructor-request-details",
    component: () => import("../views/Admin/InstructorRequestDetails.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// =========================================================================
// NAVIGATION GUARD (RBAC)
// =========================================================================
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const userRole = auth.user?.role;

  // 1. Force login for protected routes
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: "login" });
  }

  // 2. Prevent logged-in users from accessing guest pages (Login/Signup)
  if (to.meta.guest && auth.isLoggedIn) {
    if (userRole === "admin" || userRole === "super_admin") {
      return next({ name: "admin-dashboard" });
    }
    if (userRole === "instructor") {
      return next({ name: "instructor-dashboard" });
    }
    return next({ name: "HomeAuth" });
  }

  // 3. Role-Based Access Control
  if (to.meta.role) {
    const isAdmin = userRole === "admin" || userRole === "super_admin";
    const isInstructor = userRole === "instructor";

    // Admin required
    if (to.meta.role === "admin" && !isAdmin) {
      return next({ name: "HomeAuth" });
    }

    // Instructor required (Admins are also allowed)
    if (to.meta.role === "instructor" && !isInstructor && !isAdmin) {
      return next({ name: "HomeAuth" });
    }
  }

  next();
});

export default router;
