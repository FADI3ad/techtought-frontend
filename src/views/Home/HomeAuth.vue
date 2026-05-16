<script setup>
  import { ref, onMounted } from "vue";
  import WelcomeHeader from "../../components/layout/WelcomeHeader.vue";
  import CourseCarousel from "../../components/courses/CourseCarousel.vue";
  import CourseCard from "../../components/courses/CourseCard.vue";
  import Footer from "../../components/layout/Footer.vue";
  import api from "../../services/axios";

  const trendingCourses = ref([]);
  const fundamentalsCourses = ref([]);
  const topRatedCourses = ref([]);
  const topRatedPage = ref(1);
  const hasMoreTopRated = ref(true);
  const loadingTopRated = ref(false);

  async function loadData() {
    try {
      const resTrending = await api.get("categories/trending/courses");
      trendingCourses.value = resTrending.data.data.category.courses;

      const resFundamentals = await api.get(
        "categories/computer-fundamentals/courses",
      );
      fundamentalsCourses.value = resFundamentals.data.data.category.courses;
      
      await loadTopRated();
    } catch (error) {
      console.error("Error loading courses:", error);
      // Fallback mocks...
    }
  }

  async function loadTopRated() {
    if (loadingTopRated.value || !hasMoreTopRated.value) return;
    loadingTopRated.value = true;
    try {
      const response = await api.get(`/top-rated-courses?page=${topRatedPage.value}`);
      const newCourses = response.data.data.courses.data;
      topRatedCourses.value = [...topRatedCourses.value, ...newCourses];
      
      if (response.data.data.courses.next_page_url) {
        topRatedPage.value++;
      } else {
        hasMoreTopRated.value = false;
      }
    } catch (error) {
      console.error("Failed to load top rated:", error);
    } finally {
      loadingTopRated.value = false;
    }
  }

  onMounted(() => {
    loadData();
    
    // Intersection Observer for Lazy Loading
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadTopRated();
      }
    }, { threshold: 0.1 });
    
    const target = document.querySelector("#lazy-trigger");
    if (target) observer.observe(target);
  });
</script>

<template>
  <div class="min-h-screen bg-white">
    <WelcomeHeader />

    <main class="max-w-[1340px] mx-auto px-6 lg:px-10 space-y-12 pb-24">
      <CourseCarousel
        title="Top courses in Computer Fundamentals"
        :courses="fundamentalsCourses" />

      <div class="h-px bg-gray-100 w-full"></div>

      <CourseCarousel
        title="Trending Courses"
        :courses="trendingCourses" />

      <div class="h-px bg-gray-100 w-full"></div>

      <section class="py-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">
            Top Rated Courses
          </h2>
          <div class="w-20 h-1.5 bg-indigo-600 mt-2 rounded-full"></div>
          <p class="text-sm text-gray-500 mt-3">The best of TechTought across all categories.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="course in topRatedCourses" :key="course.id">
            <CourseCard :course="course" />
          </div>
        </div>

        <!-- Lazy Loading Trigger -->
        <div id="lazy-trigger" class="h-20 flex items-center justify-center mt-12">
          <div v-if="loadingTopRated" class="flex gap-2">
            <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div class="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          </div>
          <p v-else-if="!hasMoreTopRated" class="text-gray-400 text-sm font-medium">You've reached the end of our top picks!</p>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
  main {
    font-family: "Inter", sans-serif;
  }
</style>
