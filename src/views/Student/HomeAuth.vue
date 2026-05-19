<script setup>
import { ref, onMounted, nextTick } from "vue";
import WelcomeHeader from "../../components/layout/WelcomeHeader.vue";
import CourseCarousel from "../../components/courses/CourseCarousel.vue";
import Footer from "../../components/layout/Footer.vue";
import api from "../../services/axios";

// State
const categoriesList = ref([]);
const loadedCategories = ref([]);
const currentCategoryIndex = ref(0);
const loadingNextCategory = ref(false);
const hasMoreCategories = ref(true);

// 1. Fetch All Categories first
async function fetchCategories() {
  try {
    const response = await api.get("/categories");
    categoriesList.value = response.data.data.categories || [];
    
    // Load the very first category to kick-start
    if (categoriesList.value.length > 0) {
      await loadNextCategory();
    } else {
      hasMoreCategories.value = false;
    }
  } catch (error) {
    console.error("Error fetching categories list:", error);
    hasMoreCategories.value = false;
  }
}

// 2. Lazily load the next category that contains courses
async function loadNextCategory() {
  if (loadingNextCategory.value || !hasMoreCategories.value) return;

  if (currentCategoryIndex.value >= categoriesList.value.length) {
    hasMoreCategories.value = false;
    return;
  }

  loadingNextCategory.value = true;

  try {
    const nextCat = categoriesList.value[currentCategoryIndex.value];
    const response = await api.get(`/categories/${nextCat.slug}/all-courses`);
    const fetchedCategoryObj = response.data.data.category;
    const courses = fetchedCategoryObj.courses || [];

    if (courses.length > 0) {
      // Sort and slice for "Recent Courses" (sorted by created_at descending)
      const recentCourses = [...courses]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 8); // increased to 8 to allow scrolling in carousel

      // Sort and slice for "Top Rated Courses" (sorted by average rating descending)
      const topRatedCourses = [...courses]
        .sort((a, b) => {
          const ratingA = parseFloat(a.avg_rating || a.reviews_avg_rating || 0);
          const ratingB = parseFloat(b.avg_rating || b.reviews_avg_rating || 0);
          return ratingB - ratingA;
        })
        .slice(0, 8); // increased to 8 to allow scrolling in carousel

      // Save category with its segmented courses
      loadedCategories.value.push({
        id: fetchedCategoryObj.id,
        name: fetchedCategoryObj.name,
        slug: fetchedCategoryObj.slug,
        recentCourses,
        topRatedCourses,
      });

      // Increment index
      currentCategoryIndex.value++;
      loadingNextCategory.value = false;
    } else {
      // Category has NO courses - skip it silently and search for the next one immediately
      currentCategoryIndex.value++;
      loadingNextCategory.value = false;
      
      // Recursive call to find the next category with courses
      await loadNextCategory();
    }
  } catch (error) {
    console.error("Error loading category courses lazily:", error);
    currentCategoryIndex.value++;
    loadingNextCategory.value = false;
    
    // Continue loading next if error occurs
    await loadNextCategory();
  }
}

// 3. Initialize IntersectionObserver for lazy loading trigger
let observer = null;

function setupIntersectionObserver() {
  const trigger = document.querySelector("#lazy-category-trigger");
  if (!trigger) return;

  observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting && !loadingNextCategory.value && hasMoreCategories.value) {
        await loadNextCategory();
      }
    },
    { threshold: 0.1, rootMargin: "200px" }
  );

  observer.observe(trigger);
}

onMounted(async () => {
  await fetchCategories();
  // Ensure DOM is fully updated before observing
  nextTick(() => {
    setupIntersectionObserver();
  });
});
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col font-sans">
    <!-- Student Header -->
    <WelcomeHeader />

    <!-- Main Content Container -->
    <main class="flex-grow max-w-[1340px] mx-auto px-6 lg:px-10 pb-24 w-full">
      <div class="pt-10 pb-2">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">What to learn next</h1>
      </div>

      <!-- Category Sections Loop -->
      <div class="space-y-4">
        <template v-for="cat in loadedCategories" :key="cat.id">
          <!-- 1. Recent Courses Carousel -->
          <CourseCarousel
            v-if="cat.recentCourses.length > 0"
            :title="`Recent in ${cat.name}`"
            :courses="cat.recentCourses"
          />

          <!-- 2. Top Rated Courses Carousel -->
          <CourseCarousel
            v-if="cat.topRatedCourses.length > 0"
            :title="`Top Rated in ${cat.name}`"
            :courses="cat.topRatedCourses"
          />
        </template>
      </div>

      <!-- Lazy Loading Category Trigger / Loading Shimmer -->
      <div id="lazy-category-trigger" class="py-10 flex flex-col items-center justify-center">
        <!-- Skeleton Loader for Next Category -->
        <div v-if="loadingNextCategory" class="w-full space-y-6 animate-pulse">
          <div class="mb-8">
            <div class="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div class="w-20 h-1.5 bg-gray-200 mt-2 rounded-full"></div>
          </div>
          <div class="flex gap-6 overflow-hidden">
            <div v-for="i in 5" :key="i" class="flex-shrink-0 w-[280px] space-y-3">
              <div class="aspect-video bg-gray-200 rounded-xl w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- End of picks message -->
        <div v-else-if="!hasMoreCategories && loadedCategories.length > 0" class="text-center py-12 space-y-2">
          <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 class="text-base font-bold text-gray-900">You're All Caught Up!</h4>
          <p class="text-sm text-gray-500">We've displayed all available categories.</p>
        </div>

        <!-- Empty state across all categories -->
        <div v-else-if="!hasMoreCategories && loadedCategories.length === 0" class="text-center py-20 mx-auto">
          <div class="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No courses available</h3>
          <p class="text-gray-500">Check back later for fresh learning materials!</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
main {
  font-family: "Inter", sans-serif;
}
</style>
