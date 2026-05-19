<script setup>
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useAuthStore } from "../../../stores/useAuthStore";
  import api from "../../../services/axios";

  // Components
  import CourseHero from "../../../components/courses/details/CourseHero.vue";
  import CourseSidebar from "../../../components/courses/details/CourseSidebar.vue";
  import CourseDescription from "../../../components/courses/details/CourseDescription.vue";
  import CourseContent from "../../../components/courses/details/CourseContent.vue";
  import CourseReviews from "../../../components/courses/details/CourseReviews.vue";
  import CourseComments from "../../../components/courses/details/CourseComments.vue";
  import Footer from "../../../components/layout/Footer.vue";

  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const course = ref(null);
  const loading = ref(true);
  const error = ref(null);

  async function handleEnroll() {
    if (!authStore.isLoggedIn) {
      router.push("/login");
      return;
    }

    if (course.value.is_enrolled) {
      router.push(`/course/${course.value.slug}/learn`);
      return;
    }

    if (course.value.is_free) {
      try {
        const response = await api.post("/enroll", {
          course_id: course.value.id,
        });
        if (response.data.status === "success") {
          router.push(`/course/${course.value.slug}/learn`);
        }
      } catch (err) {
        console.error("Enrollment failed:", err);
      }
    } else {
      router.push("/cart");
    }
  }

  async function getCourse() {
    try {
      loading.value = true;
      const slug = route.params.slug;

      const response = await api.get(`/courses/${slug}`);
      course.value = response.data.data.course;
    } catch (err) {
      console.error("Error fetching course:", err);
      error.value = "Failed to load course data. Please try again later.";
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    getCourse();
  });
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div
        class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      <p class="text-gray-500 font-medium animate-pulse">
        Loading course details...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div
        class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <svg
          class="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ error }}</h2>
      <button
        @click="getCourse"
        class="mt-4 text-primary-600 font-bold hover:underline">
        Try Again
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="course">
      <CourseHero :course="course" @enroll="handleEnroll" />

      <section class="pb-24 pt-12">
        <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
          <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <!-- Sidebar Column (Shown first on mobile) -->
            <CourseSidebar 
              :course="course" 
              @favorite-toggled="(val) => course.is_favorite = val"
              class="order-1 lg:order-2" 
            />

            <!-- Main Column (Shown second on mobile) -->
            <div class="flex-grow order-2 lg:order-1 space-y-10">
              <CourseDescription :course="course" />
              <CourseContent :sections="course.sections" />
              <CourseReviews
                :course-id="course.id"
                :course-slug="course.slug"
                :is-enrolled="course.is_enrolled"
                @review-submitted="getCourse" />
              <CourseComments
                :course-id="course.id"
                :course-slug="course.slug" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <Footer />
  </div>
</template>

<style scoped></style>
