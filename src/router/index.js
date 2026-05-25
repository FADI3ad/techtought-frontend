import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";

// 1. Guest Views
import HomeGuest from "../views/Student/HomeGuest.vue";
import Login from "../views/auth/Login.vue";
import SignUp from "../views/auth/Signup.vue";
import InstructorApplication from "../views/Student/InstructorApplication.vue";

// 2. Auth/Student Views
import HomeAuth from "../views/Student/HomeAuth.vue";
import CategoryCourses from "../views/Student/Course/CategoryCourses.vue";

const routes = [
  // =========================================================================
  // GUEST ROUTES (Public access only, redirected if logged in)
  // =========================================================================
  {
    path: "/",
    name: "HomeGuest",
    component: HomeGuest,
    meta: { guest: true },
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
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/Student/ContactView.vue"),
    meta: { requiresAuth: false },
  },

  // =========================================================================
  // STUDENT / SHARED AUTH ROUTES
  // =========================================================================
  {
    path: "/home",
    name: "HomeAuth",
    component: HomeAuth,
    meta: { requiresAuth: true },
  },
  {
    path: "/category/:slug",
    name: "category",
    component: CategoryCourses,
    meta: { requiresAuth: false },
  },
  {
    path: "/category/:slug/:subSlug",
    name: "subcategory",
    component: CategoryCourses,
    meta: { requiresAuth: false },
  },
  {
    path: "/course/:slug",
    name: "course-details",
    component: () => import("../views/Student/Course/CourseDetails.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/my-learning",
    name: "my-learning",
    component: () => import("../views/Student/Course/MyCourses.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/course/:slug/learn",
    name: "course-lesson",
    component: () => import("../views/Student/Course/CourseLessons.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("../views/Student/Cart.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/favorites",
    name: "favorites",
    component: () => import("../views/Student/Course/Favorites.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/submit-testimonial",
    name: "submit-testimonial",
    component: () => import("../views/Student/Testimonials.vue"),
    meta: { requiresAuth: true },
  },

  // =========================================================================
  // INSTRUCTOR ROUTES
  // =========================================================================
  {
    path: "/instructor/dashboard",
    component: () => import("../views/Instructor/InstructorLayout.vue"),
    meta: { requiresAuth: true, role: "instructor" },
    children: [
      {
        path: "",
        name: "instructor-dashboard",
        component: () => import("../views/Instructor/components/Overview.vue"),
      },
      {
        path: "courses",
        name: "instructor-courses",
        component: () => import("../views/Instructor/components/CourseManagement.vue"),
      },
      {
        path: "courses/create",
        name: "instructor-create-course",
        component: () => import("../views/Instructor/components/CourseForm.vue"),
      },
      {
        path: "courses/:slug/edit",
        name: "instructor-edit-course",
        component: () => import("../views/Instructor/components/CourseForm.vue"),
      },
      {
        path: "courses/:slug/curriculum",
        name: "instructor-curriculum",
        component: () => import("../views/Instructor/components/CurriculumBuilder.vue"),
      },
      {
        path: "reviews",
        name: "instructor-reviews",
        component: () => import("../views/Instructor/components/ReviewsComments.vue"),
      }
    ]
  },

  // =========================================================================
  // ADMIN ROUTES
  // =========================================================================
  {
    path: "/admin/dashboard",
    component: () => import("../views/Admin/AdminDashboard.vue"),
    meta: { requiresAuth: true, role: "admin" },
    children: [
      {
        path: "",
        name: "admin-dashboard",
        component: () => import("../views/Admin/components/DashboardOverview.vue"),
      },
      {
        path: "categories",
        name: "admin-categories",
        component: () => import("../views/Admin/components/CategoryManagement.vue"),
      },
      {
        path: "subcategories",
        name: "admin-subcategories",
        component: () => import("../views/Admin/components/SubcategoryManagement.vue"),
      },
      {
        path: "users",
        name: "admin-users",
        component: () => import("../views/Admin/components/UserManagement.vue"),
      },
      {
        path: "instructors",
        name: "admin-instructors",
        component: () => import("../views/Admin/components/InstructorRequests.vue"),
      },
      {
        path: "testimonials",
        name: "admin-testimonials",
        component: () => import("../views/Admin/components/TestimonialManagement.vue"),
      },
      {
        path: "courses",
        name: "admin-courses",
        component: () => import("../views/Admin/components/CourseManagement.vue"),
      },
      {
        path: "contacts",
        name: "admin-contacts",
        component: () => import("../views/Admin/components/ContactMessages.vue"),
      },
      {
        path: "subscriptions",
        name: "admin-subscriptions",
        component: () => import("../views/Admin/components/NewsletterManagement.vue"),
      },
      {
        path: "settings",
        name: "admin-settings",
        component: () => import("../views/Admin/components/SettingsManagement.vue"),
      },
      {
        path: "theme",
        name: "admin-theme",
        component: () => import("../views/Admin/components/ThemeSettings.vue"),
      }
    ]
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
