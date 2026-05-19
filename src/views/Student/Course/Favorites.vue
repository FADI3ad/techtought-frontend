<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../../services/axios";
import CourseCard from "../../../components/courses/CourseCard.vue";
import Footer from "../../../components/layout/Footer.vue";

const favorites = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();

async function fetchFavorites() {
  try {
    loading.value = true;
    const response = await api.get("/favorites");
    // The backend returns: { status: 'success', data: { favorites: [...] } }
    favorites.value = response.data.data.favorites;
  } catch (err) {
    console.error("Error fetching favorites:", err);
    error.value = "Failed to load your wishlist. Please try again later.";
  } finally {
    loading.value = false;
  }
}

async function removeFavorite(courseId) {
  try {
    const response = await api.delete(`/favorites/${courseId}`);
    if (response.data.status === "success") {
      // Animate removal from local array
      favorites.value = favorites.value.filter((course) => course.id !== courseId);
    }
  } catch (err) {
    console.error("Failed to remove favorite:", err);
  }
}

onMounted(() => {
  fetchFavorites();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-900 via-indigo-900 to-slate-900 text-white py-14 shadow-md">
      <div class="max-w-[1340px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl lg:text-4xl font-black mb-2 tracking-tight">My Wishlist</h1>
          <p class="text-indigo-200 font-medium">Keep track of the courses you want to learn next</p>
        </div>
        <button 
          @click="router.push('/home')"
          class="self-start md:self-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 rounded-xl text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Browse
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow max-w-[1340px] mx-auto px-6 lg:px-10 py-12 w-full">
      <!-- Loading State -->
      <div v-if="loading" class="py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div v-for="n in 4" :key="n" class="bg-white rounded-2xl border border-gray-150 p-4 space-y-4 animate-pulse">
            <div class="aspect-video bg-gray-200 rounded-xl w-full"></div>
            <div class="h-5 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="pt-4 border-t border-gray-100 flex justify-between">
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white border border-red-100 p-10 rounded-2xl text-center max-w-lg mx-auto shadow-sm">
        <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl font-black">!</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button @click="fetchFavorites" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all active:scale-95">
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="favorites.length === 0" class="bg-white border border-gray-200/80 p-16 rounded-3xl text-center max-w-2xl mx-auto shadow-sm my-8">
        <div class="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <h3 class="text-2xl font-black text-gray-900 mb-2">Your wishlist is empty</h3>
        <p class="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
          Explore our wide range of professional courses, teach with high quality materials, and add the courses you love to your wishlist!
        </p>
        <button 
          @click="router.push('/home')" 
          class="px-8 py-3.5 btn-global rounded-xl font-extrabold transition-all active:scale-95 shadow-lg shadow-primary-100/50"
        >
          Find Courses
        </button>
      </div>

      <!-- Favorites Grid with smooth exit transitions -->
      <div v-else class="relative">
        <TransitionGroup 
          name="list" 
          tag="div" 
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <div 
            v-for="course in favorites" 
            :key="course.id" 
            class="group bg-white border border-gray-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative"
          >
            <!-- Hover Action: Remove Favorite Top-Right Button -->
            <button 
              @click.stop="removeFavorite(course.id)"
              class="absolute top-6 right-6 z-20 w-8 h-8 rounded-full bg-white/95 hover:bg-red-50 text-red-500 hover:text-red-600 shadow-md border border-gray-100 flex items-center justify-center transition-all duration-200 active:scale-90"
              title="Remove from wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            <!-- Reusing CourseCard -->
            <div class="flex-grow flex flex-col">
              <CourseCard :course="course" />
            </div>

            <!-- Remove Button / Go to Details Button at bottom -->
            <div class="mt-4 pt-3 border-t border-gray-100 flex gap-2">
              <button 
                @click="router.push({ name: 'course-details', params: { slug: course.slug } })"
                class="flex-grow py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold text-xs rounded-xl transition-all active:scale-[0.97]"
              >
                View Details
              </button>
              <button 
                @click="removeFavorite(course.id)"
                class="px-3.5 py-2.5 border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-500 rounded-xl transition-all active:scale-[0.97] flex items-center justify-center"
                title="Remove Course"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* List Transitions for beautiful animation when deleting */
.list-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(15px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-15px);
}
.list-leave-active {
  position: absolute;
  width: 100%;
  max-width: 290px; /* aligns to grid sizes */
  z-index: 0;
}
.list-move {
  transition: transform 0.4s ease;
}
</style>
