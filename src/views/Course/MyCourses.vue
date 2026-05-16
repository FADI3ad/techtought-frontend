<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/axios";
import CourseCard from "../../components/courses/CourseCard.vue";
import Footer from "../../components/layout/Footer.vue";

const courses = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();

async function fetchMyCourses() {
  try {
    loading.value = true;
    const response = await api.get("/my-learning");
    courses.value = response.data.data.courses;
  } catch (err) {
    console.error("Error fetching my learning courses:", err);
    error.value = "Failed to load your courses. Please try again later.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchMyCourses();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-indigo-900 text-white py-12">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10">
        <h1 class="text-3xl font-black mb-2">My Learning</h1>
        <p class="text-indigo-200">Continue where you left off</p>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow max-w-[1340px] mx-auto px-6 lg:px-10 py-12 w-full">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="text-gray-500 font-medium animate-pulse">Loading your courses...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-100 p-8 rounded-2xl text-center max-w-lg mx-auto">
        <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">!</div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Something went wrong</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button @click="fetchMyCourses" class="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">Try Again</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="courses.length === 0" class="bg-white border border-gray-200 p-12 rounded-2xl text-center max-w-2xl mx-auto shadow-sm">
        <div class="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No courses yet</h3>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">You haven't enrolled in any courses. Start exploring our categories to find something interesting!</p>
        <button @click="router.push('/dashboard')" class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Browse Courses</button>
      </div>

      <!-- Course Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="course in courses" :key="course.id" class="group">
          <CourseCard :course="course" />
          <div class="mt-4">
            <button 
              @click="router.push(`/course/${course.slug}/learn`)"
              class="w-full py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors group-hover:bg-indigo-600 group-hover:text-white"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* Any custom styles for My Learning page */
</style>
